import { useEffect, useState } from 'react';
import { apiGetTopicsByParentId } from '../../utils/apis/topicApi';

const TopicTreeNode = (props: { topic: any; }) => {
  const { topic } = props;
  const [topicOptions, setTopicOptions] = useState({
    childs: null
  });

  const fetchChildTopics = async () => {
    const childs = await apiGetTopicsByParentId({ parentId: topic._id });
  };

  useEffect(() => { });

  return (
    <div className="topic-item">
      {topic.name}
    </div>
  );
};

export default TopicTreeNode;