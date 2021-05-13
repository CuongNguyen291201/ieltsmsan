import React from 'react'
import './style.scss'

const CommentItem = ({ type, onShowReply }: { type?: string, onShowReply?: () => void }) => {
  return (
    <div className={`${type === 'reply' ? 'reply' : ''} comment-item`}>
      <div className="avatar"><img src="/comment-avatar.jpeg" alt="" /></div>
      <div className="right">
        <div className="row1">
          <div className="name">Linh Sam</div>
          <div className="comment-text">Chào bạn. Hiện tại bên mình đã cấp tài khoản HELOMOS cho bạn qua email. Bạn check email giúp mình nhé.</div>
        </div>
        <div className="row2">
          <div className="like">Thích</div>
          {
            type !== 'reply' && (
              <div className="answer" onClick={onShowReply}>Trả lời</div>
            )
          }
          <div className="date">21:12-05/05/2021</div>
        </div>

      </div>
    </div>
  )
}

export default CommentItem
