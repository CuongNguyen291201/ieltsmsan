import { Box } from "@mui/system";
import AnnouncementTwoToneIcon from '@mui/icons-material/AnnouncementTwoTone';
import { Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import { showLoginModalAction } from "../../sub_modules/common/redux/actions/userActions";

const TopicUnauthView = () => {
  const dispatch = useDispatch();
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
          Vui lòng&nbsp;
          <Typography
            component="span"
            sx={{
              color: "blue", cursor: "pointer", textDecoration: "underline"
            }}
            onClick={() => {
              dispatch(showLoginModalAction(true));
            }}
          >
            đăng nhập
          </Typography>
          &nbsp;để tiếp tục
        </Typography>
      </Box>
    </Box>
  )
}

export default TopicUnauthView;
