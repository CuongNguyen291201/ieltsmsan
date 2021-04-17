import SearchBox from '../SearchBox';
import GridTemplate2 from '../grid/GridTemplate2';
import CourseItem from '../CourseItem';
import './style.scss';

const RootCategoryDetail = ({ childCategories }) => {
  return (
    <>
      <div className="container">
        <div className="nav-cat">
          <div className="title-cat">
            ĐẠI HỌC BÁCH KHOA HÀ NỘI
          </div>
          <div className="search-area">
            <SearchBox />
          </div>
        </div>

        <div className="child-cat">
          <div className="title-cat">
            Khoá phổ biến
          </div>
          <div className="title-line" />
        </div>

        <GridTemplate2>
          {
            childCategories.map((el) => {
              return (
                <CourseItem courseItem={el} key={el._id} />
              )
            })
          }
          {/* <CourseItem point={4.6} cost={300000} discountPrice={50000} /> */}
        </GridTemplate2>

        {/* <div className="pagination">
          {[1, 2, 3].map((e, i) => {
            const activeId = 0;
            return (
              <div className={`page-item${activeId === i ? ' active' : ''}`} key={i} >
                {e}
              </div>
            )
          })}
        </div> */}
      </div>

    </>
  )
}

export default RootCategoryDetail;