import { ForwardedRef, forwardRef, KeyboardEvent, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Input } from 'antd';
// import defaultAvatar from '../../public/default/default_avatar_otsv.jpg';
import liveAvatar from '../../public/icon/live-avatar.svg';
import liveSent from '../../public/icon/live-sent.svg';
import { AppState } from '../../redux/reducers';
import { UserInfo } from '../../sub_modules/share/model/user';
import './style.scss';
import { TextAreaRef } from 'antd/lib/input/TextArea';

const { TextArea } = Input;

const CreateNewComment = forwardRef((props: { onPushComment?: () => any; isReply?: boolean; parentId?: string | null }, ref: ForwardedRef<TextAreaRef>) => {
  const { onPushComment, isReply = false, parentId } = props;
  const currentUser: UserInfo = useSelector((state: AppState) => state.userReducer.currentUser);
  const { mapReplies, mapShowLoadMoreReplies } = useSelector((state: AppState) => state.commentReducer);
  const [dataTextArea, setDataTextArea] = useState();

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

  const onChange = ({ target: { value } }) => {
    setDataTextArea(value)
  };

  return (
    <div className={`new-comment-new${isReply ? '' : ' comment-parent'}`} id={`${parentId ?? ''}${isReply ? '-reply' : ''}`}>
      <div className="image-avatar">
        <img src={currentUser?.avatar || liveAvatar} alt="" />
      </div>
      <TextArea
        className={`main-comment-box${isReply ? ' reply' : ''}`}
        ref={ref}
        value={dataTextArea}
        onChange={onChange}
        onPressEnter={(e) => {
          e.preventDefault();
          handlePushComment()
          setDataTextArea(null)
        }}
        placeholder="Bình luận"
        autoSize={{ minRows: 1, maxRows: 4 }}
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
