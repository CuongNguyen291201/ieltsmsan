import { Grid } from '@material-ui/core';
import React from 'react';
import { formatDateDMY } from '../../sub_modules/common/utils';
import News from '../../sub_modules/share/model/news';
import { ROUTER_NEWS } from '../../utils/router';
import Breadcrumb from '../Breadcrumb';
import SanitizedDiv from '../SanitizedDiv';

const NewsView = (props: { news: News }) => {
  const { news } = props;
  return (<>
    <Breadcrumb items={[
      { name: "Tin tức", slug: ROUTER_NEWS },
      { name: news.title }
    ]}
    />
    <div id="news-detail">
      <div className="wraper-detail-news">
        <div className="container">
          <Grid item xs={12} md={10} xl={9} className="grid-item-news">
            <h1 className="title">
              {news.title}
            </h1>
            <div className="createDate"> Ngày phát hành :   {formatDateDMY(news.createDate)}</div>
            <SanitizedDiv className="content" content={news.content} />
          </Grid>
        </div>
      </div>
    </div>
  </>)
}

export default NewsView;