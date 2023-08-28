import React from "react";
import styles from "./TrackRow.module.css";
import deleteIcon from '../assets/delete.svg'


function PlaylistRow({
  playlist,
  handlePlay,
  handleAddPlaylist,
  showPlaylist = true,
  selectPlaylist,
  handleAddTrackToPlaylist,
  removePlaylist
}) {
  return (
    <div className={styles.wrap}>
      <div className={styles.trackRow + " " + styles.left}>
        <div className={styles.trackInfo}>
          {playlist ? (
            <div
                className={styles.trackTitle}
                onClick={showPlaylist ?() => selectPlaylist(playlist.id) : ()=>handleAddTrackToPlaylist(playlist.id)}
              >
                {playlist.name}
              </div>
          ) : (
            <button
              className={styles.newplaylistbutton}
              onClick={() => handleAddPlaylist(true)}
            >
              + New Playlist
            </button>
          )}
        </div>
      </div>
      {playlist && showPlaylist ? (
        <div onClick={()=>removePlaylist(playlist.id)} className={styles.addtoplaylist + " " + styles.right}>
          <img src={deleteIcon} height="24" width="24"  alt="Delete" />
        </div>
      ) : null}
    </div>
  );
}

export default PlaylistRow;
