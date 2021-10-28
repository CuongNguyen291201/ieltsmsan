import { Course } from '../../sub_modules/share/model/courses';
import ImageCourse from '../../public/event/banner-event.jpg'
import './style.scss';
import { apiGetMyCourses } from '../../utils/apis/courseApi';
import { useRouter } from 'next/router';
import { getCourseMembersPageSlug } from '../../utils/router';
import { UserInfo } from '../../sub_modules/share/model/user';
export const RelatedCourse = (props: { courses: Course[]; user: UserInfo }) => {
    const { courses, user } = props
    const router = useRouter();
    return (
        <div className="related-course">
            <div className="title-related"><i className="far fa-home"></i><h2>Tổng quan</h2>
                <div className="beau-left"></div>
            </div>
            <div className="related-courses-item">
                {courses?.map((value, index) => (
                    <div className="item-related" key={index + value._id} onClick={() => {
                        router.push(`${getCourseMembersPageSlug({ course: value })}?userId=${user._id}`, undefined, { shallow: true });
                    }}>
                        <img src={value.avatar || ImageCourse} />
                        <div className="inf-course_">
                            <div className="name__">{value?.name}</div>
                            <div className="price-course_">{value?.discountPrice}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}