import dynamic from "next/dynamic";
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useScrollToTop } from '../../hooks/scrollToTop';
import { setUserCourseAction, setUserCourseLoadingAction } from '../../redux/actions/course.actions';
import { updateTopicExerciseAction } from "../../redux/actions/topic.action";
import { AppState } from '../../redux/reducers';
import { showToastifyWarning } from '../../sub_modules/common/utils/toastify';
import { EXAM_TYPE_IELTS, EXAM_TYPE_TOEIC, TOPIC_CONTENT_TYPE_FLASH_CARD, TOPIC_TYPE_EXERCISE, TOPIC_TYPE_LESSON, TOPIC_TYPE_TEST } from "../../sub_modules/share/constraint";
import { apiGetUserCourse } from '../../utils/apis/courseApi';
import { apiGetDataDetailExercise } from "../../utils/apis/topicApi";
import { canPlayTopic } from "../../utils/permission/topic.permission";
import CourseLayout from "../CourseLayout";
import LoadingContainer from "../LoadingContainer";
import ExamIELTSView from "./ExamIELTSView";
import ExamTOEICView from "./ExamTOEICView";
import ExerciseInfoView from "./ExerciseInfoView";
import LessonView from "./LessonView";
import './style.scss';
import TestInfoView from "./TestInfoView";
import TopicPrivateView from "./TopicPrivateView";
import TopicUnauthView from "./TopicUnauthView";
import useTopicContentStyles from "./useTopicContentStyles";

const CommentPanel = dynamic(() => import('../CommentPanelNew'), { ssr: false });
const DocumentsListPanel = dynamic(() => import('./DocumentsList/DocumentsListPanel'), { ssr: false });
const TableOfContents = dynamic(() => import('../TableOfContents'), { ssr: false });

const TopicDetail = () => {
  const { currentTopic: topic, currentTopicLoading, studyScore, myCardData } = useSelector((state: AppState) => state.topicReducer);
  const { currentCourse: course, userCourseLoading, currentCourseLoading, isJoinedCourse } = useSelector((state: AppState) => state.courseReducer);
  const { currentUser } = useSelector((state: AppState) => state.userReducer);

  const classes = useTopicContentStyles();

  const dispatch = useDispatch();

  useScrollToTop();

  useEffect(() => {
    if (!currentTopicLoading) {
      dispatch(setUserCourseLoadingAction(true));
      if (!currentUser) {
        dispatch(setUserCourseAction(null));
      } else {
        apiGetUserCourse({ courseId: topic.courseId })
          .then((uc) => {
            dispatch(setUserCourseAction(uc));
          })
          .catch((e) => {
            showToastifyWarning("Có lỗi xảy ra!");
          })
      }
    }
  }, [currentUser, currentTopicLoading, topic]);

  useEffect(() => {
    const getDataDetailExerciseFC = async () => {
      const data = await apiGetDataDetailExercise({
        topicId: topic._id, userId: currentUser?._id ?? null, type: topic.type
      });
      if (!data) return;
      const { topicExercise, studyScore, myCardData } = data;
      dispatch(updateTopicExerciseAction(topic._id, topicExercise, studyScore, myCardData));
    }
    if (topic && topic.type !== TOPIC_TYPE_LESSON) getDataDetailExerciseFC();
  }, [currentUser, topic]);

  const renderTopicView = () => {
    if (!currentUser) return <TopicUnauthView />;
    if (!canPlayTopic({ topic, isJoinedCourse })) return <TopicPrivateView />;
    if (topic.type === TOPIC_TYPE_TEST && topic.topicExercise?.contentType === EXAM_TYPE_IELTS) {
      return <ExamIELTSView />
    } else if (topic.type === TOPIC_TYPE_TEST && topic.topicExercise?.contentType === EXAM_TYPE_TOEIC) {
      return <ExamTOEICView />
    } else if (topic.type === TOPIC_TYPE_EXERCISE && topic.topicExercise?.contentType === TOPIC_CONTENT_TYPE_FLASH_CARD) {
      return <ExerciseInfoView />
    } else {
      if (topic.type === TOPIC_TYPE_TEST) {
        return <TestInfoView />
      } else if (topic.type === TOPIC_TYPE_EXERCISE) {
        return <ExerciseInfoView />
      } else if (topic.type === TOPIC_TYPE_LESSON) {
        return <LessonView />
      }
      return <></>
    }
  }

  // const renderTopicView = () => {
  //   if (!topic || userCourseLoading || currentTopicLoading) return <></>;
  //   if (!currentUser) return <TopicUnauthView />;
  //   if (!canPlayTopic({ topic, isJoinedCourse })) return <TopicPrivateView />;
  //   return (
  //     <Grid container className={classes.mainGrid}>
  //       {/* VIDEO  */}
  //       <Grid item xs={12} md={state.isVideoTheaterMode ? 12 : 8}>
  //         {/* VIDEO */}
  //         {isVideoContent && <Box className={classes.boxContent}>
  //           <VideoPanel isVideoTheaterMode={state.isVideoTheaterMode} setVideoTheaterMode={(isVideoTheaterMode) => {
  //             uiLogic(setVideoTheaterModeAction(isVideoTheaterMode));
  //           }} />
  //           {/* VIDEO DOCUMENTS */}
  //           <Box className={classes.sectionPanelBorder}>
  //             <DocumentsListPanel />
  //           </Box>
  //         </Box>}


  //       </Grid>

  //       <Grid item xs={12} md={state.isVideoTheaterMode ? 12 : 4}>
  //         <Grid container columnSpacing={3}>
  //           {/* Comments */}
  //           <Grid item xs={12}>
  //             <Box
  //               className={classNames(classes.boxContent, classes.commentShadow)}
  //               sx={{ display: state.showComments ? undefined : "none" }}
  //             >
  //               <Box className={isVideoContent ? classes.commentPanelVideo : classes.commentPanel} sx={{
  //                 overflow: state.showComments ? "auto" : "hidden"
  //               }}>
  //                 <CommentPanel commentScope={CommentScopes.TOPIC} />
  //               </Box>
  //             </Box>
  //             <Box width="100%" mt={state.showComments ? 0 : { xs: "8px", md: "16px" }}>
  //               <Button sx={{ width: "100%" }}
  //                 variant="outlined"
  //                 onClick={() => { uiLogic(setShowCommentsAction(!state.showComments)) }}>
  //                 {state.showComments ? 'Ẩn bình luận' : 'Hiển thị bình luận'}
  //               </Button>
  //             </Box>
  //           </Grid>

  //         </Grid>
  //       </Grid>
  //     </Grid>
  //   )
  // }

  return (
    <LoadingContainer loading={currentTopicLoading || currentCourseLoading || userCourseLoading}>
      <CourseLayout course={course} topic={topic}>
        <div id="topic-detail-view" className={classes.mainView}>
          {renderTopicView()}
        </div>
      </CourseLayout>
    </LoadingContainer>
  );
};

export default TopicDetail;