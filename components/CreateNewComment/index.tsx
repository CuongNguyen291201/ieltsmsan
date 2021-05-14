import { ForwardedRef, forwardRef, useRef } from 'react';
import { useSelector } from 'react-redux';
import defaultAvatar from '../../public/default/default_avatar_otsv.jpg';
import { AppState } from '../../redux/reducers';
import { UserInfo } from '../../sub_modules/share/model/user';
import './style.scss';

const CreateNewComment = forwardRef((props: { onPushComment?: () => any; isReply?: boolean }, ref: ForwardedRef<HTMLSpanElement>) => {
  const { onPushComment, isReply = false } = props;
  const currentUser: UserInfo = useSelector((state: AppState) => state.userReducer.currentUser);
  const handlePushComment = () => {
    if (onPushComment) {
      onPushComment();
    }
  }
  return (
    <div className="new-comment">
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

        <button type="button" className="btn btn-attach">
          <i className="far fa-paperclip" />
        </button>

        <button type="button" className="btn btn-open-editor">
          <i className="far fa-smile" />
        </button>
      </div>
    </div>
  )
})

export default CreateNewComment
