import { createStyles, Divider, makeStyles } from "@material-ui/core";
import { memo, PropsWithoutRef } from "react";

const useStyles = makeStyles((_) => createStyles({
  dividerContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "16px 0"
  },
  dividerHz: {
    flex: 1
  }
}))

const DividerText = (props: PropsWithoutRef<{ label?: string }>) => {
  const classes = useStyles();
  return (<div className={classes.dividerContainer}>
    <Divider className={classes.dividerHz} />
    {props.label}
    <Divider className={classes.dividerHz}/>
  </div>)
}

export default memo(DividerText);
