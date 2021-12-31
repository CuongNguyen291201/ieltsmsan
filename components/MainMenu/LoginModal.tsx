import { Box, Dialog, Slide } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { forwardRef, ReactElement } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../../redux/reducers";
import LoginForm from "../../sub_modules/common/components/auth/LoginForm";
import { showLoginModalAction, showRegisterModalAction } from "../../sub_modules/common/redux/actions/userActions";

const TransitionComponent = forwardRef((props: TransitionProps & { children: ReactElement<any, any>}, ref) => (
  <Slide direction="down" ref={ref} {...props} />
));

const LoginModal = () => {
  const isShowLoginModal = useSelector((state: AppState) => state.userReducer.isShowLoginModal);
  const dispatch = useDispatch();
  return (
    <Dialog
      open={isShowLoginModal}
      onClose={() => {
        dispatch(showLoginModalAction(false))
      }}
      fullWidth
      maxWidth="sm"
      TransitionComponent={TransitionComponent}
    >
      <Box display="flex" justifyContent="center">
        <LoginForm
          mainBgrColor="#ec1f24"
          mainTextColor="#fff"
          onClickRegister={() => {
            dispatch(showLoginModalAction(false));
            dispatch(showRegisterModalAction(true));
          }}
          verifyEmailReturnUrl=""
          onLoginSuccess={() => {
            dispatch(showLoginModalAction(false));
          }}
        />
      </Box>
    </Dialog>
  )
}

export default LoginModal;