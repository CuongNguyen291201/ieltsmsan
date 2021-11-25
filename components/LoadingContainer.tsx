import { Backdrop, CircularProgress } from "@material-ui/core";
import { PropsWithChildren } from "react";

const LoadingContainer = (props: PropsWithChildren<{ loading?: boolean }>) => {
  return props.loading
    ? <Backdrop open style={{ color: "#fff"}}>
      <CircularProgress color="inherit" />
    </Backdrop>
    : <>{props.children}</>
}

export default LoadingContainer;