import React from "react";
import styles from "./TrackRow.module.css";
import deleteIcon from '../assets/delete.svg'

function TrackRow({
  track,
  handlePlay,
  showPlaylist,
  handleShowAddTrackToPlaylist,
  handleRemoveTrackToPlaylist
}) {
  return (
    <div className={styles.wrap}>
      <div className={styles.trackRow + " " + styles.left}>
        <button className={styles.trackPlay} onClick={() => handlePlay(track)}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M20 12L8 5V19L20 12Z" fill="white" />
          </svg>
        </button>
        <div className={styles.trackInfo}>
          <div className={styles.trackTitle}>{track.title}</div>

          <div className={styles.trackArtist}>
            {track.main_artists.join(", ")}
          </div>
        </div>
      </div>
      <div
        className={styles.addtoplaylist + " " + styles.right}
        onClick={showPlaylist ? ()=>handleRemoveTrackToPlaylist(track.id) : () => handleShowAddTrackToPlaylist(true,track.id)}
      >
        {showPlaylist ? <img src={deleteIcon} height="24" width="24" alt="Delete" />: "+"}
      </div>
    </div>
  );
}

export default TrackRow;
