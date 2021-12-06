import { Rating } from "@material-ui/lab";
import { useMemo } from "react";
import { _Topic } from "../../../custom-types";
import bgPostion from '../../../public/images/icons/positionBg.png';
import { Course } from "../../../sub_modules/share/model/courses";
import WebInfo from "../../../sub_modules/share/model/webInfo";
import { getCoursePageSlug } from '../../../utils/router';
import Breadcrumb from "../../Breadcrumb";
import MainMenu from "../../MainMenu";

export const InfoCourse = (props: { course: Course, webInfo?: WebInfo, topic?: _Topic }) => {
    const { course, webInfo, topic } = props;
    const { breadcrumbItems, title_, shortDesc } = useMemo(() => {
        const items: any[] = [{ name: course?.name, slug: getCoursePageSlug({ course }) }];
        if (topic) items.push({ name: topic?.name });
        return {
            breadcrumbItems: items,
            title_: `${course?.name || ''}${topic ? `: ${topic.name}` : ''}`,
            shortDesc: !!topic ? (topic.shortDescription || '') : (course.shortDesc || '')
        };
    }, [course, topic]);

    return (
        <div className="header-course">
            <MainMenu hotLine={webInfo?.hotLine} webLogo={webInfo?.webLogo} disableFixedHeader />
            <div className="background-header-course">
                <div className="positionBackground">
                    <img src={bgPostion} alt="bgPostion" />
                </div>
                <Breadcrumb items={breadcrumbItems} />
                <div className="container">
                    <div className="title"><h1>{title_}</h1></div>
                    <div className="description">{shortDesc}</div>
                    {!topic && <div className="overview-item">
                        <div className="item-main">
                            <span className="ratting">
                                {/* <Rate className="rating-star" value={4.6} allowHalf disabled /> */}
                                <Rating className="rating-star" value={4.6} readOnly precision={0.5} />
                            </span>
                            <span className="total-user-rate">(38,820 ratings)<span>{1000}k Students</span></span>
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