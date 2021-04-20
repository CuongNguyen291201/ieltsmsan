import { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { AppState } from '../../redux/reducers';
import TopicTreeNode from './TopicTreeNode';

const TopicTree = () => {
  const { currentCourse } = useSelector((state: AppState) => state.courseReducer);
  const { mainTopics } = useSelector((state: AppState) => state.topicReducer);
  return (
    <>
      {mainTopics.map((e) => (
        <Fragment key={e._id}>
          <TopicTreeNode topic={e} />
        </Fragment>
      ))}
    </>
  )
}

export default TopicTree;