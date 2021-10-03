import { memo, useMemo } from 'react';
import { useSelector } from 'react-redux';
import exerciseIcon from '../../../public/icon/exercise-icon.svg';
import lessonIcon from '../../../public/icon/lesson-icon.svg';
import testIcon from '../../../public/icon/test-icon.svg';
import { AppState } from '../../../redux/reducers';
import { TOPIC_TYPE_EXERCISE, TOPIC_TYPE_LESSON, TOPIC_TYPE_TEST } from '../../../sub_modules/share/constraint';
import MainTopicIcon from './MainTopicIcon';
import ProgressTopicIcon from './ProgressTopicIcon';
import iconClock from '../../../public/default/icon-clock.png';

const TopicIcon = (props: { topicType: number; progress?: number; isMain?: boolean }) => {
  const { topicType, progress = 0, isMain = false } = props;
  const { topicIcon } = useMemo(() => {
    let icon = '';
    if (topicType === TOPIC_TYPE_LESSON) icon = lessonIcon;
    else if (topicType === TOPIC_TYPE_EXERCISE) icon = exerciseIcon;
    else if (topicType === TOPIC_TYPE_TEST) icon = testIcon;
    return { topicIcon: icon }
  }, [topicType]);
  const { currentUser } = useSelector((state: AppState) => state.userReducer);

  return isMain
    ? <MainTopicIcon iconSrc={topicIcon} />
    : <ProgressTopicIcon iconSrc={topicIcon} isShowProgress={topicType !== TOPIC_TYPE_LESSON && !!currentUser} progress={progress} />
}
{/*  */ }
export default memo(TopicIcon);