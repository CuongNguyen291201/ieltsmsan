import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { OtsvCategory } from '../../custom-types';
import { response_status } from '../../sub_modules/share/api_services/http_status';
import { Course } from '../../sub_modules/share/model/courses_ts';
import { apiGetPagedCoursesByCategory, apiGetSkippedCoursesByCategory } from '../../utils/apis/courseApi';
import CourseItem from '../CourseItem';
import GridTemplate2 from '../grid/GridTemplate2';
import SearchBox from '../SearchBox';
import Pagination from '../Pagination';
import './style.scss';

type PaginationCourses = { totalPages: number; data: { [page: number]: Course[] }; currentPage: number };

const RootCategoryDetail = (props: { category: OtsvCategory; childCategories: OtsvCategory[] }) => {
  const { category, childCategories = [] } = props;
  const [isInit, setInit] = useState(false);
  const [pages, setPages] = useState<{ [categoryId: string]: PaginationCourses }>({});

  const fetchCourses = async (args: { categoryId: string, lastRecord?: Course, skip?: number }): Promise<{
    totalCourses: number; courses: Course[]
  }> => {
    const { data, status } = args.hasOwnProperty('skip') ? await apiGetSkippedCoursesByCategory(args) : await apiGetPagedCoursesByCategory(args);
    if (status === response_status.failure) return { totalCourses: 0, courses: [] };
    return data;
  }

  const initCourses = async () => {
    const initData: { [categoryId: string]: PaginationCourses } = {};
    const initRes = await Promise.all(childCategories.map(async (e) => {
      const data = await fetchCourses({ categoryId: e._id });
      const totalPages = Math.ceil((data.totalCourses || 1) / 10);
      return { categoryId: e._id as string, totalPages, data: data.courses }
    }));
    initRes.map(({ categoryId, data, totalPages }) => {
      Object.assign(initData, { [categoryId]: { totalPages, data: { 1: data }, currentPage: 1 } });
    });
    setPages(initData);
  }

  const onChangePage = (args: { categoryId: string, page: number }) => {
    const { categoryId, page } = args;
    if (!pages.hasOwnProperty(categoryId)) return;
    const category = pages[categoryId];
    if (page > category.totalPages) return;
    if (page === category.currentPage) return;
    if (category.data.hasOwnProperty(page)) {
      setPages({ ...pages, [categoryId]: { ...category, currentPage: page } });
    } else if (category.data.hasOwnProperty(page - 1)) {
      const [lastRecord] = category.data[page - 1].slice(-1);
      fetchCourses({ categoryId, lastRecord })
        .then(({ courses }) => setPages({ ...pages, [categoryId]: { ...category, currentPage: page, data: { ...category.data, [page]: courses } } }));
    } else {
      const skip = (page - 1) * 10;
      fetchCourses({ categoryId, skip })
        .then(({ courses }) => setPages({ ...pages, [categoryId]: { ...category, currentPage: page, data: { ...category.data, [page]: courses } } }));
    }
  }

  useEffect(() => {
    if (!isInit) initCourses().then(() => setInit(true));
  }, [isInit]);

  return (
    <>
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
        {childCategories?.map((e) => (
          <Fragment key={e._id}>
            <div className="child-cat">
              <div className="title-cat">
                {e.titleSEO || e.name}
              </div>
              <div className="title-line" />

              <div className="child-cat-crs">
                <GridTemplate2>
                  {
                    pages[e._id]?.data[pages[e._id].currentPage]?.map((e) => (
                      <Fragment key={e._id}>
                        <CourseItem course={e} />
                      </Fragment>
                    ))
                  }
                </GridTemplate2>

                <div className="pagination">
                  {pages[e._id]?.totalPages > 1 &&
                    <Pagination
                      total={pages[e._id]?.totalPages}
                      active={pages[e._id]?.currentPage}
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
  )
}

export default RootCategoryDetail;