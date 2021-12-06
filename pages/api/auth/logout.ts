import axios from "axios";
import cookie from "cookie";
import { NextApiRequest, NextApiResponse } from "next";
import nextCors from "../../../utils/apis/nextCors";
import { ROUTER_NOT_FOUND } from "../../../utils/router";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const allowed = nextCors(req);
  if (!allowed) {
    res.status(403).json({ message: "Forbidden" });
    return;
  }
  if (req.method === "POST") {
    const domain = (req.headers.host ?? "").split(":")[0] || undefined;
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
      maxAge: 0,
      domain
    });
    res.setHeader("Set-Cookie", cookies);
    res.status(200).json({ message: "Success" });
  } else {
    res.writeHead(302, { Location: ROUTER_NOT_FOUND }).end();
  }
}