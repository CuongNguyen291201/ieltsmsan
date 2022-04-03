import { PropsWithoutRef } from 'react';
import Layout from '../../components/Layout';
import TopicDetail from '../../components/TopicDetail';
import useAuth from "../../hooks/useAuth";
import { setCurrentCourseAction } from '../../redux/actions/course.actions';
import { getWebMenuAction } from "../../redux/actions/menu.action";
import { setCurrrentTopicAction } from '../../redux/actions/topic.action';
import { wrapper } from '../../redux/store';
import WebInfo from '../../sub_modules/share/model/webInfo';
import WebSocial from '../../sub_modules/share/model/webSocial';
import { apiGetPageLayout } from "../../utils/apis/pageLayoutApi";
import { apiGetTopicById } from '../../utils/apis/topicApi';

type TopicPageProps = {
  webInfo?: WebInfo;
  webSocial?: WebSocial;
}

const TopicPage = (props: PropsWithoutRef<TopicPageProps>) => {
  useAuth();
  return (
    <Layout
      {...props}
      addMathJax
    >
      <TopicDetail />
    </Layout>
  )
}

export const getServerSideProps = wrapper.getServerSideProps(async ({ query, req, res, store }) => {
  store.dispatch(setCurrentCourseAction(null, true));
  store.dispatch(setCurrrentTopicAction(null, true));
  const { webInfo, webSocial, webMenuItems } = await apiGetPageLayout({ menu: true })
  store.dispatch(getWebMenuAction(webMenuItems));
  const topicSlugItems = (query.topicSlug as string).split('-');
  const topicSlug = topicSlugItems.slice(0, -1).join('-');
  const [topicId] = topicSlugItems.slice(-1);

  if (topicId && topicSlug) {
    const topic = await apiGetTopicById({ topicId, serverSide: true });

    if (encodeURIComponent(topic?.slug) === topicSlug) {
      store.dispatch(setCurrentCourseAction(topic.course, false));
      store.dispatch(setCurrrentTopicAction(topic));

      return {
        props: {
          webInfo,
          webSocial
        }
      }
    }
  }
  return {
    notFound: true
  }
});

export default TopicPage;
