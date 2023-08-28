/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import styles from "./App.module.css";
import logo from "./assets/logo.svg";

import TrackRow from "./components/TrackRow";
import AudioPlayer from "./components/AudioPlayer";
import PlaylistRow from "./components/PlaylistRow";
import { postAPICall, deleteAPICall, getAPICall } from "./components/service";

function App() {
  const [tracks, setTracks] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [callPlayistAPI, setCallPlayistAPI] = useState(true);

  const [inputField, setInputField] = useState("");
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [showAddPlaylist, setShowAddPlaylist] = useState(false);
  const [showAddTrackToPlaylist, setShowAddTrackToPlaylist] = useState(false);

  const [currentTrack, setCurrentTrack] = useState();
  const [selectedTrackId, setSelectedTrackId] = useState(null);
  const [currentPlaylistTracks, setCurrentPlaylistTrack] = useState([]);
  const [currentPlayList, setCurrentPlayList] = useState(null);

  //  API Call For Tracks
  useEffect(() => {
    fetch("http://0.0.0.0:8000/tracks/", { mode: "cors" })
      .then((res) => res.json())
      .then((data) => {
        setTracks(data);
      });
  }, []);

  //  API Call For Playlist
  useEffect(() => {
    if (callPlayistAPI) {
      fetch("http://0.0.0.0:8000/playlist/", { mode: "cors" })
        .then((res) => res.json())
        .then((data) => {
          setPlaylists(data);
          setCallPlayistAPI(false);
        });
    }
  }, [callPlayistAPI]);

  // To play the selected track
  const handlePlay = (track) => setCurrentTrack(track);

  // To delete the playlist
  const removePlaylist = async (playistid) => {
    const url = `http://localhost:8000/delete_playlist/${playistid}`;
    if (await deleteAPICall(url)) {
      setCallPlayistAPI(true);
      if (playistid == currentPlayList) {
        selectPlaylist(null);
      }
    }
  };

  // Function to Add the Playlist
  const handleAddPlaylist = (flag) => {
    setInputField("");
    setShowAddPlaylist(flag);
  };

  // Function to Change Track
  const switchTrack = () =>{
    setShowPlaylist(false)
    setCurrentPlayList(null)
    setCurrentPlaylistTrack([])
  }

  // Function to Add track to the selected playist
  const handleAddTrackToPlaylist = async (playistid) => {
    const reqBody = {
      playlist_id: playistid,
      track_id: selectedTrackId,
    };
    const url = "http://localhost:8000/add_track_to_playlist";

    if (await postAPICall(url, reqBody)) {
      handleShowAddTrackToPlaylist(false);
    }
  };

  // Function to Show the Playlist Modal in track page
  const handleShowAddTrackToPlaylist = (flag, trackid = null) => {
    setShowAddTrackToPlaylist(flag);
    if (trackid) {
      setSelectedTrackId(trackid);
    }
  };

  // Function to remove the track from the playlist
  const handleRemoveTrackToPlaylist = async (trackId) => {
    const url = `http://localhost:8000/delete_track_from_playlist/${currentPlayList}/${trackId}`;
    if(await deleteAPICall(url)){
      selectPlaylist(currentPlayList)
    }
  };

  // Function to call an api for adding the playlist in DB
  const addPlayistToDb = async () => {
    const reqBody = {
      name: inputField,
    };
    const url = "http://localhost:8000/add_playlist";
    const val = await postAPICall(url, reqBody);
    if (val) {
      setCallPlayistAPI(true);
      handleAddPlaylist(false);
    }
  };

  // Function to Select the Playlist to see its tracks
  const selectPlaylist = async (val) => {
    if (val) {
      setCurrentPlayList(val);
      const url = `http://localhost:8000/playlist_with_track/${val}`;
      const playistTrackData = await getAPICall(url);
      if (playistTrackData && playistTrackData.length > 0) {
        let trackData = [];
        playistTrackData.map((val) => {
          let trackVal = tracks.filter((track) => track.id === val.track_id);
          trackData.push(trackVal[0]);
        });
        setCurrentPlaylistTrack(trackData);
      } else {
        setCurrentPlaylistTrack([]);
      }
    } else {
      setCurrentPlayList(null);
    }
  };

  // Function to Handle the input field use for the addition of new playlist
  const handleInputField = (evt) => {
    const value = evt.target.value;
    if (value && value.length > 0) {
      setInputField(value);
    } else {
      setInputField(null);
    }
  };

  // Tracks Page Body
  const trackBody = (records, trackVisible = true) => {
    if (trackVisible) {
      return records.map((track, ix) => (
        <TrackRow
          key={"track" + ix}
          track={track}
          handlePlay={handlePlay}
          showPlaylist={showPlaylist}
          handleShowAddTrackToPlaylist={handleShowAddTrackToPlaylist}
          handleRemoveTrackToPlaylist={handleRemoveTrackToPlaylist}
        />
      ));
    } else {
      return records.map((playlist, ix) => (
        <PlaylistRow
          key={"playlist" + ix}
          playlist={playlist}
          selectPlaylist={selectPlaylist}
          removePlaylist={removePlaylist}
        />
      ));
    }
  };

  // Playlist Page Body
  const playlistBody = () => {
    return (
      <div className={styles.flex}>
        <div className={styles.leftpart}>
          {trackBody(playlists, false)}
          <div className={styles.addpadding + " " + styles.newplaylistbdiv}>
            <PlaylistRow
              playlist={null}
              handleAddPlaylist={handleAddPlaylist}
              removePlaylist={removePlaylist}
            />
          </div>
        </div>
        <div className={styles.rightpart + ' ' + (currentPlaylistTracks.length>0 && styles.removeCenter)}>
          {currentPlayList ? (
            currentPlaylistTracks.length > 0 ? (
              trackBody(currentPlaylistTracks)
            ) : (
              <div className={styles.smoke}>
                {/* Pick a playlist, let the beats roll! */}
                Oopsie-daisy! This playlist's feeling a bit ghostly - add some
                funk!
              </div>
            )
          ) : (
            <div className={styles.smoke}>
              Pick a playlist, let the beats roll!
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Modal For the addition of new playlist */}
      {showAddPlaylist && (
        <>
          <div className={styles.modal}>
            <div className={styles.modalcontent}>
              <div className={styles.modalheader}>
                <span
                  className={styles.close}
                  onClick={() => handleAddPlaylist(false)}
                >
                  &times;
                </span>
                <h2>Add Playlist</h2>
              </div>
              <div className={styles.modalbody}>
                <input
                  type="text"
                  value={inputField}
                  onChange={handleInputField}
                  placeholder="Groovy times ahead! What's the name of your jammin' playlist?"
                />
              </div>
              <div className={styles.modalfooter}>
                <button
                  onClick={() => handleAddPlaylist(false)}
                  className={
                    styles.newplaylistbutton + " " + styles.cancelbutton
                  }
                >
                  Cancel
                </button>
                {inputField && inputField.length > 0 ? (
                  <button
                    className={styles.newplaylistbutton}
                    onClick={addPlayistToDb}
                  >
                    Save
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Modal For the selection of playlist for track */}
      {showAddTrackToPlaylist && (
        <>
          <div className={styles.modalbottom}>
            <div className={styles.modalcontent}>
              <div className={styles.modalheader}>
                <span
                  className={styles.close}
                  onClick={() => handleShowAddTrackToPlaylist(false)}
                >
                  &times;
                </span>
                <h2>Pick a playlist, and let's give that track a home!</h2>
              </div>
              <div className={styles.modaltrackbody}>
                {playlists && playlists.length > 0 ? (
                  playlists.map((track, ix) => (
                    <PlaylistRow
                      key={"playlist" + ix}
                      playlist={track}
                      showPlaylist={showPlaylist}
                      handleAddTrackToPlaylist={handleAddTrackToPlaylist}
                      removePlaylist={removePlaylist}
                      showAddTrackToPlaylist={showAddTrackToPlaylist}
                    />
                  ))
                ) : (
                  <h3 className={styles.center + " " + styles.smoke}>
                    {" "}
                    Oops! Looks like you have not added any playlist yet!
                  </h3>
                )}
              </div>
              <div className={styles.modalfooter}>
                <button
                  onClick={() => handleShowAddTrackToPlaylist(false)}
                  className={
                    styles.newplaylistbutton + " " + styles.cancelbutton
                  }
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Main Body */}
      <main className={styles.app}>
        <nav>
          <img src={logo} className={styles.logo} alt="Logo" />
          <ul className={styles.menu}>
            <li>
              <a
                href="#"
                onClick={() => switchTrack()}
                className={!showPlaylist && styles.active}
              >
                Tracks
              </a>
            </li>
            <li>
              <a
                href="#"
                onClick={() => setShowPlaylist(true)}
                className={showPlaylist && styles.active}
              >
                Playlists
              </a>
            </li>
          </ul>
        </nav>

        {/* Navigation logic b/w track & playlist page */}
        {(() => {
          switch (showPlaylist) {
            case false:
              return trackBody(tracks);
            case true:
              return playlistBody();
            default:
              return trackBody(tracks);
          }
        })()}
        {currentTrack && <AudioPlayer track={currentTrack} />}
      </main>
    </>
  );
}

export default App;
