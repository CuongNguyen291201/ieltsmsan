import { NextApiRequest, NextApiResponse } from "next";

export default function (req: NextApiRequest) {
  if (process.env.NODE_ENV === "production") {
    const allowOrigins = process.env.NEXT_PUBLIC_ALLOW_ORIGIN ? process.env.NEXT_PUBLIC_ALLOW_ORIGIN.split(",") : null;
    if (allowOrigins?.length) {
      if (!allowOrigins.includes(req.headers.origin)) {
        return false;
      }
      return true;
    }
    return true;
  }
  return true;
}