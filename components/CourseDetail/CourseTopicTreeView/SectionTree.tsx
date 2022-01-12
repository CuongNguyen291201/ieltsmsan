import ExpandLess from "@mui/icons-material/ExpandLess";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import classNames from "classnames";
import router from "next/router";
import { useSnackbar } from "notistack";
import { Fragment, useState } from "react";
import { useSelector } from "react-redux";
import { _Topic } from "../../../custom-types";
import { AppState } from "../../../redux/reducers";
import { STATUS_OPEN } from "../../../sub_modules/share/constraint";
import { getTopicPageSlug } from "../../../utils/router";
import { getTopicShortDescription } from "./courseTopicTree.logic";
import './section-tree.scss';
import TopicIcon from "./TopicIcon";

const SectionTreeItem = (props: { section: _Topic }) => {
  const { enqueueSnackbar } = useSnackbar();
  const currentUser = useSelector((state: AppState) => state.userReducer.currentUser);
  const { section } = props;
  const [expanded, setExpanded] = useState(true);
  const onClickLecture = (lecture: _Topic) => {
    if (!lecture.isOverStartTime && lecture.startTime > 0) {
      enqueueSnackbar("Bài học chưa được phát hành.", { variant: "info" });
      return;
    } else {
      router.push(getTopicPageSlug({ topic: lecture }))
    }
  }

  return (<Accordion
    expanded={expanded}
    onChange={(_, expanded) => setExpanded(expanded)}
    key={section._id}
    elevation={0}
    className="section-wrapper"
  >
    <AccordionSummary className="section-summary">
      <div className="icon-expand-wrapper">
        {expanded ? <ExpandLess className="icon-expand icon-expand-less" /> : <ExpandLess className="icon-expand icon-expand-expanded" />}
      </div>
      <div className="section-header-wrapper">
        <div className="section-name">
          {section.name}
        </div>
        <div className="section-shortdesc">
          {getTopicShortDescription(section)}
        </div>
      </div>
      {currentUser && <div className="section-progress">
        <div className="section-progress-box">
          {section.topicProgress?.progress ?? 0} %
        </div>
      </div>}
    </AccordionSummary>

    <AccordionDetails className="section-details">
      <div>
        {!!section.childs?.length && section.childs.map((lecture, i) => {
          return (<div key={lecture._id} className="lecture-item">
            <div className="lecture-item-left-view">
              <div className="lecture-item-index">
                {lecture.orderIndex + 1}
              </div>
              <div>
                {/* FREE & LIVE */}
              </div>
            </div>

            <div onClick={() => onClickLecture(lecture)} className={classNames('lecture-item-main-view', i === section.childs.length - 1 ? ' lecture-last' : '')}>
              {/* MAIN SECTION */}
              <div className="lecture-icon">
                {/* ICONS */}
                <TopicIcon topicType={lecture.type} isMain isTopicOpen={lecture.status === STATUS_OPEN} topicVideoUrl={lecture.videoUrl} />
              </div>

              <div style={{ minHeight: "34px" }}>
                <div className="lecture-name">{lecture.name}</div>
                <div className="lecture-description">{getTopicShortDescription(lecture)}</div>
              </div>

              <div></div>
            </div>
          </div>)
        })}
      </div>
    </AccordionDetails>

  </Accordion>)
}

const SectionTree = () => {
  const { mainTopics } = useSelector((state: AppState) => state.topicReducer);

  return (<div id="section-tree">
    {!!mainTopics.length && mainTopics.map((section) => {
      return (<Fragment key={section._id}>
        <SectionTreeItem section={section} />
      </Fragment>)
    })}
  </div>)
}

export default SectionTree;
