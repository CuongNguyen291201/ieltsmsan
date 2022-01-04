import { Box, Button, Grid, Theme, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import classNames from "classnames";
import Link from 'next/link';
import { memo, PropsWithoutRef } from 'react';
// @ts-ignore
import ErrorImage from "../../public/images/icons/unexpected-error.svg";
import './style.scss';

const useStyles = makeStyles((theme: Theme) => ({
  errorContainer: {
    boxShadow: "0px 4px 30px rgba(0, 0, 0, 0.1)",
    minHeight: "740px",
  },
  errorSideVide: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  rightView: {
    [theme.breakpoints.up(theme.breakpoints.values.md)]: {
      paddingRight: "120px",
      paddingLeft: "90px"
    }
  },
  backButton: {
    borderRadius: "15px 0",
    backgroundColor: "#ec1f24",
    color: "white",
    width: "100%",
    height: "67px",
    marginTop: "60px",
    fontSize: "28px",
    [theme.breakpoints.down(theme.breakpoints.values.md)]: {
      marginBottom: "32px",
    },
    "&:hover": {
      backgroundColor: "#ec1f24",
      color: "white",
    }
  }
}));

export default memo((props: PropsWithoutRef<{ message?: string; img?: string; description?: string, errorCode?: number }>) => {
  const classes = useStyles();
  const message = props.message || 'An unexpected error has occurred. Please contact your system Administrator';
  return (
    <Box id="error-page">
      <Grid container className={classNames('container', classes.errorContainer)} alignItems="center">
        <Grid item xs={12} md={6}>
          <Box className={classes.errorSideVide}>
            <Box sx={{ height: "290px", width: "auto" }}>
              <img src={props.img || ErrorImage} alt={message} style={{ maxHeight: "100%", maxWidth: "100%" }} />
            </Box>
            <Typography sx={{ fontSize: "40px", fontWeight: 500, color: "#b1b2b4" }}>
              {props.description || 'Unexpected Error'}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} md={6} className={classes.rightView}>
          <Typography sx={{ fontSize: "64px", fontWeight: 900, color: "#1e2959" }}>Opps!</Typography>
          <Typography sx={{ fontSize: "32px", fontWeight: "bold", color: "#1e2959", marginTop: "50px" }}>Error code: {props.errorCode ?? 500}</Typography>
          <Typography sx={{ fontSize: "30px", color: "#4E565C" }}>{message}</Typography>

          <Link href="/">
            <Button className={classes.backButton}>
              GO BACK HOME
            </Button>
          </Link>
        </Grid>
      </Grid>
    </Box>
    // <div id="_error_view">
    //   <div className="error-view container">
    //     <div>
    //       <h2>
    //         {props.message ?? 'An unexpected error has occurred. Please contact your system Administrator'}
    //       </h2>
    //     </div>
    //     <Link href="/" as="/">
    //       <a>
    //         Quay lại trang chủ
    //       </a>
    //     </Link>
    //   </div>
    // </div>
  )
})
