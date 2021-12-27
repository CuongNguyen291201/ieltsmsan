import { Button, Box } from "@mui/material";
import { useState } from "react";
import CourseContent from "../../../sub_modules/share/model/courseContent";
import { Course } from "../../../sub_modules/share/model/courses";
import SanitizedDiv from "../../SanitizedDiv";
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import './style.scss';

const ContentCourse = (props: { course: Course }) => {
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
            <Box display="flex" justifyContent="end">
                <Button
                    sx={{
                        textTransform: "none",
                        color: "#5624d0",
                        boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.15)",
                        borderRadius: "7px"
                    }}
                    onClick={showMore}
                >
                    <i>{show ? 'Ẩn bớt' : 'Xem thêm'}</i>
                    {show ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </Button>
            </Box>
        </div>
    )
}

export default ContentCourse;
