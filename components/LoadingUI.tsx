import { Box, CircularProgress } from "@mui/material";
import { PropsWithChildren } from "react";

const LoadingUI = (props: PropsWithChildren<{ loading?: boolean }>) => {
  return props.loading 
    ? <Box display="flex" alignItems="center" justifyContent="center" width="100%" height="100%">
      <CircularProgress color="inherit" />
    </Box>
    : <>{props.children}</>
}

export default LoadingUI;
