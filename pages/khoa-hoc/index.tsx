import { Container, Theme, useMediaQuery, Grid } from "@mui/material"
import Breadcrumb from "../../components/Breadcrumb"
import Layout from "../../components/Layout"
import { useAppSelector } from "../../hooks"
import { getWebMenuAction } from "../../redux/actions/menu.action"
import { setCategory } from "../../redux/slices/category.slice"
import { wrapper } from "../../redux/store"
import { getUserFromToken } from "../../sub_modules/common/api/userApis"
import { loginSuccessAction } from "../../sub_modules/common/redux/actions/userActions"
import { CATEGORY_POSITION_MENU, META_ROBOT_INDEX_FOLLOW } from "../../sub_modules/share/constraint"
import WebInfo from "../../sub_modules/share/model/webInfo"
import WebSeo from "../../sub_modules/share/model/webSeo"
import WebSocial from "../../sub_modules/share/model/webSocial"
import { removeServerSideCookie } from "../../utils"
import { apiGetAllCategoriesWithCourses } from "../../utils/apis/categoryApi"
import { apiGetPageLayout } from "../../utils/apis/pageLayoutApi"
import { ROUTER_CATEGORY } from "../../utils/router"
import CourseItem from "../../components/CourseItem"
import SanitizedDiv from "../../components/SanitizedDiv"

const CategoryPage = (props: {
  webInfo?: WebInfo; webSeo?: WebSeo; webSocial?: WebSocial
}) => {
  const category = useAppSelector((state) => state.categorySlice.category);
  const courses = category?.courses ?? [];
  const isDownLg = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'));
  const isDownSm = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

  return (<Layout
    robot={META_ROBOT_INDEX_FOLLOW}
    title="Danh mục khoá học"
    useDefaultBackground
    {...props}
  >
    <Breadcrumb
      items={[{
        name: "Khoá học IELTS", slug: ROUTER_CATEGORY
      }]}
    />
    <Container maxWidth="xxl">
      {category ? <>
        <div className="title-page" style={{ marginTop: "50px", marginBottom: "30px" }}>
          <h1 style={{ fontSize: 24, marginBlockStart: 0, marginBlockEnd: 0 }}>Danh sách các khóa học - IELTS MS AN</h1>
        </div>
      </> : <>Chưa có danh mục nào</>}

      <div className="section-courses">
        <Grid container columnSpacing={4} rowSpacing={"86px"}>
          {courses.map((course, i) => {
            const popupPlacement = isDownSm ? "center" : (isDownLg
              ? (i % 2 === 1 ? "left" : "right")
              : (i % 3 === 2 ? "left" : "right"));
            return (<Grid key={course._id} item xs={12} sm={6} lg={4}>
              <CourseItem course={course} popupPlacement={popupPlacement} />
            </Grid>)
          })}
        </Grid>
      </div>

      <div className="section-description" style={{ marginTop: "50px" }}>
        <SanitizedDiv content={category?.description} />
      </div>

    </Container>
  </Layout>)
}

export const getServerSideProps = wrapper.getServerSideProps(async ({ store, req, res }) => {
  const userInfo = await getUserFromToken(req);
  store.dispatch(loginSuccessAction(userInfo ?? null));

  const { webMenuItems, ...layout } = await apiGetPageLayout({ slug: '/khoa-hoc', menu: true });
  const categories = await apiGetAllCategoriesWithCourses({ position: CATEGORY_POSITION_MENU, serverSide: true });
  if (categories?.length) {
    const category = categories[0];
    store.dispatch(setCategory(category));
  }
  store.dispatch(getWebMenuAction(webMenuItems));

  return {
    props: {
      ...layout
    }
  }
});

export default CategoryPage;