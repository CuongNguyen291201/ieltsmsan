import { Theme } from "@mui/material";
import { makeStyles } from "@mui/styles";

const useTopicWidgetStyles = makeStyles((theme: Theme) => ({
  topicOverviewItem: {
    height: "50px",
    boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
    display: "flex",
    alignItems: "center",
    padding: "0 5px",
    marginTop: "16px"
  },
  topicOverviewLabel: {
    flex: 1,
    fontWeight: 600,
    color: "#29313A",
    paddingLeft: "40px",
    [theme.breakpoints.down(theme.breakpoints.values.md)]: {
      paddingLeft: "16px"
    },
    [theme.breakpoints.down(theme.breakpoints.values.sm)]: {
      paddingLeft: "8px"
    }
  },
  topicOverviewValue: {
    fontSize: "14px",
    fontWeight: 500,
    width: "calc(40% - 50px)",
    padding: "12px 5px",
    background: "#f9fafa",
    boxShadow: "inset 0px 2px 10px #00000026",
    color: "#000",
    textAlign: "center",
  },
  topicDataSelect: {
    fontSize: "14px",
    fontWeight: 500,
    width: "calc(40% - 50px)",
    padding: "8px 5px",
    background: "#f9fafa",
    boxShadow: "inset 0px 2px 10px #00000026",
    color: "#000",
    borderRadius: 0,
    fontFamily: "inherit",
    textAlign: "center",
    "& .MuiSelect-select": {
      padding: 0,
      paddingRight: "0px !important",
    },
    "& fieldset": {
      border: "none"
    },
  },
  gameButton: {
    borderRadius: 0,
    fontWeight: 600,
    fontSize: "18px",
    height: "50px",
    width: "290px",
  },
  gameButtonPlay: {
    backgroundColor: "#DF92DD",
    color: "#fff",
    "&:hover": {
      backgroundColor: "#DF92DD",
      color: "#fff",
    }
  },
  gameButtonReview: {
    border: "1px solid #000",
    color: "#000"
  }
}));

export default useTopicWidgetStyles;
