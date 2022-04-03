import { Avatar, Card, Grid } from '@mui/material'
import { withStyles } from '@mui/styles'
import { GetServerSideProps } from 'next'
import React from 'react'
import Breadcrumb from '../../../components/Breadcrumb'
import Layout from '../../../components/Layout'
import useAuth from "../../../hooks/useAuth"
import { getWebMenuAction } from '../../../redux/actions/menu.action'
import { wrapper } from '../../../redux/store'
import WebInfo from "../../../sub_modules/share/model/webInfo"
import WebSeo from "../../../sub_modules/share/model/webSeo"
import WebSocial from "../../../sub_modules/share/model/webSocial"
import { apiGetPageLayout } from '../../../utils/apis/pageLayoutApi'
import './style.scss'

const Principal = (props: {
  webInfo?: WebInfo; webSeo?: WebSeo; webSocial?: WebSocial
}) => {
  useAuth();
  const _Card = withStyles({
    root: {
      boxShadow: "0px 4px 30px rgba(95, 73, 118, 0.15)",
      borderRadius: 0,
      padding: "50px",
      marginBottom: "30px"
    }
  })(Card);

  return (
    <Layout useDefaultBackground {...props}>
      <div id="infomation-teacher">
        <div style={{ background: "#EBF0FC", marginBottom: "80px" }}>
          <div className="container">
            <Breadcrumb items={[{ name: "Giáo viên", slug: "" }]} />
          </div>
        </div>

        <div className="container">
          <_Card>
            <Grid container spacing={12}>
              <Grid item md={4} sm={8} xs={12}>
                <Avatar alt="" src="/images/teacher-test.png" style={{ width: "200px", height: "200px" }} />
              </Grid>
              <Grid item md={8} sm={4} xs={12}>
                <p className="position">Giáo viên</p>
                <p className="name-teacher">Cô Đào Thị Thúy An</p>
              </Grid>
            </Grid>
            <p className="item-content">Thông tin</p>

            <Grid container rowSpacing={{ xs: 4 }} columnSpacing={{ md: 10 }} alignItems="end">
              <Grid item md={6} xs={12}>
                <Grid container alignItems="end">
                  <Grid item xs={2}>
                    <img alt="" src="/images/icons/name-teacher.png" />
                  </Grid>
                  <Grid item xs={10}>
                    <p className="title-info">Họ tên</p>
                    <p className="content-info">Đào Thị Thúy An</p>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item md={6} xs={12}>
                <Grid container>
                  <Grid item xs={2}>
                    <img alt="" src="/images/icons/email-teacher-info.png" />
                  </Grid>
                  <Grid item xs={10}>
                    <p className="content-info">Email: Katherinehuntisc@gmail.com</p>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Grid container rowSpacing={{ xs: 4 }} columnSpacing={{ md: 10 }} alignItems="end">
              <Grid item md={6} xs={12}>
                <Grid container alignItems="end">
                  <Grid item xs={2}>
                    <img alt="" src="/images/icons/address-teacher-info.png" />
                  </Grid>
                  <Grid item xs={10}>
                    <p className="title-info">Nơi công tác</p>
                    <p className="content-info">International Charter School of Vietnam</p>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item md={6} xs={12}>
                <Grid container>
                  <Grid item xs={2}>
                    <img alt="" src="/images/icons/phone-teacher-info.png" />
                  </Grid>
                  <Grid item xs={10}>
                    <p className="content-info">Điện thoại: 03567133</p>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Grid container rowSpacing={{ xs: 4 }} columnSpacing={{ md: 10 }} alignItems="end">
              <Grid item md={6} xs={12}>
                <Grid container alignItems="end">
                  <Grid item xs={2}>
                    <img alt="" src="/images/icons/level-teacher.png" />
                  </Grid>
                  <Grid item xs={10}>
                    <p className="title-info">Bằng cấp</p>
                    <p className="content-info">Tốt nghiệp bằng Giỏi -  Đại Học Ngoại Thương</p>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item md={6} xs={12}>
                <Grid container>
                  <Grid item xs={2}>
                    <img alt="" src="/images/icons/fb-teacher-info.png" />
                  </Grid>
                  <Grid item xs={10}>
                    <p className="content-info">Facebook: @katherinehunt.com</p>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

          </_Card>

          <_Card>
            <p className="item-content">GIỚI THIỆU</p>
            <p className="introduce-title"><img alt="" src="/images/icons/item-teacher-info.png" /> Đôi Nét Về Cô</p>
            <ul>
              <li className="introduce">Quan điểm sống: sống là không ngừng phấn đấu và gặp khó khăn không nản lỏng. Khi đã cố gắng nhưng chưa đạt được kết quả có nghĩa là cố gắng chưa đủ, cần phải nỗ lực hơn nữa. Cô cũng luôn đặt ra các mục tiêu mới để thử thách bản thân, không bao giờ định đứng yên một chỗ.</li>
              <li className="introduce">Sở thích: Tất cả các hoạt động bằng tiếng Anh (xem phim, đọc truyện, đọc báo, nghe nhạc...); Thích nghiên cứu các thứ mới (thích thiết kết, thích các hàm excel...) và đặc biệt thích nghiên cứu các phương pháp giảng dạy mới cho học viên.</li>
            </ul>
            <p className="introduce-title"><img alt="" src="/images/icons/item-teacher-info.png" /> Thành tích</p>
            <ul>
              <li className="introduce">Là học sinh duy nhất của Nghệ An đạt Giải Ba học sinh Giỏi Quốc Gia Tiếng Anh lớp 11 và 12 (năm học 2004 và 2005)</li>
              <li className="introduce">Tuyển thẳng vào Đại Học Ngoại Thương.</li>
              <li className="introduce">Tốt nghiệp loại giỏi Đại Học Ngoại Thương.</li>
              <li className="introduce">Đạt IELTS 8.0 overall từ lần thi đầu tiên. Đạt 9.0 các kỹ năng lẻ trong nhiều lần thi khác nhau.</li>
            </ul>
            <p className="introduce-title"><img alt="" src="/images/icons/item-teacher-info.png" /> Quan điểm giảng dạy</p>
            <ul>
              <li className="introduce">Nội dung truyền tải: Khái quát các kiến thức cần thiết cho học viên về kỳ thi IELTS</li>
              <li className="introduce">Phương pháp giảng dạy: Chú trọng đến nội dung bài giảng, thường xuyên cập nhật các kiến thức mới nhất. Tập trung vào phần phát triển và tư duy ý sao học viên có thể áp dụng cho nhiều dạng bài khác nhau.</li>
              <li className="introduce">Quan điểm giảng dạy: ngoài nội dung và phương pháp, việc giám sát học viên vô cùng quan trọng. Cô luôn cho rằng giáo viên là người đưa ra định hướng, cung cấp các kiến thức nhưng chỉ lý thuyết thôi là chưa đủ. Việc nhắc nhở, đôn đúc các học viên luyện tập và bám sát các deadline đóng một vai trò trọng yếu để giúp học viên đạt được mục tiêu.</li>
            </ul>
            <p className="introduce-title"><img alt="" src="/images/icons/item-teacher-info.png" /> Kinh nghiệm giảng dạy</p>
            <ul>
              <li className="introduce">7 năm giảng dạy tiếng Anh và 5 năm giảng dạy IELTS</li>
              <li className="introduce">Đào tạo 500 học viên mỗi năm, với tỷ lệ đạt mục tiêu IELTS 90%.</li>
              <li className="introduce">Có nhiều học viên đạt kết quả cao, band Overall 7.5 và 8.0 trong thời gian ngắn.</li>
            </ul>
          </_Card>

          <_Card>
            <p className="item-content">Bài Viết Của Tác Giả</p>
            <div className="blog-author">
              <p>1. Lời khuyên cho du học sinh mới học tập, nơi ở, công việc khi du học</p>
              <p>2. Lời khuyên cho du học sinh mới học tập, nơi ở</p>
              <p>3. Lời khuyên cho du học sinh mới học tập, nơi ở, công việc khi du học nước ngoài</p>
            </div>
          </_Card>
        </div>
      </div>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(async ({ store, req }) => {
  const { webInfo, webSocial, webMenuItems } = await apiGetPageLayout({ menu: true });
  store.dispatch(getWebMenuAction(webMenuItems));
  return { props: { webInfo, webSocial } }
})

export default Principal