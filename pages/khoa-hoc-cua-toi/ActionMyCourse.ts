import { Course } from "../../sub_modules/share/model/courses"

export const MyCourseAction = {
    LOAD_COURSES: 'LOAD_COURSES'
}

export const loadMyCourseAction = (courses: Course[]) => ({
    type: MyCourseAction.LOAD_COURSES,
    data: courses
})