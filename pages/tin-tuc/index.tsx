import { Col, Row } from "antd";
import 'antd/dist/antd.css';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useEffect, useState } from "react";
import Layout from '../../components/Layout';
import { wrapper } from '../../redux/store';
import { getUserFromToken } from '../../sub_modules/common/api/userApis';
import { loginSuccessAction } from '../../sub_modules/common/redux/actions/userActions';
import { removeCookie, TOKEN } from '../../sub_modules/common/utils/cookie';
import News from '../../sub_modules/share/model/news';
import WebInfo from '../../sub_modules/share/model/webInfo';
import WebSeo from '../../sub_modules/share/model/webSeo';
import { apiNewsCategories } from "../../utils/apis/newsApi";
import { apiWebInfo } from '../../utils/apis/webInfoApi';
import { ROUTER_NEWS } from '../../utils/router';
const NewsPage = (props: { webInfo?: WebInfo, webSeo?: WebSeo }) => {
  const { webInfo, webSeo } = props;
  const [categoryNews, setCategoryNews] = useState([])
  const [newsContent, setNewsContent] = useState([])
  useEffect(() => {
    apiNewsCategories(5)
      .then((res => {
        setCategoryNews(res.data.categories)
        setNewsContent(res.data.mapCategoryNews)
      }))
      .catch()
  }, [])

  return (
    <Layout webInfo={webInfo} webSeo={webSeo}>
      <div className="content-news">
        <div className="container">
          {categoryNews.map((value, key) => (
            <div key={key} className="wraper-item-news">
              <div className="title-category">{value?.name}</div>
              <Row>
                {newsContent[value._id]?.map((item: News, key: number) => {
                  const newsSlug = `${ROUTER_NEWS}/${item.slug}`
                  return (
                    <Col key={key} xs={24} sm={24} md={12} lg={12} xl={8}>
                      <Link href={newsSlug} as={newsSlug}>
                        <a>
                          <div className="item-news">
                            <div className="image">
                              <img src={item?.avatarUrl} alt={item?.avatarUrl} />
                            </div>
                            <div className="title-item-news dot-2">{item?.title}</div>
                          </div>
                        </a>
                      </Link>
                    </Col>
                  )
                })}
              </Row>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(async ({ store, req }) => {
  const userInfo = await getUserFromToken(req);
  if (userInfo) {
    store.dispatch(loginSuccessAction(userInfo));
  } else {
    removeCookie(TOKEN);
  }
  const webInfoRes = await apiWebInfo({ pageSlug: ROUTER_NEWS });
  return {
    props: {
      webInfo: webInfoRes.webInfo,
      webSeo: webInfoRes.webSeo
    }
  }
});

export default NewsPage;