import { useState } from 'react';
import CommentItem from '../CommentItem';
import CreateNewComment from '../CreateNewComment';
import './style.scss';

const CommentPanel = () => {

  return (
    <div className="comment-section">
      <CreateNewComment></CreateNewComment>
      <CommentSectionItem parentCommentId={123}></CommentSectionItem>
    </div>
  )
};

const CommentSectionItem = ({ parentCommentId }: { parentCommentId: number }) => {
  const [isShowCreateNewReply, setisShowCreateNewReply] = useState(false)
  const [isShowMoreReply, setisShowMoreReply] = useState(false)
  return (
    <div className="comment-section-item">
      <div className="main-comment">
        <CommentItem onShowReply={() => {
          setisShowCreateNewReply(!isShowCreateNewReply)
          setisShowMoreReply(true)
        }}></CommentItem>
      </div>
      <div className="reply-comment">
        {
          isShowMoreReply ? (
            <>
              <CommentItem type="reply"></CommentItem>
              <CommentItem type="reply"></CommentItem>
              <CommentItem type="reply"></CommentItem>
            </>
          ) : (
              <div className="show-more-reply" onClick={() => setisShowMoreReply(true)}>Xem thêm trả lời</div>
            )
        }
        {
          isShowCreateNewReply && (
            <CreateNewComment parentCommentId={parentCommentId}></CreateNewComment>
          )
        }
      </div>
    </div>
  )
}



export default CommentPanel;