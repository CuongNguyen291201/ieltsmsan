import { PropsWithChildren } from "react";
import { Skeleton as MuiSkeleton } from "@material-ui/lab";
import { withStyles } from "@material-ui/core";

const SkeletonContainer = (props: PropsWithChildren<{ loading?: boolean; noTransform?: boolean }>) => {
  const Skeleton = !!props.noTransform
    ? withStyles({
      text: {
        transform: "none",
        transformOrigin: "none"
      }
    })(MuiSkeleton)
    : MuiSkeleton;

  return props.loading
    ? <Skeleton>{props.children}</Skeleton>
    : <>{props.children}</>
}

export default SkeletonContainer;