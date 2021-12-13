import { Button, CircularProgress, Dialog, DialogContent, DialogTitle, TextField } from "@mui/material";
import { useSnackbar } from "notistack";
import React, { memo, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setUserCourseAction } from '../../redux/actions/course.actions';
import { apiActiveCode } from '../../utils/apis/courseApi';
import orderUtils from '../../utils/payment/orderUtils';
import { getPaymentPageSlug } from '../../utils/router';
import DividerText from "../DividerText";
import './style.scss';

const ActiveCourseModal = (props: {
  courseId: string;
  isVisible: boolean;
  setVisible: (isVisible: boolean) => void;
  className?: string;
}) => {
  const { courseId, isVisible, setVisible, className } = props;
  const inputRef = useRef<HTMLInputElement>();
  const dispatch = useDispatch();
  const [isActivating, setActivating] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleActiveCourse = () => {
    if (isActivating) return;
    const code = inputRef.current?.value;
    if (!code) {
      enqueueSnackbar("Vui lòng nhập code", { variant: "warning" });
      return;
    }
    setActivating(true);
    // const token = getCookie(TOKEN);
    // if (!token) return;
    apiActiveCode({ code, courseId })
      .then((uc) => {
        dispatch(setUserCourseAction(uc));
        if (!!uc) enqueueSnackbar("Kích hoạt thành công", { variant: "success" });
        else enqueueSnackbar("Kích hoạt không thành công", { variant: "info" });
        setActivating(false);
        setVisible(false);
      })
      .catch((e: Error) => {
        enqueueSnackbar(e?.message || 'Có lỗi xảy ra!', { variant: "error" });
        setActivating(false);
      })
  }

  const handleBuyCourse = () => {
    orderUtils.setReturnUrl(window.location.href);
    window.location.href = getPaymentPageSlug(courseId);
  }

  return (
    <Dialog
      open={isVisible}
      className={`active-course-modal${className ? ` ${className}` : ''}`}
      onClose={() => {
        setActivating(false);
        setVisible(false)
      }}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        <div className="m-title-block"><h3>MUA KHOÁ HỌC</h3></div>
      </DialogTitle>
      <DialogContent>
        <div id="active-code-block">
          <label htmlFor="active-code-input">Nhập code</label>
          {/* <Input id="active-code-input" ref={inputRef} /> */}
          <TextField id="active-code-input" variant="outlined" size="small" type="text" inputRef={inputRef} />
          <Button
            variant="contained"
            onClick={handleActiveCourse}
            className="active-course-button"
          >
            {
              isActivating
                ? <CircularProgress size={20} style={{ color: "white" }} />
                : 'KÍCH HOẠT'
            }
          </Button>
        </div>
        <DividerText label="Hoặc" />
        <div id="buy-block">
          <Button
            variant="contained"
            onClick={handleBuyCourse}
            className="active-course-button"
          >
            MUA NGAY
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default memo(ActiveCourseModal);
