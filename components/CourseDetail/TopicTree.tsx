import { Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTopicsAction, resetTopicsListAction } from '../../redux/actions/topic.action';
import { AppState } from '../../redux/reducers';
import { Course } from '../../sub_modules/share/model/courses';
import { UserInfo } from '../../sub_modules/share/model/user';
import OvalRecButton from '../buttons/OvalRecButton';
import TopicTreeNode from './TopicTreeNode';

const LOAD_LIMIT = 20;

const TopicTree = (props: { course: Course; }) => {
  const { course } = props;
  const { mainTopics, loadMoreMainTopics } = useSelector((state: AppState) => state.topicReducer);
  const { currentUser }: { currentUser?: UserInfo } = useSelector((state: AppState) => state.userReducer);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(resetTopicsListAction());
    dispatch(fetchTopicsAction({ courseId: course._id, parentId: null, limit: LOAD_LIMIT, field: 'orderIndex', userId: currentUser?._id }));
  }, [currentUser]);

  return (
    <>
      {(mainTopics || []).map((e) => (
        <Fragment key={e._id}>
          <TopicTreeNode topic={e} isMain={true} />
        </Fragment>
      ))}
      {loadMoreMainTopics && <div className="load-more-main flex-center">
        <OvalRecButton
          title="TẢI THÊM BÀI HỌC"
          iconClassName="fas fa-arrow-down"
          fontSize="12px"
          padding="10px"
          onClick={() => {
            const [lastRecord] = mainTopics.slice(-1);
            dispatch(fetchTopicsAction({
              courseId: course._id, parentId: null, limit: LOAD_LIMIT, field: 'orderIndex', userId: currentUser._id, lastRecord
            }))
          }}
        />
      </div>}
    </>
  );
};

export default TopicTree;