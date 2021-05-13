import { useEffect, useRef, useState } from 'react';
import defaultAvatar from '../../public/default/default_avatar_otsv.jpg';
import './style.scss'

const CreateNewComment = ({ parentCommentId }: { parentCommentId?: number }) => {
  const commentRef = useRef<HTMLSpanElement>();
  return (
    <div className="new-comment">
      <div className="image-avatar">
        <img src='/comment-avatar.jpeg' alt="" />
      </div>
      <span className="main-comment-box" contentEditable role="textbox" onInput={(e) => { e.preventDefault(); }} ref={commentRef} />
      <div className="cmt-options">
        <button type="button" className="btn btn-send">
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
}

export default CreateNewComment
