import ExpandMore from "@mui/icons-material/ExpandMore";
import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Fragment, memo, useEffect, useRef } from "react";
import { HeadingData } from "../../hooks/useHeadingsData";

const useStyles = makeStyles((_) => ({
  tableOfContentRoot: {
    borderRadius: "0 !important",
    boxShadow: "none"
  },
  tableOfContentBody: {
    borderTop: "1px solid rgba(190, 203, 211, 0.3)"
  },
  headingTypography: {
    cursor: "pointer",
    "&:hover": {
      textDecoration: "underline"
    }
  },
}));

const TableOfContent = (props: { nestedHeadings: Array<HeadingData & { items?: Array<HeadingData> }> }) => {
  const { nestedHeadings } = props;
  const ref = useRef<HTMLDivElement | null>(null);
  const classes = useStyles();
  const onClickHeading = (id: string) => {
    window.location.hash = id;
  }

  const stickyTableOfContent = () => {
    if (ref.current) {
      const offsetTop = ref.current.offsetTop;
      if (window.scrollY >= offsetTop) {
        ref.current.classList.add("sticky-table-of-content");
      } else {
        ref.current.classList.remove("sticky-table-of-content");
      }
    }
  }

  useEffect(() => {
    window.addEventListener("scroll", stickyTableOfContent);
    return () => {
      window.removeEventListener("scroll", stickyTableOfContent);
    }
  }, []);

  return (
    <Box component="div" ref={ref}>
      <Accordion defaultExpanded={true} className={classes.tableOfContentRoot}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography fontSize="16px" fontWeight="bold">Table of contents</Typography>
        </AccordionSummary>

        <AccordionDetails className={classes.tableOfContentBody}>
          {nestedHeadings.map((heading2) => (
            <Fragment key={heading2.id}>
              <Typography
                component="div"
                onClick={() => onClickHeading(heading2.id)}
                fontWeight={700}
                className={classes.headingTypography}
              >
                {heading2.title}
              </Typography>
              {!!heading2.items?.length && heading2.items.map((heading3) => (
                <Typography
                  sx={{ marginLeft: "16px" }}
                  component="div"
                  onClick={() => onClickHeading(heading3.id)}
                  className={classes.headingTypography}
                >
                  {heading3.title}
                </Typography>
              ))}
            </Fragment>
          ))}
        </AccordionDetails>
      </Accordion>
    </Box>
  )
}

export default memo(TableOfContent);
