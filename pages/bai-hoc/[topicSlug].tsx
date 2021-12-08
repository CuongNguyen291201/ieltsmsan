import { PropsWithoutRef } from 'react';
import Layout from '../../components/Layout';
import TopicDetail from '../../components/TopicDetail';
import { _Topic } from '../../custom-types';
import { setCurrentCourseAction } from '../../redux/actions/course.actions';
import { setCurrrentTopicAction } from '../../redux/actions/topic.action';
import { wrapper } from '../../redux/store';
import { getUserFromToken } from '../../sub_modules/common/api/userApis';
import { loginSuccessAction } from '../../sub_modules/common/redux/actions/userActions';
import WebInfo from '../../sub_modules/share/model/webInfo';
import WebSocial from '../../sub_modules/share/model/webSocial';
import { apiGetTopicById } from '../../utils/apis/topicApi';
import { apiWebInfo } from '../../utils/apis/webInfoApi';
import { apiWebSocial } from '../../utils/apis/webSocial';
import { ROUTER_NOT_FOUND } from '../../utils/router';

type TopicPageProps = {
  topic: _Topic;
  webInfo?: WebInfo;
  webSocial?: WebSocial;
}

const TopicPage = (props: PropsWithoutRef<TopicPageProps>) => {
  const { topic, webInfo, webSocial } = props;

  return (
    <Layout
      hideMenu
      webInfo={webInfo}
      webSocial={webSocial}
      addMathJax
    >
      <TopicDetail topic={topic} webInfo={webInfo} />
    </Layout>
  )
}

export const getServerSideProps = wrapper.getServerSideProps(async ({ query,req, res, store }) => {
  store.dispatch(setCurrentCourseAction(null, true));
  store.dispatch(setCurrrentTopicAction(null, true));
  const [user, { webInfo }, webSocial] = await Promise.all([
    getUserFromToken(req),
    apiWebInfo(),
    apiWebSocial()
  ]);

  if (user) store.dispatch(loginSuccessAction(user));
  const topicSlugItems = (query.topicSlug as string).split('-');
  const topicSlug = topicSlugItems.slice(0, -1).join('-');
  const [topicId] = topicSlugItems.slice(-1);

  if (topicId && topicSlug) {
    const topic = await apiGetTopicById(topicId);

    if (encodeURIComponent(topic?.slug) === topicSlug) {
      store.dispatch(setCurrentCourseAction(topic.course, false));
      store.dispatch(setCurrrentTopicAction(topic));

      return {
        props: {
          topic,
          webInfo,
          webSocial
        }
      }
    }
  }
  res.writeHead(302, { Location: ROUTER_NOT_FOUND }).end();
  return;
});

export default TopicPage;
