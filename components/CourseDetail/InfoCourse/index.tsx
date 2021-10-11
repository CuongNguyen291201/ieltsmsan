import { Rate } from "antd";
import { Course } from "../../../sub_modules/share/model/courses"
import WebInfo from "../../../sub_modules/share/model/webInfo"
import Breadcrumb from "../../Breadcrumb";
import MainMenu from "../../MainMenu"
import bgPostion from '../../../public/default/positionBg.png';
import { _Topic } from "../../../custom-types";
import { useMemo } from "react";
import { getCoursePageSlug } from '../../../utils/router';

export const InfoCourse = (props: { course: Course, webInfo?: WebInfo, topic?: _Topic }) => {
    const { course, webInfo, topic } = props;
    const breadcrumbItems = useMemo(() => {
        const items: any[] = [{ name: course?.name, slug: getCoursePageSlug({ course }) }];
        if (topic) items.push({ name: topic?.name });
        return items;
    }, [course, topic])
    const title_ = useMemo(() => {
        return topic?.name || course?.name
    }, [topic, course])
    return (
        <div className="header-course">
            <MainMenu hotLine={webInfo?.hotLine} webLogo={webInfo?.webLogo} />
            <div className="background-header-course">
                <div className="positionBackground">
                    <img src={bgPostion} alt="bgPostion" />
                </div>
                <Breadcrumb items={breadcrumbItems} />
                <div className="container">
                    <div className="title"><h1>{title_}</h1></div>
                    <div className="description">{course?.shortDesc}</div>
                    <div className="overview-item">
                        <div className="item-main">
                            <span className="ratting">
                                <Rate className="rating-star" value={4.6} allowHalf disabled />
                            </span>
                            <span className="total-user-rate">(38,820 ratings)<span>{1000}k Students</span></span>
                        </div>
                    </div>
                </div>
                <div className="tag-course">
                    Video
                </div>
            </div>
        </div>
    )
}