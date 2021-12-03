import { IncomingMessage } from "http";
import { NextApiRequest } from "next";
import { POST_API } from '../../sub_modules/common/api'
import { response_status_codes } from "../../sub_modules/share/api_services/http_status";

export const apiLogout = () => POST_API(`${process.env.NEXT_PUBLIC_NEXT_ENDPOINT}/api/auth/logout`, {});

export const getUserFromToken = async (req?: NextApiRequest | IncomingMessage) => {
  const cookie = req?.headers?.cookie;
  const { data, status } = await POST_API(`${process.env.NEXT_PUBLIC_NEXT_ENDPOINT}/api/auth/get-user-from-token`, {}, "", cookie);
  if (status !== response_status_codes.success) return null;
  return data;
}