import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { ROUTER_NOT_FOUND } from "../../../utils/router";
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_ENDPOINT}/api/get-user-from-token`,
        { token: req.cookies["token"] },
        {
          withCredentials: true,
        });
      res.status(200).json(data);
    } catch (error) {
      res.status(200).json(JSON.stringify(null));
    }
  } else {
    res.writeHead(302, { Location: ROUTER_NOT_FOUND }).end();
  }
}