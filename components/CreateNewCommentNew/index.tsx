import { TextareaAutosize } from "@mui/material";
import { ChangeEvent, ForwardedRef, forwardRef, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
// import defaultAvatar from '../../public/images/icons/default_avatar_otsv.jpg';
import liveAvatar from '../../public/images/icons/live-avatar.svg';
import liveSent from '../../public/images/icons/live-sent.svg';
import { AppState } from '../../redux/reducers';
import { UserInfo } from '../../sub_modules/share/model/user';
import './style.scss';

const CreateNewComment = forwardRef((props: { onPushComment?: () => any; isReply?: boolean; parentId?: string | null }, ref: ForwardedRef<HTMLTextAreaElement>) => {
  const { onPushComment, isReply = false, parentId } = props;
  const currentUser: UserInfo = useSelector((state: AppState) => state.userReducer.currentUser);
  const { mapReplies, mapShowLoadMoreReplies } = useSelector((state: AppState) => state.commentReducer);
  const [dataTextArea, setDataTextArea] = useState('');

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

  const onChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setDataTextArea(e.target.value);
  };

  return (
    <div className={`new-comment-new${isReply ? '' : ' comment-parent'}`} id={`${parentId ?? ''}${isReply ? '-reply' : ''}`}>
      <div className="image-avatar">
        <img src={currentUser?.avatar || liveAvatar} alt="" />
      </div>
      <TextareaAutosize
        className={`main-comment-box${isReply ? ' reply' : ''}`}
        value={dataTextArea}
        onChange={onChange}
        placeholder={isReply ? 'Trả lời' : 'Bình luận'}
        minRows={1}
        maxRows={4}
        ref={ref}
        onKeyPress={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handlePushComment();
            setDataTextArea('');
          }
        }}
      />
      <div className="cmt-options">
        <button type="button" className="btn btn-send" onClick={() => handlePushComment()}>
          <img className="image-sent" src={liveSent} alt="" />
        </button>
      </div>
    </div>
  )
})

export default CreateNewComment
