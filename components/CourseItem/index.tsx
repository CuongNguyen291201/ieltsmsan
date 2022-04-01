import FavoriteIcon from '@mui/icons-material/Favorite';
import { Button, IconButton, Popover, Rating } from '@mui/material';
import classNames from "classnames";
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useMemo, useRef, useState, MouseEvent } from 'react';
import { useAppDispatch, useAppSelector } from "../../hooks";
import { setCourseShowingPopup, setCurrentCourseQuickView } from "../../redux/slices/course.slice";
import { Course } from '../../sub_modules/share/model/courses';
import { numberFormat } from "../../utils";
import { getCoursePageSlug } from '../../utils/router';
import SanitizedDiv from "../SanitizedDiv";
import './style.scss';

const CourseItem = (props: { course: Course; ownCourse?: boolean; popupPlacement?: "left" | "right" | "center" }) => {
  const { course, ownCourse, popupPlacement = "right" } = props;
  const router = useRouter();
  const courseSlug = useMemo(() => getCoursePageSlug({ course }), [course]);
  const courseRef = useRef<HTMLDivElement | null>(null);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const currentCourseQuickView = useAppSelector((state) => state.courseSlice.currentCourseQuickView);
  const dispatch = useAppDispatch();
  // const point = useMemo(() => _.round(_.random(4.5, 4.9, true), 1), [course]);
  const getPrice = useCallback(() => {
    return course.cost ? `${numberFormat.format(course.cost)} VNĐ` : "MIỄN PHÍ";
  }, [course.cost]);
  // const [showPopup, setShowPopup] = useState(false)
  const showPopup = currentCourseQuickView === course._id;
  const clickShowPopup = () => {
    if (popupPlacement === "center") return;
    if (!!currentCourseQuickView && currentCourseQuickView !== course._id) return;
    dispatch(setCurrentCourseQuickView(course._id));
  }

  const clickHidePopup = () => {
    dispatch(setCurrentCourseQuickView(''));
  }

  const handleCourseMouseLeave = (event: MouseEvent<HTMLDivElement>) => {
    const nativeY = event.nativeEvent.offsetY;
    const nativeX = event.nativeEvent.offsetX;
    const itemWidth = courseRef.current.clientWidth;
    const itemHeight = courseRef.current.clientHeight;
    if (popupPlacement === "left") {
      if (!(nativeY >= 0 && nativeY <= itemHeight && nativeX < 0)) {
        clickHidePopup();
      }
    } else if (popupPlacement === "right") {
      if (!(nativeY >= 0 && nativeY <= itemHeight && nativeX >= itemWidth)) {
        clickHidePopup();
      }
    }
  }

  // const onClickItem = (e: MouseEvent<HTMLAnchorElement>) => {
  //   e.preventDefault();
  //   if (!quickViewRef.current?.contains(e.target as Node)) {
  //     router.push(courseSlug);
  //   }
  // }

  return (
    <>
      <Link href={courseSlug} passHref>
        <a className="plain-anchor-tag">
          <div className="course-root" ref={courseRef} onMouseEnter={() => {
            clickShowPopup();
          }} onMouseLeave={handleCourseMouseLeave}>
            <div className="crs-avatar">
              <img className="crs-avatar-img" src={course.avatar || process.env.NEXT_PUBLIC_COURSE_THUMB} alt={course.name} />
              {/* <div className="crs-avatar-pop-up">
                <Button sx={{
                  color: "#fff",
                  border: "2px solid #fff",
                }} ref={quickViewRef} onClick={clickShowPopup}>Xem nhanh</Button>
              </div> */}
            </div>
            <div className="crs-body">
              <div><h3 className="crs-body-name dot-2">{course.name}</h3></div>
              <div className="crs-body-short-desc dot-2">{course.shortDesc}</div>
              <div className="crs-body-rating">
                <div className="crs-body-rating-point">{4.6}</div>
                <Rating name="size-small" size="small" defaultValue={4.6} precision={0.1} readOnly sx={{ color: "#FFA20A" }} className="crs-body-rating-stars" />
                <div className="crs-body-rating-users">(999+ lượt học thử)</div>
              </div>
              <div className="crs-body-price">{getPrice()}</div>
            </div>
          </div>
        </a>
      </Link>
      <Popover
        sx={{ pointerEvents: "none" }}
        id={`popup-${course._id}`}
        open={showPopup}
        onClose={clickHidePopup}
        anchorEl={courseRef.current}
        anchorOrigin={{
          vertical: "center",
          horizontal: popupPlacement
        }}
        transformOrigin={{
          vertical: "center",
          horizontal: popupPlacement === "right" ? "left" : (popupPlacement === "center" ? "center" : "right")
        }}
        elevation={0}
        PaperProps={{
          style: { background: "transparent", zIndex: 2 }
        }}
      >
        <div className={classNames("popup-quick-view-course", popupPlacement === "right" ? "" : "popup-left")} ref={popupRef}
          onMouseLeave={(event) => {
            console.log(event.nativeEvent.offsetX, popupRef.current?.clientWidth);
          }}
        >
          <div className="pop-course-name">{course.name}</div>
          <SanitizedDiv content={course.courseContent?.desc} className="pop-course-desc" />
          <div className="pop-course-button">
            <IconButton className="pop-course-button-fav">
              <FavoriteIcon />
            </IconButton>

            <Button className="pop-course-button-detail" onClick={() => {
              router.push(courseSlug);
            }}>Xem chi tiết</Button>
          </div>
        </div>
      </Popover>
    </>
  )
}

export default CourseItem;
