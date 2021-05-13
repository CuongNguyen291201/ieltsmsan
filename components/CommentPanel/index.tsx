import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CommentScopes } from '../../custom-types';
import { createCommentAction, fetchCourseCommentsAction, fetchRepliesAction, fetchTopicCommentsAction } from '../../redux/actions/comment.action';
import { AppState } from '../../redux/reducers';
import { showLoginModalAction } from '../../sub_modules/common/redux/actions/userActions';
import Discussion from '../../sub_modules/share/model/discussion';
import CommentItem from '../CommentItem';
import CreateNewComment from '../CreateNewComment';
import './style.scss';

const CommentPanel = (props: { commentScope: CommentScopes }) => {
  const { commentScope } = props;
  const { currentUser } = useSelector((state: AppState) => state.userReducer);
  const { currentCourse } = useSelector((state: AppState) => state.courseReducer);
  const { currentTopic } = useSelector((state: AppState) => state.topicReducer);
  const { commentsList } = useSelector((state: AppState) => state.commentReducer);

  const commentRef = useRef<HTMLSpanElement>();

  const { courseId, topicId } = useMemo(() => ({
    courseId: (currentCourse?._id ?? currentTopic?.courseId) || null,
    topicId: currentTopic?._id || null
  }), [currentCourse, currentTopic]);

  useEffect(() => {
    if (!courseId && !topicId) return;
    if (commentScope === CommentScopes.COURSE) dispatch(fetchCourseCommentsAction({ courseId }));
    else if (commentScope === CommentScopes.TOPIC) dispatch(fetchTopicCommentsAction({ topicId }));
    else return;
  }, [commentScope, courseId, topicId]);

  const dispatch = useDispatch();
  const pushComment = useCallback(() => {
    const content = commentRef.current.innerHTML;
    if (!content) return;
    if (!currentUser) {
      return dispatch(showLoginModalAction(true));
    }
    dispatch(createCommentAction({
      comment: new Discussion({
        content,
        courseId,
        topicId,
        userId: currentUser._id,
        userName: currentUser.name,
        conversationId: null
      }),
      user: currentUser
    }));
    commentRef.current.innerHTML = '';
  }, [currentUser]);
  return (
    <div className="comment-section">
      <CreateNewComment onPushComment={pushComment} ref={commentRef} />
      {commentsList.map((e) => (
        <Fragment key={e._id}>
          <CommentSectionItem discussion={e} />
        </Fragment>
      ))}
    </div>
  )
};

const CommentSectionItem = (props: { discussion: Discussion }) => {
  const { discussion } = props;

  const [isShowCreateReply, setShowCreateReply] = useState(false);
  const [isShowReplies, setShowReplies] = useState(false);
  const [isRepliesLoading, setRepliesLoading] = useState(true);
  const { currentUser } = useSelector((state: AppState) => state.userReducer);
  const { currentCourse } = useSelector((state: AppState) => state.courseReducer);
  const { currentTopic } = useSelector((state: AppState) => state.topicReducer);
  const { mapReplies } = useSelector((state: AppState) => state.commentReducer);

  const replyRef = useRef<HTMLSpanElement>();
  const dispatch = useDispatch();

  const { courseId, topicId } = useMemo(() => ({
    courseId: (currentCourse?._id ?? currentTopic?.courseId) || null,
    topicId: currentTopic?._id || null
  }), [currentCourse, currentTopic]);

  const pushReply = (parentId: string) => {
    const content = replyRef.current.innerHTML;
    if (!content) return;
    dispatch(createCommentAction({
      comment: new Discussion({
        content,
        conversationId: null,
        courseId,
        topicId,
        parentId,
        userId: currentUser._id,
        userName: currentUser.name
      }),
      user: currentUser
    }));
    replyRef.current.innerHTML = '';
  }

  const showReplies = () => {
    if (!isShowReplies) {
      if (isRepliesLoading) {
        dispatch(fetchRepliesAction({ parentId: discussion._id }));
        setRepliesLoading(false);
      }
    }
    setShowReplies(!isShowReplies);
  };

  const handleClickReply = () => {
    if (!isShowReplies) {
      if (isRepliesLoading) {
        dispatch(fetchRepliesAction({ parentId: discussion._id }));
        setRepliesLoading(false);
      }
    }
    setShowReplies(true);
    if (!isShowCreateReply) setShowCreateReply(true);
  }

  return (
    <div className="comment-section-item">
      <div className="main-comment">
        <div className="flex-space">
          <CommentItem
            {...discussion}
            user={discussion.user}
            onShowReply={() => handleClickReply()}
          />
          <div className="btn-show-reply" onClick={() => showReplies()}>
            <i className={`fas fa-chevron-${isShowReplies ? 'up' : 'down  '}`} />
          </div>
        </div>
      </div>
      <div className="reply-comment">
        {
          isShowReplies ? (
            <>
              {mapReplies[discussion._id].map((e) => (
                <Fragment key={e._id}>
                  <CommentItem isReply={true} user={e.user} {...e} />
                </Fragment>
              ))}
            </>
          ) : <></>
        }
        {
          isShowCreateReply && (
            <CreateNewComment ref={replyRef} isReply={true} onPushComment={() => pushReply(discussion._id)} />
          )
        }
      </div>
    </div >
  )
}



export default CommentPanel;