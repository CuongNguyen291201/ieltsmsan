import { Grid, Pagination } from "@mui/material";
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useMemo } from 'react';
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
  const page = +(router.query.page || '1');

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
          <Grid container>
            <Grid item xs={12} lg={8}>
              <h1 className="title-News-1">Tin Tức</h1>
              {newsList.map((item, key) => {
                const newsSlug = `/${item.slug}-post${item._id}`;
                return (
                  <Grid container key={key}>
                    <Grid item xs={12}>
                      <Link href={newsSlug} as={newsSlug}>
                        <a className="item-full-news plain-anchor-tag">
                          <Grid container className="item-news">
                            <Grid item xs={12} lg={5}>
                              <div className="image"><img src={item?.avatarUrl} alt={item?.avatarUrl} /></div>
                            </Grid>
                            <Grid item xs={12} lg={7}>
                              <div className="inf-news">
                                <h3 className="title-item-news dot-2">{item?.title}</h3>
                                <p className="dot-3 des-full-news"> {item.description}</p>
                                <div className="wraper-show-more">
                                  <div className="xem-them">Xem thêm</div>
                                </div>
                              </div>
                            </Grid>
                          </Grid>
                        </a>
                      </Link>
                    </Grid>
                  </Grid>
                )
              })}
              <div className="wraper-pagination">
                <Pagination page={page} count={Math.ceil((totalNews || 1) / newsLimit)} onChange={(e, page) => { onPageChange(page) }} shape="rounded" />
              </div>
            </Grid>
            <Grid item xs={12} lg={4} className="right-category">
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
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  </>)
}

export default NewsCategoryView;
