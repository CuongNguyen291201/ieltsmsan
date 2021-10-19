import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux';
import { Comment, CommentScopes } from '../../custom-types';
import { createCommentAction, fetchCourseCommentsAction, fetchRepliesAction, fetchTopicCommentsAction, resetCommentStateAction } from '../../redux/actions/comment.action';
import { AppState } from '../../redux/reducers';
import { showLoginModalAction } from '../../sub_modules/common/redux/actions/userActions';
import Discussion from '../../sub_modules/share/model/discussion';
import CommentItem from '../CommentItemNew';
import CreateNewComment from '../CreateNewCommentNew';
import './style.scss';
import DOMPurify from 'isomorphic-dompurify';
import { useSocket } from '../../hooks/socket';
import { createOneAction } from '../../redux/actions';
import { Scopes } from '../../redux/types';
import { apiDiscussionsById } from '../../utils/apis/notificationApi';
import { TextAreaRef } from 'antd/lib/input/TextArea';
import liveDown from '../../public/icon/live-down.svg';

const LOAD_LIMIT = 10;

const CommentPanel = (props: { commentScope: CommentScopes, discussions?: Discussion }) => {
  const { commentScope, discussions } = props;
  const router = useRouter();
  const { currentUser } = useSelector((state: AppState) => state.userReducer);
  const { currentCourse } = useSelector((state: AppState) => state.courseReducer);
  const { currentTopic } = useSelector((state: AppState) => state.topicReducer);
  const { commentsList, isShowLoadMoreComments, mapReplies } = useSelector((state: AppState) => state.commentReducer);
  const [dataComment, setDataComment] = useState([]);
  const [dataCommentFirst, setDataCommentFirst] = useState<Discussion>();
  const commentRef = useRef<TextAreaRef>();

  const { courseId, topicId } = useMemo(() => ({
    courseId: (currentCourse?._id ?? currentTopic?.courseId) || null,
    topicId: currentTopic?._id || null
  }), [currentCourse, currentTopic]);

  const { socket, leaveRoom } = useSocket({
    enabled: !!currentUser,
    roomType: 0,
    roomId: commentScope === CommentScopes.COURSE ? courseId || discussions?.courseId : topicId || discussions?.topicId,
    url: process.env.NEXT_PUBLIC_SOCKET_URL
  });

  useEffect(() => {
    if (!courseId && !topicId) return;
    dispatch(resetCommentStateAction());
    if (commentScope === CommentScopes.COURSE) dispatch(fetchCourseCommentsAction({ courseId }));
    else if (commentScope === CommentScopes.TOPIC) dispatch(fetchTopicCommentsAction({ topicId }));
    else return;
  }, [commentScope, courseId, topicId]);

  useEffect(() => {
    if (discussions?._id) {
      setDataComment([discussions])
    }
  }, [discussions]);

  useEffect(() => {
    if (socket) {
      socket.on('add-new-comment', (comment: Comment) => {
        console.log('add-new-comment: ', comment)
        if (comment.userId !== currentUser._id) {
          dispatch(createOneAction(Scopes.COMMENT, comment));
        }
      });

      return () => {
        console.log('leave-room')
        leaveRoom();
      }
    }
  }, [socket]);

  useEffect(() => {
    if (commentsList?.length > 0) {
      if (router.query?.discussionsId && dataCommentFirst?._id) {
        // console.log('dataCommentFirst: ', dataCommentFirst, commentsList);

        const data = commentsList.filter(item => item._id !== dataCommentFirst._id)
        const data1 = commentsList.find(item => item._id === dataCommentFirst._id)
        if (data1) {
          setDataComment([data1, ...data])
        } else {
          setDataComment([dataCommentFirst, ...data])
        }
      } else {
        setDataComment([...commentsList])
      }
    }
  }, [commentsList, dataCommentFirst]);

  useEffect(() => {
    if (currentUser?._id && router.query?.discussionsId) {
      apiDiscussionsById({ _id: router.query?.discussionsId as string })
        .then((data) => {
          setDataCommentFirst(data?.data)
        });
    }
  }, [currentUser]);

  const dispatch = useDispatch();
  const pushComment = useCallback(() => {
    const content = commentRef.current?.resizableTextArea?.textArea?.innerHTML;
    if (!content) return;
    if (!currentUser) {
      return dispatch(showLoginModalAction(true));
    }
    dispatch(createCommentAction({
      comment: new Discussion({
        content: DOMPurify.sanitize(content?.replaceAll('<div><br></div>', '')),
        courseId,
        topicId,
        userId: currentUser._id,
        userName: currentUser.name,
        conversationId: null
      }),
      user: currentUser
    }));
    // commentRef.current.resizableTextArea.textArea.innerHTML = '';
  }, [currentUser]);

  const loadMoreComments = () => {
    if (!dataComment.length) return;
    const limit = LOAD_LIMIT - (dataComment.length % LOAD_LIMIT);
    const lastRecord = dataComment[dataComment.length - 1];
    const args = { limit, lastRecord };
    (commentScope === CommentScopes.COURSE
      ? dispatch(fetchCourseCommentsAction({ ...args, courseId: courseId || discussions?.courseId }))
      : dispatch(fetchTopicCommentsAction({ ...args, topicId: topicId || discussions?.topicId }))
    );
  };
  // console.log('dataComment: ', dataComment);

  return (
    <div className="comment-section-new">
      {!discussions?._id && <CreateNewComment onPushComment={pushComment} ref={commentRef} />}
      {dataComment?.map((e) => (
        <Fragment key={e._id}>
          <CommentSectionItem commentId={discussions?._id} discussionId={dataCommentFirst?._id || null} discussion={e} />
        </Fragment>
      ))}
      {isShowLoadMoreComments && <div className="load-more">
        <span className="btn-title" onClick={() => loadMoreComments()}>
          <span className="show-more-text">
            Xem thêm bình luận
          </span>
          <img style={{ width: '12px', cursor: 'pointer' }} src={liveDown} alt="" />
        </span>
      </div>}
    </div>
  )
};

