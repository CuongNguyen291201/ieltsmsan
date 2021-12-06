import axios from "axios";
import cookie from "cookie";
import { NextApiRequest, NextApiResponse } from "next";
import { LOGIN_FAILED } from "../../../sub_modules/share/constraint";
import { ROUTER_NOT_FOUND } from "../../../utils/router";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const { data, headers } = await axios.post(`${process.env.NEXT_PUBLIC_ENDPOINT}/api/login`, req.body, {
        withCredentials: true
      });
      const cookies = headers["set-cookie"];
      const tokenIndex = cookies.findIndex((cookie) => cookie.startsWith('token='));
      if (tokenIndex !== -1) {
        const tokenCookie = cookies[tokenIndex];
        const parsedCookie = cookie.parse(tokenCookie);
        const rewrittenCookie = cookie.serialize('token', parsedCookie["token"], {
          domain: process.env.NEXT_PUBLIC_DOMAIN,
          expires: new Date(parsedCookie["Expires"] || parsedCookie["expires"]),
          sameSite: "strict",
          httpOnly: true,
          path: "/"
        });
        cookies.splice(tokenIndex, 1, rewrittenCookie);
      }
      res.setHeader("Set-Cookie", cookies);
      res.status(200).json(data);
    } catch (error) {
      res.status(200).json({ loginCode: LOGIN_FAILED });
    }
  } else {
    res.writeHead(302, { Location: ROUTER_NOT_FOUND }).end();
  }
}