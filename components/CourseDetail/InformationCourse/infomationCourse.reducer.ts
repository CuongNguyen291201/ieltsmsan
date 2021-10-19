

// ACTION
enum ActionTypes {
  SET_ACTIVE_LOADING,
  SET_SHOW_COURSE_MEMBERS
}

interface InfoCourseAction {
  type: ActionTypes;
  activeLoading?: boolean;
  showCourseMembers?: boolean;
}

// STATE
type InfoCourseState = {
  activeLoading: boolean;
  showCourseMembers: boolean;
}

export const infoCourseInitState: InfoCourseState = {
  activeLoading: false,
  showCourseMembers: false
}

// REDUCER

export const infoCourseReducer = (state: InfoCourseState, action: InfoCourseAction): InfoCourseState => {
  switch(action.type) {
    case ActionTypes.SET_ACTIVE_LOADING:
      return {
        ...state, activeLoading: !!action.activeLoading
      }

    case ActionTypes.SET_SHOW_COURSE_MEMBERS:
      return {
        ...state, showCourseMembers: !!action.showCourseMembers
      }

    default:
      throw new Error("Unknown Action");
  }
}

// ACTION CREATOR

export const setActiveLoading = (activeLoading: boolean): InfoCourseAction => ({
  type: ActionTypes.SET_ACTIVE_LOADING,
  activeLoading
});

export const setShowCourseMembers = (showCourseMembers: boolean): InfoCourseAction => ({
  type: ActionTypes.SET_SHOW_COURSE_MEMBERS,
  showCourseMembers
})