

// ACTION
enum ActionTypes {
  SET_ACTIVE_LOADING
}

interface InfoCourseAction {
  type: ActionTypes;
  activeLoading?: boolean;
}

// STATE
type InfoCourseState = {
  activeLoading: boolean;
}

export const infoCourseInitState: InfoCourseState = {
  activeLoading: false,
}

// REDUCER

export const infoCourseReducer = (state: InfoCourseState, action: InfoCourseAction): InfoCourseState => {
  switch(action.type) {
    case ActionTypes.SET_ACTIVE_LOADING:
      return {
        ...state, activeLoading: !!action.activeLoading
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