import { POST_API } from '../../sub_modules/common/api';
import Order from '../../sub_modules/share/model/order';

export const apiCreateOrder = (order: Order, checkValue: string) => {
    return POST_API('create-order', { ...order, checkValue: checkValue });
}
