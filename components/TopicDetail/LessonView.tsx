import { Box } from "@mui/material";
import classNames from "classnames";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import useHeadingsData from "../../hooks/useHeadingsData";
import { AppState } from "../../redux/reducers";
import { apiUpdateTopicProgress } from "../../utils/apis/topicApi";
import SanitizedDiv from "../SanitizedDiv";
import useTopicContentStyles from "./useTopicContentStyles";

const DocumentsListView = dynamic(() => import('./DocumentsListView'), { ssr: false });
const TableOfContents = dynamic(() => import('../TableOfContents'), { ssr: false });

const LessonView = () => {
  const topic = useSelector((state: AppState) => state.topicReducer.currentTopic);
  const { currentUser } = useSelector((state: AppState) => state.userReducer);
  const nestedHeadings = useSelector((state: AppState) => state.contentReducer.headings);
  const isVideoContent = useMemo(() => !!topic.videoUrl, [topic]);

  const contentRef = useRef<HTMLDivElement | null>(null);

  const classes = useTopicContentStyles();
  useHeadingsData({ rootElement: contentRef.current });

  useEffect(() => {
    if (!currentUser) return;
    if (!topic.videoUrl) {
      apiUpdateTopicProgress({ topicId: topic._id, userId: currentUser._id, progress: 100 });
    }
  }, [currentUser]);

  return (
    <div id="lesson-info-content">
      <Box>
        {/* CONTENT TEXT */}
        {!!topic.description && <Box component="div" className={classes.boxContent} ref={contentRef}>
          <Box className={classNames(classes.tableOfContent, classes.tableOfContentMobile)}>
            <TableOfContents nestedHeadings={nestedHeadings} stickyClass="no-sticky-table-of-content" />
          </Box>
          <SanitizedDiv content={topic.description} />
          {!isVideoContent && <Box>
            <DocumentsListView />
          </Box>}
        </Box>}
      </Box>
    </div>
  );
}

export default LessonView;