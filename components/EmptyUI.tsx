import { Box, Typography } from "@mui/material";
import { InboxOutlined } from "@mui/icons-material";
import { PropsWithoutRef } from "react";

const EmptyUI = (props: PropsWithoutRef<{ description?: string }>) => {
  return <Box
    display="flex"
    alignItems="center"
    justifyContent="center"
    flexDirection="column"
    width="100%"
    height="100%"
  >
    <InboxOutlined fontSize="large" />
    <Typography>{props.description ?? 'No Data'}</Typography>
  </Box>
}

export default EmptyUI;
