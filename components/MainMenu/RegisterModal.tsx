import { Box, Dialog, Slide } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { forwardRef, ReactElement } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../../redux/reducers";
import RegisterForm from "../../sub_modules/common/components/auth/RegisterForm";
import { showLoginModalAction, showRegisterModalAction } from "../../sub_modules/common/redux/actions/userActions";

const TransitionComponent = forwardRef((props: TransitionProps & { children: ReactElement<any, any> }, ref) => (
  <Slide direction="down" ref={ref} {...props} />
));

const RegisterModal = () => {
  const isShowRegisterModal = useSelector((state: AppState) => state.userReducer.isShowRegisterModal);
  const dispatch = useDispatch();
  return (
    <Dialog
      open={isShowRegisterModal}
      onClose={() => {
        dispatch(showRegisterModalAction(false))
      }}
      fullWidth
      maxWidth="sm"
      TransitionComponent={TransitionComponent}
    >
      <Box display="flex" justifyContent="center">
        <RegisterForm
          mainBgrColor="#ec1f24"
          mainTextColor="#fff"
          onClickLogin={() => {
            dispatch(showRegisterModalAction(false));
            dispatch(showLoginModalAction(true));
          }}
          onRegisterSuccess={() => {
            dispatch(showRegisterModalAction(false));
          }}
        />
      </Box>
    </Dialog>
  )
}

export default RegisterModal;