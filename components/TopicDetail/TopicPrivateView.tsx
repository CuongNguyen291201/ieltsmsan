import AnnouncementTwoToneIcon from '@mui/icons-material/AnnouncementTwoTone';
import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../../redux/reducers";
import { getCoursePageSlug } from "../../utils/router";

const TopicPrivateView = () => {
  const dispatch = useDispatch();
  const course = useSelector((state: AppState) => state.courseReducer.currentCourse);
  const router = useRouter();
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      height="500px"
      sx={{
        backgroundColor: "#fff",
        boxShadow: "0px 4px 30px rgba(95, 73, 118, 0.1)"
      }}
    >
      <AnnouncementTwoToneIcon color="info" fontSize="large" />
      <Box>
        <Typography>
          Chưa tham gia khoá học!&nbsp;
          <Typography
            component="span"
            sx={{
              color: "blue", cursor: "pointer", textDecoration: "underline"
            }}
            onClick={() => {
              router.push(getCoursePageSlug({ course }));
            }}
          >
            Quay lại
          </Typography>
        </Typography>
      </Box>
    </Box>
  )
}

export default TopicPrivateView;
