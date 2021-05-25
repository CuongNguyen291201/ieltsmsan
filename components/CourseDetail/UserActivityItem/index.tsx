import { useRouter } from 'next/router';
import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import defaultAvatar from '../../../public/default/default_avatar_otsv.jpg';
import { AppState } from '../../../redux/reducers';
import { showLoginModalAction } from '../../../sub_modules/common/redux/actions/userActions';
import { TOPIC_DETAIL_PAGE_TYPE, USER_ACTIVITY_LESSON, USER_ACTIVITY_PLAY_GAME_PARACTICE, USER_ACTIVITY_PLAY_GAME_TEST, USER_ACTIVITY_WATCH_VIDEO } from '../../../sub_modules/share/constraint';
import { StudyScoreData } from '../../../sub_modules/share/model/studyScoreData';
import Topic from '../../../sub_modules/share/model/topic';
import { UserActivity } from '../../../sub_modules/share/model/userActivity';
import { formatFullDateTime, getBrowserSlug } from '../../../utils';
import SanitizedDiv from '../../SanitizedDiv';
import './style.scss';

const UserActivityItem = (props: {
  activity: UserActivity;
  dimBackground?: boolean;
  isLastItem?: boolean;
}) => {
  const { activity: { type, user, item, createDate, lastUpdate }, dimBackground, isLastItem } = props;
  const router = useRouter();
  const { currentUser } = useSelector((state: AppState) => state.userReducer);
  const dispatch = useDispatch();
  const { content, time } = useMemo(() => {
    let content = '';
    let time = lastUpdate || createDate;
    if (type === USER_ACTIVITY_PLAY_GAME_PARACTICE || type === USER_ACTIVITY_PLAY_GAME_TEST) {
      const _item = item as StudyScoreData;
      content = `Làm bài ${type === USER_ACTIVITY_PLAY_GAME_PARACTICE ? 'tập' : 'thi'}: <b>${_item.topic.name}</b> - Đúng: ${_item.correctNum}/${_item.totalCardNum}`;
      time = _item.lastUpdate;
    } else if (type === USER_ACTIVITY_LESSON) {
      const _item = item as Topic;
      content = `Xem bài giảng: <b>${_item.name}</b>`;
    } else if (type === USER_ACTIVITY_WATCH_VIDEO) {
      const _item = item as Topic;
      content = `Xem video: <b>${_item.name}</b>`;
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
    } else if (type === USER_ACTIVITY_LESSON || type === USER_ACTIVITY_WATCH_VIDEO) {
      topic = item as Topic;
    }
    if (!topic) return;
    if (!currentUser) {
      dispatch(showLoginModalAction(true));
      return;
    }
    router.push({
      pathname: getBrowserSlug(topic.slug, TOPIC_DETAIL_PAGE_TYPE, topic._id),
      query
    });
  }, [props.activity]);

  return (
    <div className={`activity-item${dimBackground ? ' dim-bgr' : ''}${isLastItem ? ' last-item' : ''}`}>
      <div onClick={onClickItem}>
        <SanitizedDiv className="activity-content" content={content} />
      </div>

      <div className="activity-info">
        <div className="user-info">
          <img src={user.avatar || defaultAvatar} alt="user-avatar" />
          <div>{user.name}</div>
        </div>

        <div className="activity-date">{formatFullDateTime(time)}</div>
      </div>
    </div>
  )
}

export default UserActivityItem;
