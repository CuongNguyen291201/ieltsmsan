import { ForwardedRef, forwardRef, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import defaultAvatar from '../../public/images/icons/default_avatar_otsv.jpg';
import { AppState } from '../../redux/reducers';
import { UserInfo } from '../../sub_modules/share/model/user';
import './style.scss';

const CreateNewComment = forwardRef((props: { onPushComment?: () => any; isReply?: boolean; parentId?: string | null }, ref: ForwardedRef<HTMLSpanElement>) => {
  const { onPushComment, isReply = false, parentId } = props;
  const currentUser: UserInfo = useSelector((state: AppState) => state.userReducer.currentUser);
  const { mapReplies, mapShowLoadMoreReplies } = useSelector((state: AppState) => state.commentReducer);
  const handlePushComment = () => {
    if (onPushComment) {
      onPushComment();
    }
  }

  useEffect(() => {
    if (typeof window !== 'undefined' && mapReplies[parentId] && isReply) {
      const [lastReply] = mapReplies[parentId].slice(-1);
      if (lastReply) {
        const lastReplyElement = document.getElementById(lastReply._id);
        const newReplyElement = document.getElementById(`${parentId}-reply`);
        const showRepliesElementHeight = !!mapShowLoadMoreReplies[parentId] ? 40 : 0;
        if (lastReplyElement) {
          newReplyElement.style.setProperty('--height-new-reply', `${lastReplyElement.clientHeight + 20 + showRepliesElementHeight}px`);
          newReplyElement.style.setProperty('--top-new-reply', `-${lastReplyElement.clientHeight + showRepliesElementHeight}px`);
        }
      }
    }
  }, [mapReplies[parentId], mapShowLoadMoreReplies[parentId]]);

  return (
    <div className="new-comment" id={`${parentId ?? ''}${isReply ? '-reply' : ''}`}>
      <div className="image-avatar">
        <img src={currentUser?.avatar || defaultAvatar} alt="" />
      </div>
      <span className={`main-comment-box${isReply ? ' reply' : ''}`} contentEditable role="textbox" onInput={(e) => { e.preventDefault(); }} ref={ref} />
      <div className="cmt-options">
        <button type="button" className="btn btn-send" onClick={() => handlePushComment()}>
          <i className="far fa-paper-plane" />
        </button>

        <button type="button" className="btn btn-open-editor">
          <i className="far fa-pencil-alt" />
        </button>

        <button type="button" className="btn btn-add-media">
          <i className="far fa-camera" />
        </button>

        <button type="button" className="btn btn-add-emoji">
          <i className="far fa-smile" />
        </button>
      </div>
    </div>
  )
})

export default CreateNewComment
