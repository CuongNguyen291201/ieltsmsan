import { memo, useMemo } from 'react';
import { useSelector } from 'react-redux';
import exerciseIcon from '../../../public/images/icons/icon-exercise.png';
import iconVideoLession from '../../../public/images/icons/video-lession.png';
import testIcon from '../../../public/images/icons/test-icon.svg';
import { AppState } from '../../../redux/reducers';
import { TOPIC_TYPE_EXERCISE, TOPIC_TYPE_LESSON, TOPIC_TYPE_TEST } from '../../../sub_modules/share/constraint';
import MainTopicIcon from './MainTopicIcon';
import ProgressTopicIcon from './ProgressTopicIcon';
import iconLession from '../../../public/images/icons/lession-.png';
import isFree from '../../../public/images/icons/isFree.png';
import './style.scss';

const TopicIcon = (props: { topicType: number; progress?: number; isMain?: boolean; isTopicOpen?: boolean; topicVideoUrl?: string }) => {
  const { topicType, progress = 0, isMain = false, isTopicOpen = false, topicVideoUrl } = props;
  const { topicIcon } = useMemo(() => {
    let icon = '';
    if (topicType === TOPIC_TYPE_LESSON) {
      if (topicVideoUrl) {
        icon = iconVideoLession
      } else {
        icon = iconLession
      }
    } else if (topicType === TOPIC_TYPE_EXERCISE) icon = exerciseIcon;
    else if (topicType === TOPIC_TYPE_TEST) icon = testIcon;
    return { topicIcon: icon }
  }, [topicType]);
  const { currentUser } = useSelector((state: AppState) => state.userReducer);

  return (<div className="_x-topic-icon">
    {isMain
      ? <MainTopicIcon iconSrc={topicIcon} />
      : <ProgressTopicIcon iconSrc={topicIcon} isShowProgress={topicType !== TOPIC_TYPE_LESSON && !!currentUser} progress={progress} />}
    {isTopicOpen && <div className="free-ico"><img src={isFree} /></div>}
  </div>)
}

export default memo(TopicIcon);