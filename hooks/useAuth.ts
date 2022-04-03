import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from ".";
import { getUserFromToken } from "../sub_modules/common/api/userApis";
import { loginSuccessAction } from "../sub_modules/common/redux/actions/userActions";

export default function useAuth (args?: { redirect?: string }) {
  const dispatch = useDispatch();
  const { redirect } = args ?? {};
  const router = useRouter();

  useEffect(() => {
    getUserFromToken(undefined)
      .then((userInfo) => {
        dispatch(loginSuccessAction(userInfo || null));
        if (!userInfo && !!redirect) {
          router.replace(redirect);
        }
      })
  }, []);
}