import { Box } from "@mui/material";
import { PropsWithChildren } from "react";
import { Course } from "../sub_modules/share/model/courses";
import Topic from "../sub_modules/share/model/topic";
import { InfoCourse } from "./InfoCourse";

const CourseLayout = (props: PropsWithChildren<{
  course: Course;
  topic?: Topic;
  id?: string;
}>) => {
  const { course, topic, id, children } = props;
  return (
    <div {...{ id }} style={{ width: "100%", margin: "0 auto", background: "#e5e5e5" }}>
      <InfoCourse course={course} topic={topic} />
      <Box sx={{ backgroundColor: "#fff" }}>
        <Box className="container">
          <Box sx={{ position: "relative", top: !!topic ? "-300px" : "-200px" }}>
            {children}
          </Box>
        </Box>
      </Box>
    </div>
  )
}

export default CourseLayout;