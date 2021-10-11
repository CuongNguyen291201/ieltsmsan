import { Fragment, useMemo } from 'react';
import { _Category } from '../../custom-types';
import { usePaginationState, useTotalPagesState } from '../../hooks/pagination';
import { useScrollToTop } from '../../hooks/scrollToTop';
import { Course } from '../../sub_modules/share/model/courses';
import { fetchPaginationAPI } from '../../utils/apis/common';
import { apiCountCategoryCourses, apiOffsetCoursesByCategory, apiSeekCoursesByCategory } from '../../utils/apis/courseApi';
import { getCategorySlug } from '../../utils/router';
import Breadcrumb from '../Breadcrumb';
import CourseItem from '../CourseItem';
import GridTemplate2 from '../grid/GridTemplate2';
import Pagination from '../Pagination';
import SearchBox from '../SearchBox';
import './style.scss';

const RootCategoryDetail = (props: { category: _Category; childCategories: _Category[]; }) => {
  const { category, childCategories = [] } = props;
  const childCategoryIds = useMemo(() => [category, ...childCategories].map(({ _id }) => String(_id)), [childCategories]);

  const fetchCourses = async (args: { categoryId: string, lastRecord?: Course, skip?: number; }) => {
    return fetchPaginationAPI<Course>({ ...args, seekAPI: apiSeekCoursesByCategory, offsetAPI: apiOffsetCoursesByCategory });
  };


  const { pages, onChangePage } = usePaginationState<Course>({ keys: childCategoryIds, fetchFunction: fetchCourses, keyName: 'categoryId', filters: { field: 'name' } });
  const { mapTotalPages } = useTotalPagesState({ keys: childCategoryIds, keyName: 'categoryId', api: apiCountCategoryCourses, filters: { isRoot: false } });
  useScrollToTop();

  return (
    <>
      <Breadcrumb items={[{ name: category?.name, slug: getCategorySlug({ category }) }]} />
      <div className="container root-category-detail">
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
                <GridTemplate2>
                  {
                    pages[e._id]?.data[pages[e._id].currentPage]?.map((e) => (
                      <Fragment key={e._id}>
                        <CourseItem category={category} course={e} />
                      </Fragment>
                    ))
                  }
                </GridTemplate2>

                <div className="pagination">
                  {(mapTotalPages[e._id] || 0) > 1 &&
                    <Pagination
                      total={mapTotalPages[e._id]}
                      active={pages[e._id]?.currentPage}
                      start={1}
                      onClick={(page) => onChangePage({ key: e._id, page })}
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