const CommentSectionItem = (props: { discussion: Discussion, discussionId: string, commentId?: string }) => {
  const { discussion, discussionId, commentId } = props;

  const [isShowCreateReply, setShowCreateReply] = useState(false);
  const [isShowReplies, setShowReplies] = useState(false);
  const [isRepliesLoading, setRepliesLoading] = useState(true);
  const { currentUser } = useSelector((state: AppState) => state.userReducer);
  const { currentCourse } = useSelector((state: AppState) => state.courseReducer);
  const { currentTopic } = useSelector((state: AppState) => state.topicReducer);
  const { mapReplies, mapShowLoadMoreReplies } = useSelector((state: AppState) => state.commentReducer);

  const replyRef = useRef<TextAreaRef>();
  const dispatch = useDispatch();

  const { courseId, topicId } = useMemo(() => ({
    courseId: (currentCourse?._id ?? currentTopic?.courseId) || discussion?.courseId || null,
    topicId: currentTopic?._id || discussion?.topicId || null
  }), [currentCourse, currentTopic]);

  const pushReply = (parentId: string) => {
    const content = replyRef.current?.resizableTextArea?.textArea?.innerHTML;
    if (!content) return;
    if (!currentUser) {
      dispatch(showLoginModalAction(true));
    }
    dispatch(createCommentAction({
      comment: new Discussion({
        content: DOMPurify.sanitize(content),
        conversationId: null,
        courseId,
        topicId,
        parentId,
        userId: currentUser._id,
        userName: currentUser.name,
        userParentId: discussion.userId,
        href: window.location.href,
        courseName: currentCourse?.name || null,
        topicName: currentTopic?.name || null,
      }),
      user: currentUser
    }));
    // replyRef.current.resizableTextArea.textArea.innerHTML = '';
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

  const loadMoreReplies = () => {
    const replies = mapReplies[discussion._id];
    if (!replies.length) return;
    const limit = LOAD_LIMIT - (replies.length % LOAD_LIMIT);
    const lastRecord = replies[replies.length - 1];
    dispatch(fetchRepliesAction({ parentId: discussion._id, limit, lastRecord }));
  }

  return (
    <div className="comment-section-item" style={{ background: discussionId === discussion._id ? '#f0f2f5' : 'none', borderRadius: discussionId === discussion._id ? '10px' : '0px', padding: discussionId === discussion._id ? '5px' : '0px', marginBottom: discussionId === discussion._id ? '5px' : '0px' }}>
      <div className="main-comment">
        <div className="flex-space">
          <CommentItem
            {...discussion}
            user={discussion.user}
            onShowReply={() => handleClickReply()}
            onToggleReplies={() => showReplies()}
            isShowReplies={isShowReplies}
            commentId={commentId}
          />
          {/* <div className="btn-show-reply" onClick={() => showReplies()}>
            <i className={`fas fa-chevron-${isShowReplies ? 'up' : 'down  '}`} />
          </div> */}
        </div>
      </div>
      <div className="reply-comment">
        {
          isShowCreateReply && (
            <CreateNewComment ref={replyRef} isReply={true} onPushComment={() => pushReply(discussion._id)} parentId={discussion._id} />
          )
        }
        {
          isShowReplies ? (
            <>
              {mapReplies[discussion._id]?.map((e) => (
                <Fragment key={e._id}>
                  <CommentItem commentId={commentId} isReply={true} user={e.user} {...e} />
                </Fragment>
              ))}
              {mapShowLoadMoreReplies[discussion._id] && <div className="load-more reply">
                <span className="btn-title" onClick={() => loadMoreReplies()}>Xem thêm <i className="fas fa-chevron-down" /></span>
              </div>}
            </>
          ) : <></>
        }
      </div>
    </div >
  )
}



export default CommentPanel;