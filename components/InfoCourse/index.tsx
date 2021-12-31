import { Rating } from "@mui/material";
import { useMemo } from "react";
import { _Topic } from "../../custom-types";
import bgPostion from '../../public/images/icons/positionBg.png';
import { Course } from "../../sub_modules/share/model/courses";
import { getCoursePageSlug, getTopicPageSlug } from '../../utils/router';
import Breadcrumb from "../Breadcrumb";
import './style.scss';

export const InfoCourse = (props: { course?: Course, topic?: _Topic }) => {
    const { course, topic } = props;
    const { breadcrumbItems, title_, shortDesc } = useMemo(() => {
        const items: any[] = [];
        if (course) items.push({ name: course?.name, slug: getCoursePageSlug({ course }) });
        if (topic) items.push({ name: topic?.name });
        return {
            breadcrumbItems: items,
            title_: `${course?.name || ''}${topic ? `: ${topic.name}` : ''}`,
            shortDesc: !!topic ? (topic.shortDescription || '') : (course?.shortDesc || '')
        };
    }, []);

    return (
        <div className="header-course">
            <div className="background-header-course">
                <div className="positionBackground">
                    <img src={bgPostion} alt="bgPostion" />
                </div>
                <div className="container">
                    <Breadcrumb items={breadcrumbItems} />
                    <div className="title"><h1>{title_}</h1></div>
                    <div className="description">{shortDesc}</div>
                    {!topic && <div className="overview-item">
                        <div className="item-main">
                            <span className="rating">
                                <Rating className="rating-star" value={4.6} readOnly precision={0.5} />
                            </span>
                            <span className="total-user-rate">(38,820 ratings)<span className="course-total-users">{1000}k Students</span></span>
                        </div>
                    </div>}
                </div>
                {!topic && <div className="tag-course">
                    Video
                </div>}
            </div>
        </div>
    )
}