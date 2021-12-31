import { Grid } from '@mui/material';
import { Fragment, useEffect, useMemo, useReducer } from 'react';
import { _Category } from '../../custom-types';
import { useScrollToTop } from '../../hooks/scrollToTop';
import { response_status } from '../../sub_modules/share/api_services/http_status';
import { STATUS_OPEN, STATUS_PUBLIC } from "../../sub_modules/share/constraint";
import { Course } from '../../sub_modules/share/model/courses';
import { apiCountCategoryCourses, apiOffsetCoursesByCategory } from '../../utils/apis/courseApi';
import { getCategorySlug } from '../../utils/router';
import Breadcrumb from '../Breadcrumb';
import CourseItem from '../CourseItem';
import Pagination from '../Pagination';
import SearchBox from '../SearchBox';
import {
  categoryDetailInitState,
  categoryDetailReducer,

  initMapCourses,
  initMapPageData,
  setMapCoursesKey,
  setMapPageDataKeyCurrentPage
} from './rootCategoryDetail.reducer';
import './style.scss';

const COURSE_LOAD_LIMIT = 20;

const RootCategoryDetail = (props: { category: _Category; childCategories: _Category[]; }) => {
  const { category, childCategories = [] } = props;
  const childCategoryIds = useMemo(() => [category, ...childCategories].map(({ _id }) => String(_id)), [childCategories]);

  const [{
    mapCategoryCourses,
    mapCategoryPageData
  }, uiLogic] = useReducer(categoryDetailReducer, categoryDetailInitState);

  useScrollToTop();

  useEffect(() => {
    Promise.all(childCategoryIds.map(async (categoryId) => {
      const { data, status } = await apiOffsetCoursesByCategory({ categoryId, field: '_id', skip: 0, limit: COURSE_LOAD_LIMIT, status: [STATUS_PUBLIC, STATUS_OPEN] });
      const { total } = await apiCountCategoryCourses({ categoryId, isRoot: false, status: [STATUS_PUBLIC, STATUS_OPEN] });

      return {
        categoryId, data: (status === response_status.success ? data : []) as Course[], total
      }
    }))
      .then((arr) => {
        const mapCategoryCourses = arr.reduce((map, { categoryId, data }) => (map[categoryId] = data, map), {});
        const mapCategoryPageData = arr.reduce((map, { categoryId, total }) => (map[categoryId] = { currentPage: 1, totalPages: Math.ceil((total || 1) / COURSE_LOAD_LIMIT) }, map), {});

        uiLogic(initMapCourses(mapCategoryCourses));
        uiLogic(initMapPageData(mapCategoryPageData));
      })
  }, []);

  const onChangePage = async (args: { categoryId: string; page: number }) => {
    const { categoryId, page } = args;
    apiOffsetCoursesByCategory({ categoryId, field: '_id', skip: (page - 1) * COURSE_LOAD_LIMIT, limit: COURSE_LOAD_LIMIT })
      .then(({ data, status }) => {
        if (status === response_status.success) {
          uiLogic(setMapPageDataKeyCurrentPage(categoryId, page));
          uiLogic(setMapCoursesKey(categoryId, data as Course[]));
        }
      })
  }

  return (
    <>
      <div className="container root-category-detail">
        <Breadcrumb items={[{ name: category?.name, slug: getCategorySlug({ category }) }]} />
        <div className="nav-cat">
          <div className="head">
            <div className="title-cat">
              {category.titleSEO || category.name}
            </div>
            <div className="search-area">
              <SearchBox />
            </div>
          </div>

        </div>
        {[category, ...childCategories]?.map((e) => (
          <Fragment key={e._id}>
            <div className="child-cat">
              {e._id !== category._id &&
                <>
                  <div className="title-cat">
                    {e.titleSEO || e.name}
                  </div>
                  <div className="title-line" />
                </>
              }
              <div className="child-cat-crs">

                <Grid container spacing={3}>
                  {mapCategoryCourses[e._id]?.map((e) => (
                    <Grid key={e._id} item xs={6} md={4} lg={3}>
                      <CourseItem course={e} />
                    </Grid>
                  ))}
                </Grid>

                <div className="pagination">
                  {(mapCategoryPageData[e._id]?.totalPages || 0) > 1 &&
                    <Pagination
                      total={mapCategoryPageData[e._id].totalPages}
                      active={mapCategoryPageData[e._id]?.currentPage}
                      start={1}
                      onClick={(page) => onChangePage({ categoryId: e._id, page })}
                    />
                  }
                </div>
              </div>
            </div>
          </Fragment>
        ))}
      </div>
    </>
  );
};

export default RootCategoryDetail;