import { Box, CardContent, CardMedia, Rating, Typography } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useMemo, useState } from 'react';
import { Course } from '../../sub_modules/share/model/courses';
import { numberFormat } from '../../utils';
import { getCoursePageSlug } from '../../utils/router';
import './style.scss';

const CourseItem = (props: { course: Course; ownCourse?: boolean }) => {
  const { course, ownCourse } = props;
  const router = useRouter();
  const courseSlug = useMemo(() => getCoursePageSlug({ course }), [course]);
  const onClickItem = useCallback(() => {
    router.push(getCoursePageSlug({ course }));
  }, [course]);
  const [showPopup, setShowPopup] = useState(false)
  const clickShowPopup = () => {
    setShowPopup(true)
  }

  return (
    <Link href={courseSlug} passHref>
      <a className="plain-anchor-tag">
        <div className="course-root">
          <div className="crs-avatar">
            <img className="crs-avatar-img" src={course.avatar || process.env.NEXT_PUBLIC_COURSE_THUMB} alt={course.name} />
          </div>
          <div className="crs-body">
            <div className="crs-body-name dot-2">{course.name}</div>
            <div className="crs-body-short-desc dot-2">{course.shortDesc}</div>
            <Box display="flex" alignItems="center" py={2} gap="10px">
              <Typography sx={{ color: "#F0452D", fontSize: { lg: "18px", md: "14px" }, fontWeight: "bold" }}>4.6</Typography>
              <Rating name="size-small" size="small" defaultValue={4.6} precision={0.1} readOnly />
              <Typography sx={{ fontSize: { lg: "14px", md: "12px", sm: "12px", xs: "12px" } }}>(999+ lượt học thử)</Typography>
            </Box>
            <Typography sx={{ fontSize: "18px", fontWeight: 900, color: "#19CE7A" }} variant='body1'>{course.cost === 0 ? "MIỄN PHÍ" : numberFormat.format(course.cost) + " VNĐ"}</Typography>
          </div>
        </div>
      </a>
    </Link>
  )
  // return (
  //   <Link href={courseSlug} passHref>
  //     <a onClick={(e) => { e.preventDefault() }} className="plain-anchor-tag">
  //       <Paper elevation={5}>
  //         <div className="crs-avatar">
  //           {/* <img src={course.avatar || itemAvatar} alt={course.name} /> */}
  //           <div className="hover-cat-item">
  //             <div className="image-corse-item_">
  //               <img src={course.avatar || itemAvatar} alt={course.name} />
  //             </div>
  //             <div className="button-hover-course-item">
  //               {ownCourse ?
  //                 <button onClick={onClickItem}>Chi tiết khoá học</button>
  //                 : (<>
  //                   <button onClick={clickShowPopup}>Xem nhanh</button>
  //                   <PopupShowQuickView showPopup={showPopup} course={course} showPopupFunction={() => {
  //                     setShowPopup(false)
  //                   }} />
  //                   {!!course.cost && <button
  //                     className="btn-hightlight"
  //                     onClick={() => {
  //                       orderUtils.setReturnUrl(router.asPath);
  //                       router.push({
  //                         pathname: ROUTER_PAYMENT,
  //                         query: { courseIds: course?._id }
  //                       })
  //                     }}
  //                   >Mua ngay </button>}
  //                 </>)
  //               }
  //             </div>
  //           </div>
  //         </div>
  //         <div className="crs-info" onClick={onClickItem}>
  //           {nameCourse.length > 40 ? <Tooltip title={nameCourse} placement="bottom">
  //             <div className="crs-title dot-1">{nameCourse} </div>
  //           </Tooltip> : <div className="crs-title dot-1">{nameCourse} </div>}
  //           {shortDesc.length > 60 ? <Tooltip title={shortDesc} placement="bottom">
  //             <div className="crs-desc dot-2">{shortDesc} </div>
  //           </Tooltip> : <div className="crs-desc dot-2">{shortDesc} </div>}
  //           <div className="crs-rating">
  //             <div className="crs-point">{String(4.6).replace('.', ',')}</div>
  //             <div className="vote-star">
  //               <Rating className="vote-rate" readOnly value={4.5} precision={0.5} />
  //             </div>
  //             <div className="crs-mem">({500})</div>
  //           </div>

  //           <div className="crs-price">
  //             <div className="crs-discount-price">{!course.cost ? 'Free' : `${numberFormat.format(course.cost - course.discountPrice)} VNĐ`}</div>
  //             {course.discountPrice !== 0 && <div className="crs-origin-price">{numberFormat.format(course.cost)} VNĐ</div>}
  //           </div>
  //           {/* <div className="btn-video">
  //             Video
  //           </div> */}
  //         </div>
  //       </Paper>
  //     </a>
  //   </Link>
  // )
}

export default CourseItem;
