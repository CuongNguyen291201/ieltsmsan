import React, { memo, useMemo } from 'react';
import { useSelector } from 'react-redux';
import defaultAvatar from '../../public/default/default_avatar_otsv.jpg';
import { AppState } from '../../redux/reducers';
import { UserInfo } from '../../sub_modules/share/model/user';
import { formatDateDMY, formatTimeHM, isEqualStringified } from '../../utils';
// import defaultAvatar from '../../public/default/default_avatar_otsv.jpg';
import './style.scss';

const CommentItem = (props: {
  isReply?: boolean,
  onShowReply?: (...arg: any[]) => any;
  user?: UserInfo;
  content?: string;
  createDate?: number;
  lastUpdate?: number;
  likes?: Array<string>;
  totalReplies?: number;
}) => {
  const { isReply = false, onShowReply = () => { }, user = null, content = '', createDate = 0, lastUpdate = 0, likes = [], totalReplies = 0 } = props;
  const { currentUser } = useSelector((state: AppState) => state.userReducer);

  const commentDate = useMemo(() => {
    const date = lastUpdate || createDate;
    return `${formatTimeHM(date)}-${formatDateDMY(date)}`;
  }, [lastUpdate, createDate]);
  const isUserLiked = useMemo(() => !!likes.find((e) => isEqualStringified(e, currentUser?._id)), [likes, currentUser]);

  return (
    <div className={`${isReply ? 'reply ' : ''}comment-item`}>

      <div className="avatar"><img src={user?.avatar || defaultAvatar} alt="" /></div>
      <div className="right">
        <div className="row1">
          <div className="name">{user?.name || ''}</div>
          <div className="comment-text" dangerouslySetInnerHTML={{ __html: content }} />
        </div>
        <div className="row2">
          <div className="like">{`${isUserLiked ? 'Bỏ thích' : 'Thích'}${!!likes.length ? ` (${likes.length})` : ''}`}</div>
          {
            !isReply && (
              <div className="answer" onClick={onShowReply}>{`Trả lời${!!totalReplies ? ` (${totalReplies})` : ''}`}</div>
            )
          }
          <div className="date">{`${!!lastUpdate ? `Chỉnh sửa lúc: ` : ''}${commentDate}`}</div>
        </div>
      </div>

    </div>
  )
}

export default memo(CommentItem)
