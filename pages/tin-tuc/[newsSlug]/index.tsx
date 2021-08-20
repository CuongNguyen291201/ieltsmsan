import { Grid } from '@material-ui/core';
import { GetServerSideProps } from 'next';
import { PropsWithoutRef } from 'react';
import Layout from '../../../components/Layout';
import SanitizedDiv from '../../../components/SanitizedDiv';
import { wrapper } from '../../../redux/store';
import { getUserFromToken } from '../../../sub_modules/common/api/userApis';
import { loginSuccessAction } from '../../../sub_modules/common/redux/actions/userActions';
import { removeCookie, TOKEN } from '../../../sub_modules/common/utils/cookie';
import News from '../../../sub_modules/share/model/news';
import WebInfo from '../../../sub_modules/share/model/webInfo';
import WebSeo from '../../../sub_modules/share/model/webSeo';
import { formatDateDMY } from '../../../utils';
import { apiGetNewsBySlug } from '../../../utils/apis/newsApi';
import { apiWebInfo } from '../../../utils/apis/webInfoApi';
import { ROUTER_NEWS, ROUTER_NOT_FOUND } from '../../../utils/router';

const NewsDetail = (props: PropsWithoutRef<{ webInfo: WebInfo; news: News; webSeo?: WebSeo }>) => {
  const { webInfo, news, webSeo } = props;
  return <Layout webInfo={webInfo} webSeo={webSeo}>
    <div id="news-detail">
      <div className="wraper-detail-news">
        <div className="container">
          <Grid xs={12} md={10} xl={9} className="grid-item-news">
            <h1 className="title">
              {news.title}
            </h1>
            <div className="createDate"> Ngày phát hành :   {formatDateDMY(news.createDate)}</div>
            <SanitizedDiv className="content" content={news.content} />
          </Grid>
          <div>

          </div>
        </div>
      </div>
    </div>
  </Layout>
}

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(async ({ store, query, req, res }) => {
  const userInfo = await getUserFromToken(req);
  if (userInfo) {
    store.dispatch(loginSuccessAction(userInfo));
  } else {
    removeCookie(TOKEN);
  }
  const webInfoRes = await apiWebInfo({ pageSlug: ROUTER_NEWS });

  const newsSlug = query.newsSlug as string;
  const newsRes = await apiGetNewsBySlug({ newsSlug });
  if (!newsRes.data) return res.writeHead(307, { Location: ROUTER_NOT_FOUND }).end();

  return {
    props: {
      news: newsRes.data,
      webInfo: webInfoRes.webInfo,
      webSeo: webInfoRes.webSeo
    }
  }
});

export default NewsDetail;