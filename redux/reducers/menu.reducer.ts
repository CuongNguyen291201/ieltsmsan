import { WebMenuItem } from "../../sub_modules/share/model/webMenuItem";
import { MenuAction } from "../actions/menu.action";
import { ActionTypes, Scopes } from "../types";

export interface MenuState {
  rootItems: Array<WebMenuItem>;
  mapItem: { [parentId: string]: Array<WebMenuItem> }
  isLoading: boolean;
}

const initialState: MenuState = {
  rootItems: [],
  mapItem: {},
  isLoading: true
}

export const menuReducer = (state = initialState, action: MenuAction): MenuState => {
  if (action.scope === Scopes.MENU) {
    switch (action.type) {
      case ActionTypes.MENU_GET_WEB_MENU:
        return {
          ...state,
          ...getInitMenuState(action.payload.items || []),
          isLoading: false 
        }
      default:
        return state;
    }
  }
  return state;
}

const getInitMenuState = (items: WebMenuItem[]) => {
  const _items = [...items].sort((a, b) => (a.index || 0) - (b.index || 0));
  const rootItems = _items.filter((item) => !item.parentId);
  const mapItem = _items.reduce((map: { [itemId: string]: WebMenuItem[] }, item) => {
    const key = item.parentId || '';
    if (!!key) map[key] = [...(map[key] || []), item];
    else map[`${item._id}`] = [...(map[`${item._id}`] || [])];
    return map;
  }, {});
  return {
    rootItems, mapItem
  }
}
