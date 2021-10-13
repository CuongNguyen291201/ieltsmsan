import React, { ChangeEvent, Fragment, useEffect, useState } from 'react';
import { findDOMNode } from 'react-dom';
import ReactPlayer from 'react-player';
import screenfull, { Screenfull } from 'screenfull';
import moment from 'moment';
import { apiGetTimeStamp } from '../../utils/apis/topicApi';
import FullscreenIcon from '../../public/icon/fullscreen.svg';
import ExitFullscreenIcon from '../../public/icon/fullscreen_exit.svg';
import LiveStream from '../../public/icon/live-stream.svg';
import ViewStream from '../../public/icon/view-stream.svg';
import VolumeOffIcon from '../../public/icon/volume_off.svg';
import VolumeUpIcon from '../../public/icon/volume_up.svg';
import ScenarioInfo from '../../sub_modules/share/model/scenarioInfo';
import PlayIcon from '../../public/icon/play-button.svg';
import './style.scss';

const StreamComponent = (props: { dataTotalUser: number; dataScenario: ScenarioInfo; setIsEndLive: (isEndLive: boolean) => void }) => {
  const { dataTotalUser, dataScenario, setIsEndLive } = props;
  let screen = null;
  const [volume, setVolume] = useState(0.5);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMute, setIsMute] = useState(false);
  const [dataTimeCurrent, setDataTimeCurrent] = useState(0);
  const [isPlay, setIsPlay] = useState(false);
  const [key, setKey] = useState(Math.random());

  const exitHandler = () => {
    if (
      !document.fullscreenElement &&
      !document['webkitIsFullScreen'] &&
      !document['mozFullScreen'] &&
      !document['msFullscreenElement']
    ) {
      setIsFullscreen(false)
    }
  }

  useEffect(() => {
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
  }, [exitHandler]);

  const handleVolumeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setIsMute(false)
    setVolume(parseFloat(e.target.value))
  }

  const handleMuteChange = () => {
    setIsMute((state) => !state)
  }

  const handleClickFullscreen = () => {
    if (isFullscreen) {
      (screenfull as Screenfull).toggle()
      setIsFullscreen(false)
    } else {
      (screenfull as Screenfull).request(findDOMNode(screen) as Element)
      setIsFullscreen(true)
    }
  }

  const onPlayLive = async () => {
    const dataTime = await apiGetTimeStamp({})
    setDataTimeCurrent(dataTime.timeStamp ?? moment().valueOf())
    setIsPlay(true)
    setKey(Math.random())
  }

  const ref = (player: HTMLElement) => {
    screen = player
  }

  return (
    <div className="stream-component">
      <figure ref={ref}>
        {!isPlay && <img
          className="play-icon"
          alt="play-icon"
          onClick={() => {
            onPlayLive()
          }}
          src={PlayIcon}
        />}
        <ReactPlayer
          // ref={refVideo}
          key={key}
          className='react-player-scenario'
          url={dataScenario?.url ?? ''}
          controls={false}
          volume={isMute ? 0 : volume}
          loop={false}
          pip={false}
          playing={isPlay}
          playsinline={false}
          onEnded={() => setIsEndLive(true)}
          onStart={() => { }}
          onError={e => { }}
          onReady={(e) => {
            if (isPlay && dataScenario.startTime) e.seekTo(Math.round((Number(dataTimeCurrent) - dataScenario.startTime) / 1000));
          }}
          onContextMenu={(e: any) => e.preventDefault()}
          config={{
            file: {
              attributes: {
                disablePictureInPicture: true,
                controlsList: 'nodownload',
              }
            }
          }} />
        <div className="top-player-component">
          <div className="live-stream">
            <div className="stream-text">
              Trực Tiếp
            </div>
            <img className="stream-image" src={LiveStream} alt="" />
          </div>
          <div className="view-stream">
            <div className="stream-text">
              {dataTotalUser}
            </div>
            <img className="stream-image" src={ViewStream} alt="" />
          </div>
        </div>
        <div className="bottom-player-component no-select">
          <Fragment>
            <div className="volume">
              <button className="volume-button" onClick={handleMuteChange}>
                <img
                  src={
                    isMute ? VolumeOffIcon : VolumeUpIcon
                  }
                  alt=""
                />
              </button>
            </div>
            <div className="volume-scrub">
              <input
                type="range"
                min={0}
                max={1}
                step="any"
                // orient="vertical"
                name="volume"
                className="volume-slider"
                value={isMute ? 0 : volume}
                onChange={handleVolumeChange}
              />
            </div>
            <div className="stream-progress" />
          </Fragment>
          <div className="expand">
            <button
              onClick={() => handleClickFullscreen()}
              className="fullscreen"
            >
              <img src={isFullscreen ? ExitFullscreenIcon : FullscreenIcon} alt="" />
            </button>
          </div>
        </div>
      </figure>
    </div>
  );
};

export default StreamComponent;