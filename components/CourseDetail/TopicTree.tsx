import { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { usePaginationState } from '../../hooks/pagination';
import { fetchTopicsAction } from '../../redux/actions/topic.action';
import { AppState } from '../../redux/reducers';
import { Course } from '../../sub_modules/share/model/courses';
import Topic from '../../sub_modules/share/model/topic';
import { fetchPaginationAPI } from '../../utils/apis/common';
import { apiOffsetTopicsByParentId, apiSeekTopicsByParentId } from '../../utils/apis/topicApi';
import TopicTreeNode from './TopicTreeNode';

const LOAD_LIMIT = 20;

const TopicTree = (props: { course: Course; }) => {
  const { course } = props;
  const { mainTopics, loadMoreMainTopics } = useSelector((state: AppState) => state.topicReducer);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchTopicsAction({ courseId: course._id, parentId: null, limit: LOAD_LIMIT }));
  }, []);

  return (
    <>
      {(mainTopics || []).map((e) => (
        <Fragment key={e._id}>
          <TopicTreeNode topic={e} />
        </Fragment>
      ))}
      {loadMoreMainTopics && <div className="load-more">
        Tải thêm...
      </div>}
    </>
  );
};

export default TopicTree;