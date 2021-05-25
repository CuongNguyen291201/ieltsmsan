import { memo, useCallback, useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import { useSelector } from 'react-redux';
import { AppState } from '../../../redux/reducers';
import { response_status_codes } from '../../../sub_modules/share/api_services/http_status';
import Topic from '../../../sub_modules/share/model/topic';
import TopicProgress from '../../../sub_modules/share/model/topicProgress';
import { apiGetTopicProgress, apiUpdateTopicProgress } from '../../../utils/apis/topicApi';
import './style.scss';

const LessonVideoView = (props: {
  topic: Topic,
}) => {
  const { topic } = props;
  const url = topic.videoUrl;
  const { currentUser } = useSelector((state: AppState) => state.userReducer);
  const [topicProgress, setTopicProgress] = useState<TopicProgress | null>(null);
  const [isUpdateProgress, setUpdateProgress] = useState(false);

  useEffect(() => {
    if (!topicProgress) {
      apiGetTopicProgress({ courseId: topic.courseId, parentId: topic.parentId, topicId: topic._id, userId: currentUser._id })
        .then(({ data, status }) => {
          if (status === response_status_codes.success) {
            setTopicProgress(data);
          }
        });
    }
  }, []);

  useEffect(() => {
    if (isUpdateProgress && (topicProgress?.progress ?? 0) < 100) {
      apiUpdateTopicProgress({
        topicId: topic._id,
        userId: currentUser._id,
        progress: 100
      });
    }
  }, [isUpdateProgress]);

  const onProgress = (played: number) => {
    if (!currentUser) return;
    if (played >= 0.5 && !isUpdateProgress && !!topicProgress) {
      setUpdateProgress(true);
      return;
    }
  };

  return (
    <div className="lesson-video-view">
      <div className="lesson-video-player-wrapper">
        <ReactPlayer
          className="lesson-video-player"
          style={{ maxWidth: 1024, maxHeight: 576, margin: '0 auto' }}
          width="100%"
          height="100%"
          url={url}
          playing={true}
          pip={false}
          playsinline={false}
          onProgress={(e) => onProgress(e.played)}
          controls={true}
          loop={false}
          light="/default/video-thumbnail-default.jpg"
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
}

export default memo(LessonVideoView);
