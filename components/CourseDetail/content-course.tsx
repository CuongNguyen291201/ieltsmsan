import { useState } from "react";
import CourseContent from "../../sub_modules/share/model/courseContent";
import { Course } from "../../sub_modules/share/model/courses";
import SanitizedDiv from "../SanitizedDiv";

export const ContentCourse = (props: { course: Course }) => {
    const { course } = props;
    const [show, setShow] = useState(false)
    const showMore = () => {
        setShow(!show)
    }
    return (
        <div className="course-content">
            <h2>Nội dung khóa học</h2>
            <SanitizedDiv
                className={`content${show ? '' : ' hide'}`}
                content={(course.courseContent as CourseContent)?.desc}
            />
            <div onClick={() => showMore()} className="show-more">
                {show ? 'Ẩn bớt' : 'Xem thêm'}<i className={`fas fa-chevron-${show ? 'up' : 'down'}`}></i>
            </div>
        </div>
    )
}