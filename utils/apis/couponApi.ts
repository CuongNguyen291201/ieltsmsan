import { GET_API } from "../../sub_modules/common/api";
import { response_status_codes } from "../../sub_modules/share/api_services/http_status";
import Coupon from "../../sub_modules/share/model/coupon";

export const apiGetCouponByCode = async (code: string): Promise<Coupon & { isExpired: boolean; isExceededUses: boolean }> => {
  const { data, status } = await GET_API(`coupons?code=${code}`, 'api');
  if (status !== response_status_codes.success) return null;
  return data;
}