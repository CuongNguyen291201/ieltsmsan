import { WebMenuItem } from "../../../sub_modules/share/model/webMenuItem";

// Actions Types
enum ActionTypes { INIT_WEB_MENU }

export interface MenuState {
    rootItems: WebMenuItem[],
    mapItem: {
        [menuId: string]: WebMenuItem[]
    }
}

// States
export const menuState: MenuState = {
    rootItems: [],
    mapItem: {}
}

const initMenuState = (menu: WebMenuItem[]) => {
    const rootItems = menu.filter((item) => !item.parentId).sort((a, b) => a.index - b.index);
    const mapItem = menu.sort((a, b) => a.index - b.index)
        .reduce((map: {[itemId: string]: WebMenuItem[]}, item) => {
            const key = item.parentId || '';
            if (!key) {
                map[`${item._id}`] = [...(map[`${item._id}`] || [])];
            } else {
                map[key] = [...(map[key] || []), item];
            }
            return map;
        }, {});
    return {
        rootItems, mapItem
    }
}

// Reducer
export function webMenuReducer(state: MenuState = menuState, action: any): MenuState {
    switch (action.type) {
        case ActionTypes.INIT_WEB_MENU:
            return {
                ...state,
                ...initMenuState(action.menu)
            }            
    
        default:
            return state;
    }
}

// Actions
export const webMenuAction = (menu: WebMenuItem[]) => ({
    type: ActionTypes.INIT_WEB_MENU,
    menu
})