import { Button, IconButton, Popover, Rating } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useMemo, useRef, useState, MouseEvent } from 'react';
import { Course } from '../../sub_modules/share/model/courses';
import { numberFormat } from "../../utils";
import { getCoursePageSlug } from '../../utils/router';
import './style.scss';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PopupQuickView from "../popup-quick-view";
import SanitizedDiv from "../SanitizedDiv";
import classNames from "classnames";

const CourseItem = (props: { course: Course; ownCourse?: boolean; popupPlacement?: "left" | "right" | "center" }) => {
  const { course, ownCourse, popupPlacement = "right" } = props;
  const router = useRouter();
  const courseSlug = useMemo(() => getCoursePageSlug({ course }), [course]);
  const quickViewRef = useRef<HTMLButtonElement | null>(null);
  const courseRef = useRef<HTMLDivElement | null>(null);
  // const point = useMemo(() => _.round(_.random(4.5, 4.9, true), 1), [course]);
  const getPrice = useCallback(() => {
    return course.cost ? `${numberFormat.format(course.cost)} VNĐ` : "MIỄN PHÍ";
  }, [course.cost]);
  const [showPopup, setShowPopup] = useState(false)
  const clickShowPopup = () => {
    setShowPopup(true)
  }

  const clickHidePopup = () => {
    setShowPopup(false);
  }

  const onClickItem = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (!quickViewRef.current?.contains(e.target as Node)) {
      router.push(courseSlug);
    }
  }

  return (
    <>
      <Link href={courseSlug} passHref>
        <a className="plain-anchor-tag" onClick={onClickItem}>
          <div className="course-root" ref={courseRef}>
            <div className="crs-avatar">
              <img className="crs-avatar-img" src={course.avatar || process.env.NEXT_PUBLIC_COURSE_THUMB} alt={course.name} />
              <div className="crs-avatar-pop-up">
                <Button sx={{
                  color: "#fff",
                  border: "2px solid #fff",
                }} ref={quickViewRef} onClick={clickShowPopup}>Xem nhanh</Button>
              </div>
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
          style: { background: "transparent" }
        }}
      >
        <div className={classNames("popup-quick-view-course", popupPlacement === "right" ? "" : "popup-left")}>
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
