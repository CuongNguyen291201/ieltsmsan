import { WebMenuItem } from "../../../sub_modules/share/model/webMenuItem";

export interface MenuState {
    rootItems: WebMenuItem[],
    mapItem: {
        [itemId: string]: WebMenuItem[]
    }
}

export const initMenuState = (menu: WebMenuItem[]) => {
    const rootItems = menu.filter((item) => !item.parentId).sort((a, b) => a.index - b.index);
    const mapItem = menu.sort((a, b) => a.index - b.index)
        .reduce((map: {[itemId: string]: WebMenuItem[]}, item) => {
            const key = item.parentId || '';
            if (!key) {
                map[`${item._id}`] = [];
            } else {
                map[key] = [...(map[key] || []), item];
            }
            return map;
        }, {});
    return {
        rootItems, mapItem
    }
}