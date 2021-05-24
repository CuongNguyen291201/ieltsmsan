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
  const url = topic.description;
  const { currentUser } = useSelector((state: AppState) => state.userReducer);
  const [topicProgress, setTopicProgress] = useState<TopicProgress | null>(null);
  const [isUpdateProgress, setUpdateProgress] = useState(false);

  useEffect(() => {
    if (!currentUser) return;
    if (!topicProgress) {
      apiGetTopicProgress({ courseId: topic.courseId, parentId: topic.parentId, topicId: topic._id, userId: currentUser._id })
        .then(({ data, status }) => {
          if (status === response_status_codes.success) {
            setTopicProgress(data);
          }
        });
    }
  }, [currentUser]);

  const onProgress = (played: number) => {
    if (!currentUser) return;
    if (played >= 0.5 && !isUpdateProgress && !!topicProgress) {
      if (topicProgress.progress === 100) {
        setUpdateProgress(true);
        return;
      }
      apiUpdateTopicProgress({
        topicId: topic._id,
        userId: currentUser._id,
        progress: 100
      }).then(() => setUpdateProgress(true));
    }
  };

  return (
    <div className="lesson-video-view">
      <div className="lesson-video-player-wrapper">
        <ReactPlayer
          className="lesson-video-react-player"
          width="854px"
          height="480px"
          url={url}
          playing={true}
          pip={false}
          playsinline={false}
          onProgress={(e) => onProgress(e.played)}
          controls={true}
          loop={false}
          light="https://storage.googleapis.com/comaiphuong-edu-media/images/images_default_videojs.jpg"
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
