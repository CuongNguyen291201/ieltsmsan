import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { ROUTER_NOT_FOUND } from "../../../utils/router";
import cookie from "cookie";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_ENDPOINT}/api/logout`, {
        token: req.cookies["token"],
        ...req.body
      }, { withCredentials: true });
    } catch (error) {
      // console.error(error);
    }
    const cookies = cookie.serialize("token", "deleted", {
      path: "/",
      expires: new Date(0),
      httpOnly: true,
      maxAge: 0
    });
    res.setHeader("Set-Cookie", cookies);
    res.status(200).json({ message: "Success" });
  } else {
    res.writeHead(302, { Location: ROUTER_NOT_FOUND }).end();
  }
}