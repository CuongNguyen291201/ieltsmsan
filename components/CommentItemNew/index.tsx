import React, { memo, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
// import defaultAvatar from '../../public/default/default_avatar_otsv.jpg';
import liveAvatar from '../../public/icon/live-avatar.svg';
import liveLike from '../../public/icon/live-like.svg';
import liveUp from '../../public/icon/live-up.svg';
import liveDown from '../../public/icon/live-down.svg';
import { AppState } from '../../redux/reducers';
import { UserInfo } from '../../sub_modules/share/model/user';
import { getRelativeTime, isEqualStringified } from '../../utils';
import SanitizedDiv from '../SanitizedDiv';
import './style.scss';

const CommentItem = (props: {
  _id: string;
  parentId: string | null;
  isReply?: boolean;
  isShowReplies?: boolean;
  onShowReply?: (...arg: any[]) => any;
  onToggleReplies?: () => void;
  user?: UserInfo;
  content?: string;
  createDate?: number;
  lastUpdate?: number;
  likes?: Array<string>;
  totalReplies?: number;
  commentId?: string
}) => {
  const {
    _id,
    parentId,
    isReply = false,
    isShowReplies = false,
    onShowReply = () => { },
    onToggleReplies = () => { },
    user = null,
    content = '',
    createDate = 0,
    lastUpdate = 0,
    likes = [],
    totalReplies = 0,
    commentId,
  } = props;
  const { currentUser } = useSelector((state: AppState) => state.userReducer);
  const { mapReplies } = useSelector((state: AppState) => state.commentReducer);

  const commentDate = useMemo(() => {
    const date = lastUpdate || createDate;
    return `${getRelativeTime(date)}`;
  }, [lastUpdate, createDate]);
  const isUserLiked = useMemo(() => !!likes.find((e) => isEqualStringified(e, currentUser?._id)), [likes, currentUser]);
  const lastSiblingReply = useMemo(() => {
    if (!isReply || !parentId) return null;
    const replyIndex = mapReplies[parentId].findIndex((e) => isEqualStringified(e._id, _id));
    if (replyIndex <= 0) return null;
    return mapReplies[parentId][replyIndex - 1];
  }, [mapReplies[parentId]]);

  useEffect(() => {
    if (typeof window !== 'undefined' && isReply && !!lastSiblingReply) {
      const replyElement = document.getElementById(_id);
      const lastSiblingReplyElement = document.getElementById(lastSiblingReply._id);
      if (lastSiblingReplyElement) {
        replyElement.style.setProperty('--height-reply', `${lastSiblingReplyElement.clientHeight + 20}px`);
        replyElement.style.setProperty('--top-reply', `-${lastSiblingReplyElement.clientHeight}px`);
      }
    }
  }, [typeof window, mapReplies[parentId]]);

  return (
    <div className={`${isReply ? 'reply ' : 'show-more-comment '}comment-item-new`} id={_id}>

      <div className="avatar"><img src={user?.avatar || liveAvatar} alt="" /></div>
      <div className="comment-main">
        <div className="comment-content" style={{ maxWidth: commentId ? '510px' : 'unset' }}>
          <div>
            {/* <span className="usr-name">{user?.name || ''}</span> */}
            <SanitizedDiv className="comment-text" content={`<span class="usr-name">${user?.name || ''}</span>${content}`} />
          </div>
          {(!isReply && !!totalReplies) && (
            <div className="show-more">
              <img style={{ width: '12px', cursor: 'pointer' }} onClick={() => onToggleReplies()} src={isShowReplies ? liveUp : liveDown} alt="" />
            </div>
          )}
        </div>
        <div className="comment-stat">
          <img style={{ cursor: 'pointer' }} src={liveLike} alt="" />
          <div className="total-like"></div>
          {/* <div className="like">{`${isUserLiked ? 'Bỏ thích' : 'Thích'}${!!likes.length ? ` (${likes.length})` : ''}`}</div> */}
          {/* <span className="delimiter">.</span> */}
          {!isReply && (
            <>
              <div className="total-comment">{!!totalReplies ? `${totalReplies}` : ''}</div>
              <div className="answer" onClick={onShowReply}>{`Trả lời`}</div>
              {/* <span className="delimiter">.</span> */}
            </>
          )}
          <div className="date">{`${!!lastUpdate ? `Chỉnh sửa: ` : ''}${commentDate}`}</div>
          {/* {!isReply && !!totalReplies && (
            <>
              <span className="delimiter">.</span>
              <div className="load-more-reply" onClick={() => onToggleReplies()}>{isShowReplies ? 'Ẩn trả lời' : 'Hiện trả lời'}</div>
            </>
          )} */}
        </div>
      </div>
    </div>
  )
}

export default memo(CommentItem)
