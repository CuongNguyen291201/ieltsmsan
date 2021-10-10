import { Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { _Category } from '../../custom-types';
import { fetchTopicsAction, resetTopicsListAction } from '../../redux/actions/topic.action';
import { AppState } from '../../redux/reducers';
import { Course } from '../../sub_modules/share/model/courses';
import { UserInfo } from '../../sub_modules/share/model/user';
import OvalRecButton from '../buttons/OvalRecButton';
import TopicTreeNode from './TopicTreeNode';
import newTopic from '../../public/default/newLession.png';

const LOAD_LIMIT = 50;

const TopicTree = (props: { category: _Category; course: Course; }) => {
  const { category, course } = props;
  const { mainTopics, loadMoreMainTopics } = useSelector((state: AppState) => state.topicReducer);
  const { currentUser }: { currentUser?: UserInfo } = useSelector((state: AppState) => state.userReducer);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(resetTopicsListAction());
    dispatch(fetchTopicsAction({ courseId: course._id, parentId: null, limit: LOAD_LIMIT, field: 'orderIndex', userId: currentUser?._id }));
  }, [currentUser]);

  return (
    <>
      {(mainTopics || []).map((e, index) => (
        <Fragment key={e._id}>
          <div className="item-tree">
            <span className="stt-topic">{index + 1}</span>
            <div className="icon-new-topic"><img src={newTopic} alt="" /></div>
            <TopicTreeNode category={category} topic={e} isMain={true} />
          </div>
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