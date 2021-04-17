import { Fragment, useEffect, useMemo, useState } from 'react';
import { OtsvCategory } from '../../custom-types';
import { response_status } from '../../sub_modules/share/api_services/http_status';
import { Course } from '../../sub_modules/share/model/courses_ts';
import { apiGetPagedCoursesByCategory } from '../../utils/apis/courseApi';
import CourseItem from '../CourseItem';
import GridTemplate2 from '../grid/GridTemplate2';
import SearchBox from '../SearchBox';
import Pagination from '../Pagination';
import './style.scss';

const RootCategoryDetail = (props: { category: OtsvCategory; childCategories: OtsvCategory[] }) => {
  const { category, childCategories = [] } = props;
  const initialPages = useMemo<{ [categoryId: string]: { totalPages: number; currentPage: number; } }>(() => childCategories.reduce((r, e) => (r[e._id] = {}, r), {}), [childCategories]);
  const initialCoursesData = useMemo<{ [categoryId: string]: { totalCourses: number; courses: Course[] } }>(() => childCategories.reduce((r, e) => (r[e._id] = {}, r), {}), [childCategories]);
  const [pages, setPages] = useState(initialPages);
  const [coursesData, setCoursesData] = useState(initialCoursesData);

  const fetchCourses = async (categoryId: string, lastRecord?: Course, currentPage?: number) => {
    const { data, status } = await apiGetPagedCoursesByCategory({
      categoryId, limit: 10, field: 'name', asc: true, lastRecord
    });
    if (status === response_status.success) {
      setCoursesData({ ...coursesData, [categoryId]: data });
      setPages({
        ...pages,
        [categoryId]: {
          totalPages: Math.ceil((data.totalCourses || 1) / 10),
          currentPage: currentPage ?? 1
        }
      });
    }
  }

  useEffect(() => {
    Promise.all(childCategories.map((e) => fetchCourses(e._id)))
  }, []);

  return (
    <>
      <div className="container">
        <div className="nav-cat">
          <div className="title-cat">
            {category.titleSEO || category.name}
          </div>
          <div className="search-area">
            <SearchBox />
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
                    coursesData[e._id].courses?.map((e) => (
                      <Fragment key={e._id}>
                        <CourseItem course={e} />
                      </Fragment>
                    ))
                  }
                </GridTemplate2>

                <div className="pagination">
                  {pages[e._id].totalPages > 1 &&
                    <Pagination
                      total={pages[e._id].totalPages}
                      active={pages[e._id].currentPage}
                      start={1}
                      onClick={(page) => {
                        const [lastCourse] = coursesData[e._id].courses.slice(-1);
                        return fetchCourses(e._id, lastCourse, page);
                      }}
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