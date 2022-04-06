import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getUserFromToken } from "../sub_modules/common/api/userApis";
import { loginSuccessAction } from "../sub_modules/common/redux/actions/userActions";

export default function useAuth (args?: { authenticatedRedirect?: string; unAuthenticatedRedirect?: string; }) {
  const dispatch = useDispatch();
  const { authenticatedRedirect, unAuthenticatedRedirect } = args ?? {};
  const router = useRouter();

  useEffect(() => {
    getUserFromToken(undefined)
      .then((userInfo) => {
        dispatch(loginSuccessAction(userInfo || null));
        if (!!userInfo && !!authenticatedRedirect) {
          router.replace(authenticatedRedirect);
        }
        if (!userInfo && !!unAuthenticatedRedirect) {
          router.replace(unAuthenticatedRedirect);
        }
      })
  }, []);
}