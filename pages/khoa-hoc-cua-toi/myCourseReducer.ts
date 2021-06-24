import { Course } from "../../sub_modules/share/model/courses";
import { MyCourseAction } from "./ActionMyCourse"
export interface MyCoursePageState {
    courses: Course[];
}

export const myCourseInitState: MyCoursePageState = {
    courses: []
}



const reducer = (state = myCourseInitState, action: any): MyCoursePageState => {
    switch (action.type) {
        case MyCourseAction.LOAD_COURSES:
            return {
                ...state,
                courses: action.data
            }

        default:
            return state;
    }
}

export default reducer;


