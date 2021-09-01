import { Col, Row, Pagination } from "antd";
import 'antd/dist/antd.css';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import React, { Fragment, useEffect, useState } from "react";
// import Newright from '../../public/hvvv/news-right.jpeg';
import Layout from '../../components/Layout';
import { wrapper } from '../../redux/store';
import { getUserFromToken } from '../../sub_modules/common/api/userApis';
import { loginSuccessAction } from '../../sub_modules/common/redux/actions/userActions';
import { removeCookie, TOKEN } from '../../sub_modules/common/utils/cookie';
import News from '../../sub_modules/share/model/news';
import WebInfo from '../../sub_modules/share/model/webInfo';
import WebSeo from '../../sub_modules/share/model/webSeo';
import WebSocial from '../../sub_modules/share/model/webSocial';
import { apiFullNews, apiNewsCategories } from "../../utils/apis/newsApi";
import { apiWebInfo } from '../../utils/apis/webInfoApi';
import { apiWebSocial } from '../../utils/apis/webSocial';
import { ROUTER_ERROR, ROUTER_NEWS } from '../../utils/router';
import './style.scss';
import CategoryNews from '../../sub_modules/share/model/categoryNews';
import { useRouter } from 'next/router';
import Breadcrumb from '../../components/Breadcrumb';

const NEW_LIMITS = 5;

const NewsPage = (props: { webInfo?: WebInfo, webSeo?: WebSeo, webSocial?: WebSocial; newsList?: News[]; totalNews?: number }) => {
  const { newsList = [], totalNews = 0 } = props;
  const [categoryNews, setCategoryNews] = useState<CategoryNews[]>([]);
  const router = useRouter();
  useEffect(() => {
    apiNewsCategories()
      .then((res => {
        setCategoryNews(res.data.categories)
      }))
      .catch()
  }, []);

  const onPageChange = async (pageNumber: number) => {
    scrollTo({ top: 0, behavior: "smooth" });
    let pageSlug = router.pathname;
    if (pageNumber > 1) pageSlug += `?page=${pageNumber}`;
    router.push(pageSlug);
  };

  return (
    <Layout {...props}>
      <Breadcrumb items={[{ name: "Tin tức" }]} />
      <div className="content-news">
        <div className="container">
          <div className="wraper-item-news">
            <Row>
              <Col xs={24} sm={24} md={24} lg={16} xl={16}>
                <h1 className="title-News-1">Tin Tức</h1>
                {newsList.map((item, key) => {
                  const newsSlug = `${ROUTER_NEWS}/${item.slug}`
                  return (
                    <Fragment key={key}>
                      <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <Link href={newsSlug} as={newsSlug}>
                          <a className="item-full-news">
                            <div className="item-news">
                              <Col lg={10} xl={10} >
                                <div className="image"><img src={item?.avatarUrl} alt={item?.avatarUrl} /></div>
                              </Col>
                              <Col lg={14} xl={14}>
                                <div className="inf-news">
                                  <h3 className="title-item-news dot-2">{item?.title}</h3>
                                  <p className="dot-3 des-full-news"> {item.description}</p>
                                  <div className="wraper-show-more">
                                    <div className="xem-them">Xem thêm</div>
                                  </div>
                                </div>
                              </Col>
                            </div>
                          </a>
                        </Link>
                      </Col>
                    </Fragment>
                  )
                })}
                <div className="wraper-pagination">
                  <Pagination onChange={onPageChange} total={totalNews} pageSize={NEW_LIMITS} hideOnSinglePage />
                </div>
              </Col>
              <Col xs={24} sm={24} md={24} lg={8} xl={8} className="right-category">
                <div>
                  <h2 className="title-News-1">Danh mục</h2>
                  <div className="wraper-item-category-news">
                    {categoryNews?.map((value, key) => {
                      return (
                        <div key={key} className="item-category-news">
                          {value.name}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(async ({ store, req, res, query }) => {
  try {
    const userInfo = await getUserFromToken(req);
    if (userInfo) {
      store.dispatch(loginSuccessAction(userInfo));
    } else {
      removeCookie(TOKEN);
    }
    const webInfoRes = await apiWebInfo({ pageSlug: ROUTER_NEWS });
    const webSocial = await apiWebSocial();

    const pageQuery = parseInt((query.page || '1') as string);
    const skip = (isNaN(pageQuery) || pageQuery <= 1) ? 0 : (pageQuery - 1) * NEW_LIMITS
    const { data: newsList, total: totalNews } = await apiFullNews({ skip, limit: NEW_LIMITS });
    return {
      props: {
        webInfo: webInfoRes.webInfo,
        webSeo: webInfoRes.webSeo,
        webSocial,
        newsList,
        totalNews
      }
    }
  } catch (e) {
    console.error(e);
    return res.writeHead(302, { Location: ROUTER_ERROR }).end();
  }
});

export default NewsPage;