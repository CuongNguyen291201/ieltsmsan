import { useRouter } from 'next/router';
import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PAGE_TOPIC_DETAIL } from '../../../custom-types/PageType';
import defaultAvatar from '../../../public/images/icons/default_avatar_otsv.jpg';
import { AppState } from '../../../redux/reducers';
import { showLoginModalAction } from '../../../sub_modules/common/redux/actions/userActions';
import {
  USER_ACTIVITY_LESSON,
  USER_ACTIVITY_PLAY_GAME_PARACTICE,
  USER_ACTIVITY_PLAY_GAME_SCENARIO,
  USER_ACTIVITY_PLAY_GAME_TEST,
  USER_ACTIVITY_WATCH_VIDEO
} from '../../../sub_modules/share/constraint';
import { StudyScoreData } from '../../../sub_modules/share/model/studyScoreData';
import Topic from '../../../sub_modules/share/model/topic';
import { UserActivity } from '../../../sub_modules/share/model/userActivity';
import { formatFullDateTime } from '../../../utils';
import { getBrowserSlug } from '../../../utils/router';
import SanitizedDiv from '../../SanitizedDiv';
import IconExercise from '../../../public/images/icons/icon-exercise.png'
import IconLession from '../../../public/images/icons/video-lession.png'
import './style.scss';

const UserActivityItem = (props: {
  activity: UserActivity;
}) => {
  const { activity: { type, user, item, createDate, lastUpdate } } = props;
  const router = useRouter();
  const { currentUser } = useSelector((state: AppState) => state.userReducer);
  const dispatch = useDispatch();
  const { content, time } = useMemo(() => {
    let content = '';
    let time = lastUpdate || createDate;
    if (type === USER_ACTIVITY_PLAY_GAME_PARACTICE || type === USER_ACTIVITY_PLAY_GAME_TEST) {
      const _item = item as StudyScoreData;
      content = ` làm bài ${type === USER_ACTIVITY_PLAY_GAME_PARACTICE ? 'tập' : 'thi'}: <b>${_item.topic?.name}</b> - Đúng: ${_item.correctNum}/${_item.totalCardNum}`;
      time = _item.lastUpdate;
    } else if (type === USER_ACTIVITY_LESSON) {
      const _item = item as Topic;
      content = ` xem bài giảng: <b>${_item.name}</b>`;
    } else if (type === USER_ACTIVITY_WATCH_VIDEO) {
      const _item = item as Topic;
      content = ` xem bài giảng video: <b>${_item.name}</b>`;
    } else if (type === USER_ACTIVITY_PLAY_GAME_SCENARIO) {
      const _item = item as Topic;
      content = ` làm bài tập trong video: <b>${_item.name}</b>`
    } 
    return {
      content,
      time
    };
  }, [props.activity]);

  const onClickItem = useCallback(() => {
    const query = { root: router.query.root as string };
    let topic: Topic | null = null;
    if (type === USER_ACTIVITY_PLAY_GAME_PARACTICE || type === USER_ACTIVITY_PLAY_GAME_TEST) {
      topic = (item as StudyScoreData).topic;
    } else if (type === USER_ACTIVITY_LESSON || type === USER_ACTIVITY_WATCH_VIDEO || type === USER_ACTIVITY_PLAY_GAME_SCENARIO) {
      topic = item as Topic;
    }
    if (!topic) return;
    if (!currentUser) {
      dispatch(showLoginModalAction(true));
      return;
    }
    router.push({
      pathname: getBrowserSlug(topic.slug, PAGE_TOPIC_DETAIL, topic._id),
      query
    });
  }, [props.activity]);

  return (
    <div className="activity-item">
      <img src={type === USER_ACTIVITY_PLAY_GAME_PARACTICE ? IconExercise : IconLession } alt="user-avatar" className="user-avatar" />
      
      <div className="activity-info" onClick={onClickItem}>
        <div className="user-name">
          Bạn đã  <SanitizedDiv className="activity-content" content={ content} />
        </div>
        <div className="activity-date">{formatFullDateTime(time)}</div>
      </div>
    </div>
  )
}

export default UserActivityItem;
