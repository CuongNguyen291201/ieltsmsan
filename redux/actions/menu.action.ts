import { BaseAction } from ".";
import { WebMenuItem } from "../../sub_modules/share/model/webMenuItem";
import { ActionTypes, Scopes } from "../types";

export interface MenuAction extends BaseAction {
  scope: typeof Scopes.MENU
}

export const getWebMenuAction = (items: WebMenuItem[]): MenuAction => ({
  scope: Scopes.MENU, type: ActionTypes.MENU_GET_WEB_MENU, payload: { items }
});
