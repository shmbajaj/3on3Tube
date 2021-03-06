import styles from "./VideoCard.styles.module.css";
import {
  makeDurationReadable,
  likedDislikedVideoOption,
  watchlaterVideoOption,
} from "./VideoCard.helpers";
import { useVideoCardHelper } from "./VideoCard.helper.hook";
import { PlaylistsModal, Loader, Alert } from "components";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  useAxios,
  useLikedVideosData,
  useWatchLaterData,
  useHistoryData,
} from "hooks";
import { useAuth } from "context";

function VideoCardIframe() {
  const params = useParams();
  const [info, setInfo] = useState(null);
  const [options, setOptions] = useState({
    likesIconText: "Like",
    likesIconType: "thumb_up",
    watchlaterIconText: "Watch Later",
    watchlaterIconType: "watch_later",
  });
  const [isModalRequired, setIsModalRequired] = useState(false);
  const [loaderDisplay, setLoaderDisplay] = useState(true);
  const {
    response: videoResponse,
    error: videoError,
    loading: videoLoading,
    requestData,
  } = useAxios();
  const { isLikedVideo } = useLikedVideosData();
  const { isInWatchLaterVideos } = useWatchLaterData();
  const {
    toggleWatchLaterOption,
    playlistOptionActionFalse,
    playlistOptionActionTrue,
    toggleLikeOption,
    alertOptions,
    setAlertOptions,
    toggleShow,
  } = useVideoCardHelper(options, setOptions, setIsModalRequired);
  const { toggleHistoryVideos } = useHistoryData();
  const { authState } = useAuth();

  useEffect(async () => {
    await requestData({
      method: "get",
      url: `/api/video/${params.videoId}`,
    });
  }, []);

  useEffect(() => {
    if (!videoLoading) {
      if (videoError === "") {
        setInfo(videoResponse.video);
        setLoaderDisplay(false);
        if (isLikedVideo(videoResponse.video.videoId)) {
          const object = likedDislikedVideoOption(true);
          setOptions((p) => ({ ...p, ...object }));
        }
        if (isInWatchLaterVideos(videoResponse.video.videoId)) {
          const object = watchlaterVideoOption(true);
          setOptions((p) => ({ ...p, ...object }));
        }
        if (authState.isLoggedIn) {
          toggleHistoryVideos(videoResponse.video);
        }
      } else {
        setAlertOptions(p => ({...p, type:"unhappy", show:true, message:videoError}))
      }
    }
  }, [videoLoading]);

  return (
    <>
      {info && (
        <div className={`${styles.videoCardContainer} w50break`}>
          <div className={`${styles.videoCard} gap-10 dflex flex-col`}>
            <div className={`${styles.videoCardPlayerContainer}`}>
              <iframe
                frameBorder="0"
                allowFullScreen="1"
                allow="autoplay; picture-in-picture"
                title="YouTube video player"
                width="100%"
                height="100%"
                type="text/html"
                src={`https://www.youtube.com/embed/${info.videoId}`}
                className={`${styles.videoCardPlayer}`}
              ></iframe>
            </div>

            <div className={`${styles.videoCardContent} dflex flex-col gap-10`}>
              <h2 className={`${styles.videoCardTitle}`}>{info.title}</h2>

              <div className={styles.videoCardCreatorDetails}>
                <img
                  src={info.avatarPath}
                  className={`avatar ${styles.videoCardCreatorAvatar}`}
                />
                <h4 className={`${styles.videoCardCreatorName}`}>
                  {info.creatorName}
                </h4>
                <div className={`${styles.videoCardViewsWrapper}`}>
                  <span
                    className={`material-icons-outlined ${styles.videoCardViewsIcon}`}
                  >
                    visibility
                  </span>
                  <span
                    className={`${styles.videoCardViews}`}
                  >{`${info.views} views`}</span>
                </div>
                <div className={`${styles.videoCardDurationWrapper}`}>
                  <span
                    className={`material-icons-outlined ${styles.videoCardDurationIcon}`}
                  >
                    timer
                  </span>
                  <span className={`${styles.videoCardDuration}`}>
                    {makeDurationReadable(info.duration)}
                  </span>
                </div>
              </div>

              <div className={`gap-10 ${styles.videoCardOptions}`}>
                <button
                  className={`cursor-pointer  font-wt-600 ${styles.optionButton}`}
                  onClick={() => toggleLikeOption(info)}
                >
                  <span className={`material-icons-outlined`}>
                    {options.likesIconType}
                  </span>
                  {options.likesIconText}
                </button>
                <button
                  className={`cursor-pointer  font-wt-600 ${styles.optionButton}`}
                  onClick={() => toggleWatchLaterOption(info)}
                >
                  <span className={`material-icons-outlined`}>
                    {options.watchlaterIconType}
                  </span>
                  {options.watchlaterIconText}
                </button>
                <button
                  className={`cursor-pointer  font-wt-600 ${styles.optionButton}`}
                  onClick={(e) => playlistOptionActionTrue(e)}
                >
                  <span className={`material-icons-outlined`}>
                    playlist_add
                  </span>
                  Save To Playlist
                </button>
              </div>

              <span className={`${styles.videoCardDescription}`}>
                {info.description}
              </span>
            </div>
          </div>
          <PlaylistsModal
            display={isModalRequired}
            displayHandler={playlistOptionActionFalse}
            video={info}
          />
        </div>
      )}
      {info === null && <Loader display={loaderDisplay} />}
      <Alert alertOptions={alertOptions} toggleShow={toggleShow} />
    </>
  );
}

export { VideoCardIframe };
