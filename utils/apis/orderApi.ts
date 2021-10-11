import { POST_API } from '../../sub_modules/common/api';
import { response_status_codes } from '../../sub_modules/share/api_services/http_status';
import Order from '../../sub_modules/share/model/order';

export const apiCreateOrder = (order: Order, checkValue: string) => {
    return POST_API('create-order', { ...order, checkValue: checkValue });
}

export const apiGetUserOrders = async (args: { offset: number; limit: number }): Promise<{ total: number; data: Order[] }> => {
    const { data, status } = await POST_API(`get-user-orders?offset=${args.offset}&limit=${args.limit}`, {});
    if (status !== response_status_codes.success) return { total: 0, data: [] }
    return data;
}
