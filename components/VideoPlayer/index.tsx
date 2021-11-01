import { Slider, Tooltip } from "@material-ui/core";
import {
  Forward10,
  Pause,
  PauseCircleOutline,
  PlayArrow,
  PlayCircleOutline,
  ReplayOutlined,
  Replay,
  Replay10,
  VolumeDown,
  VolumeOff,
  VolumeUp,
  Fullscreen,
  FullscreenExit
} from "@material-ui/icons";
import { ChangeEvent, forwardRef, memo, PropsWithoutRef, useCallback, useEffect, useRef, useState } from "react";
import { findDOMNode } from "react-dom";
import ReactPlayer from "react-player";
import screenfull from "screenfull";
import { formatDuration } from "../../sub_modules/common/utils/timeFormat";
import './style.scss';

const VideoPlayer = forwardRef((props: PropsWithoutRef<{
  playOnRender: boolean;
  id?: string;
  className?: string;
  videoUrl?: string;
}>, ref: any) => {
  const {
    id,
    playOnRender,
    className,
    videoUrl
  } = props;
  const [isPlaying, setPlaying] = useState(!!playOnRender);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [playedSecs, setPlayedSecs] = useState(0);
  const [isSeeking, setSeeking] = useState(false);
  const [isEnd, setEnd] = useState(false);
  const [isFullScreen, setFullScreen] = useState(false);

  const videoPlayerRef = useRef<ReactPlayer>();
  const videoContainerRef = useRef<HTMLDivElement>();

  useEffect(() => {
    const exitHandler = () => {
      if (
        !document.fullscreenElement &&
        !document['webkitIsFullScreen'] &&
        !document['mozFullScreen'] &&
        !document['msFullscreenElement']
      ) {
        setFullScreen(false);
      }
    }

    document.addEventListener('fullscreenchange', exitHandler);
    document.addEventListener('webkitfullscreenchange', exitHandler);
    document.addEventListener('mozfullscreenchange', exitHandler);
    document.addEventListener('MSFullscreenChange', exitHandler);

    return () => {
      document.removeEventListener('fullscreenchange', exitHandler);
      document.removeEventListener('webkitfullscreenchange', exitHandler);
      document.removeEventListener('mozfullscreenchange', exitHandler);
      document.removeEventListener('MSFullscreenChange', exitHandler);
    };
  }, []);

  const handlePausePlay = () => {
    if (!isEnd) {
      setPlaying(!isPlaying);
    } else {
      videoPlayerRef?.current?.seekTo(0);
      setPlaying(true);
      setEnd(false);
    }
  }

  const handleChangeVolume = (event: ChangeEvent<any>, value: number) => {
    if (value > 0 && muted) setMuted(false);
    setVolume(value);
  }

  const handleBackward = useCallback(() => {
    if (playedSecs >= 10) {
      videoPlayerRef?.current?.seekTo(playedSecs - 10);
      setPlayedSecs(playedSecs - 10);
    }
    if (isEnd) setEnd(false);
  }, [playedSecs, isEnd]);

  const handleForward = useCallback(() => {
    if (playedSecs + 10 <= duration) {
      videoPlayerRef?.current?.seekTo(playedSecs + 10);
      setPlayedSecs(playedSecs + 10);
    } else {
      videoPlayerRef?.current?.seekTo(duration);
      setPlayedSecs(duration);
    }
  }, [duration, playedSecs]);

  const handleScreenFull = () => {
    if (screenfull.isEnabled) {
      if (isFullScreen) {
        screenfull.toggle();
        setFullScreen(false);
      } else {
        screenfull.request(findDOMNode(videoContainerRef.current) as Element);
        setFullScreen(true);
      }
    }
  }

  return (
    <div {...{ id }} className={`com-video-player-main${className ? ` ${className}` : ''}`} ref={videoContainerRef}>
      <div
        className={`com-video-player-main-overlay${isPlaying ? ' play' : ''}`}
      >
        <div className="com-video-player-main-screen" onClick={handlePausePlay}>
          {!!isEnd
            ? <ReplayOutlined className="com-video-player-main-play-pause-button" /> :
            (isPlaying
              ? <PauseCircleOutline className="com-video-player-main-play-pause-button" />
              : <PlayCircleOutline className="com-video-player-main-play-pause-button" />)
          }
        </div>
        <div className="player-seek">
          <Slider
            className="player-seek-slider"
            aria-label="Seek"
            min={0}
            max={duration}
            step={1}
            value={playedSecs}
            onChange={(_, value) => {
              setSeeking(true);
              setPlayedSecs(value as number);
            }}
            onChangeCommitted={(_, value) => {
              videoPlayerRef.current.seekTo(value as number, "seconds");
              setSeeking(false);
            }}

          />
        </div>

        <div className="player-toolbars">
          <div className="player-toolbars-left">
            <Tooltip title={isEnd ? 'Phát lại' : (isPlaying ? 'Tạm dừng' : 'Phát')} placement="top">
              <div
                className="player-toolbars-button player-toolbars-play-pause"
                onClick={handlePausePlay}
              >
                {isEnd ? <Replay /> : (isPlaying ? <Pause /> : <PlayArrow />)}
              </div>
            </Tooltip>

            <Tooltip title="Tua lại 10s" placement="top">
              <div
                className="player-toolbars-button player-toolbars-backward"
                onClick={handleBackward}
              >
                <Replay10 />
              </div>
            </Tooltip>

            <Tooltip title="Tua tiếp 10s" placement="top">
              <div
                className="player-toolbars-button player-toolbars-forward"
                onClick={handleForward}
              >
                <Forward10 />
              </div>
            </Tooltip>

            <Tooltip title={muted || volume === 0 ? 'Bật âm thanh' : 'Tắt tiếng'} placement="top">
              <div
                className="player-toolbars-button player-toolbars-volume"
                onClick={() => setMuted(!muted)}
              >
                {muted || volume === 0
                  ? <VolumeOff />
                  : (volume < 0.5 ? <VolumeDown /> : <VolumeUp />)
                }
              </div>
            </Tooltip>
            <Slider
              className="player-toolbars-volume-slider"
              aria-label="Volume"
              value={muted ? 0 : volume}
              min={0}
              max={1}
              step={0.05}
              onChange={handleChangeVolume}
            />
          </div>

          <div className="player-toolbars-right">
            <div className="player-toolbars-time">
              {`${formatDuration(playedSecs, 'seconds', 'mm:ss')} / ${formatDuration(duration, 'seconds', 'mm:ss')}`}
            </div>
            <Tooltip title="Toàn màn hình" placement="top">
              <div className="player-toolbars-button player-toolbars-fullscreen" onClick={handleScreenFull}>
                {isFullScreen ? <FullscreenExit /> : <Fullscreen />}
              </div>
            </Tooltip>
          </div>
        </div>
      </div>

      <div className="com-video-player-main-wrap">
        <ReactPlayer
          className="react-player"
          url={videoUrl}
          playing={isPlaying}
          pip={false}
          width="100%"
          height="100%"
          controls={false}
          volume={volume}
          muted={muted}
          playsinline={false}
          ref={videoPlayerRef}
          onPlay={() => {
            if (!isPlaying) setPlaying(true);
          }}
          onPause={() => {
            if (isPlaying) setPlaying(false);
          }}
          onDuration={(e) => {
            setDuration(e);
          }}
          onProgress={({ playedSeconds }) => {
            if (!isSeeking) {
              setPlayedSecs(playedSeconds);
            }
          }}
          onEnded={() => {
            setEnd(true);
            setPlaying(false);
          }}
          config={{
            file: {
              attributes: {
                disablePictureInPicture: true,
                controlsList: 'nodownload'
              }
            }
          }}
        />
      </div>
    </div>
  )
});

export default memo(VideoPlayer);
