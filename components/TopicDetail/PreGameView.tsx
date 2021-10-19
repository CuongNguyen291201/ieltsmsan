
import { Grid } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { CommentScopes } from '../../custom-types';
import { AppState } from '../../redux/reducers';
import CommentPanel from '../CommentPanel';
import './topic-content.scss';
import { TopicInfoCommonView } from './TopicWidget';

const PreGameView = (props: { topic: any }) => {
  const { currentTopic } = useSelector((state: AppState) => state.topicReducer);

  return (
    <div className="topic-test-view">
      <Grid container className="thong-ke-">
        <Grid item md={8}>
          <TopicInfoCommonView currentTopic={currentTopic} />
        </Grid>

        <Grid item md={4} className="commentPanel_">
          <CommentPanel commentScope={CommentScopes.TOPIC} />
        </Grid>
      </Grid>
    </div>
  )
}

export default PreGameView;