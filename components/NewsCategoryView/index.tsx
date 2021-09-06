import { Col, Pagination, Row } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { Fragment, useMemo } from 'react';
import CategoryNews from '../../sub_modules/share/model/categoryNews';
import News from '../../sub_modules/share/model/news';
import { ROUTER_NEWS } from '../../utils/router';
import Breadcrumb from '../Breadcrumb';
import './style.scss';

const NewsCategoryView = (props: {
  newsList: News[],
  totalNews: number,
  categoryNews: CategoryNews[];
  category?: CategoryNews;
  newsLimit?: number;
}) => {
  const { newsList, totalNews, categoryNews, category, newsLimit = 5 } = props;
  const router = useRouter();

  const brItems: Array<{ name: string; slug?: string }> = useMemo(() => {
    const items: Array<{ name: string; slug?: string }> = [{ name: "Tin tức", slug: ROUTER_NEWS }];
    if (category) items.push({ name: category.name, slug: `${ROUTER_NEWS}/${category.slug}` });
    return items;
  }, [category]);

  const onPageChange = async (pageNumber: number) => {
    scrollTo({ top: 0, behavior: "smooth" });
    let [pageSlug] = router.asPath.split('?');
    if (pageNumber > 1) pageSlug += `?page=${pageNumber}`;
    router.push(pageSlug);
  };

  return (<>
    <Breadcrumb items={brItems} />
    <div className="content-news">
      <div className="container">
        <div className="wraper-item-news">
          <Row>
            <Col xs={24} sm={24} md={24} lg={16} xl={16}>
              <h1 className="title-News-1">Tin Tức</h1>
              {newsList.map((item, key) => {
                const newsSlug = `/${item.slug}-post${item._id}`;
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
                <Pagination onChange={onPageChange} total={totalNews} pageSize={newsLimit} hideOnSinglePage />
              </div>
            </Col>
            <Col xs={24} sm={24} md={24} lg={8} xl={8} className="right-category">
              <div>
                <h2 className="title-News-1">Danh mục</h2>
                <div className="wraper-item-category-news">
                  {categoryNews?.map((value, key) => {
                    const categorySlug = `${ROUTER_NEWS}/${value.slug}`;
                    return (
                      <Link key={key} href={categorySlug}>
                        <a>
                          <div key={key} className={`item-category-news${category?._id === value._id ? ' active' : ''}`}>
                            {value.name}
                          </div>
                        </a>
                      </Link>
                    )
                  })}
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  </>)
}

export default NewsCategoryView;
