import { Theme } from "@mui/material";
import { makeStyles } from "@mui/styles";

const useTopicContentStyles = makeStyles((theme: Theme) => ({
  mainView: {
    background: "#fff"
  },
  mainGrid: {
    boxShadow: "0px 4px 30px rgba(95, 73, 118, 0.15)"
  },
  boxShadowContainer: {
    boxShadow: "0px 4px 30px rgba(95, 73, 118, 0.15)"
  },
  boxContent: {
    padding: "8px",
    [theme.breakpoints.up(theme.breakpoints.values.md)]: {
      padding: "16px"
    }
  },
  commentShadow: {
    background: "#fff",
    boxShadow: "0px 4px 30px rgba(95, 73, 118, 0.1)"
  },
  commentPanelVideo: {
    height: "416px",
    [theme.breakpoints.up(theme.breakpoints.values.md)]: {
      height: "256px",
    },
    [theme.breakpoints.up(theme.breakpoints.values.lg)]: {
      height: "306px"
    },
    [theme.breakpoints.up(theme.breakpoints.values.xl)]: {
      height: "386px"
    },
    [theme.breakpoints.up(theme.breakpoints.values.xxl)]: {
      height: "416px"
    }
  },
  commentPanel: {
    height: "416px"
  },
  sectionPanelBorder: {
    borderBottom: "1px solid rgba(190, 203, 211, 0.3)"
  },
  tableOfContent: {
    boxShadow: "0px 4px 30px rgba(95, 73, 118, 0.1)"
  },
  tableOfContentMobile: {
    [theme.breakpoints.up(theme.breakpoints.values.md)]: {
      display: "none"
    },
    "&.theater-mode": {
      display: "unset !important"
    }
  },
  tableOfContentDesktop: {
    [theme.breakpoints.down(theme.breakpoints.values.md)]: {
      display: "none"
    },
    "&.theater-mode": {
      display: "none !important"
    }
  }
}));

export default useTopicContentStyles;