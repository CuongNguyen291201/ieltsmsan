import CircularProgress from '@material-ui/core/CircularProgress';
import message from 'antd/lib/message';
import Button from 'antd/lib/button';
import Divider from 'antd/lib/divider';
import Input from 'antd/lib/input';
import Modal from 'antd/lib/modal/Modal';
import React, { memo, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setUserCourseAction } from '../../redux/actions/course.actions';
import { getCookie, TOKEN } from '../../sub_modules/common/utils/cookie';
import { apiActiveCode } from '../../utils/apis/courseApi';
import orderUtils from '../../utils/payment/orderUtils';
import { getPaymentPageSlug } from '../../utils/router';
import './style.scss';

const ActiveCourseModal = (props: {
  courseId: string;
  isVisible: boolean;
  setVisible: (isVisible: boolean) => void;
  className?: string;
}) => {
  const { courseId, isVisible, setVisible, className } = props;
  const inputRef = useRef<Input>();
  const dispatch = useDispatch();
  const [isActivating, setActivating] = useState(false);

  const handleActiveCourse = () => {
    if (isActivating) return;
    const code = inputRef.current?.input.value;
    if (!code) {
      message.warning("Vui lòng nhập code");
      return;
    }
    setActivating(true);
    const token = getCookie(TOKEN);
    if (!token) return;
    apiActiveCode({ code, courseId, token })
      .then((uc) => {
        dispatch(setUserCourseAction(uc));
        message.success("Kích hoạt thành công");
        setActivating(false);
        setVisible(false);
      })
      .catch(() => {
        message.warning("Kích hoạt thất bại!");
        setActivating(false);
      })
  }

  const handleBuyCourse = () => {
    orderUtils.setReturnUrl(window.location.href);
    window.location.href = getPaymentPageSlug(courseId);
  }

  return (
    <Modal
      visible={isVisible}
      className={`active-course-modal${className ? ` ${className}` : ''}`}
      footer={null}
      destroyOnClose
      onCancel={(e) => {
        e.preventDefault();
        setActivating(false);
        setVisible(false)
      }}
    >
      <div className="m-title-block"><h3>MUA KHOÁ HỌC</h3></div>
      <div id="active-code-block">
        <label htmlFor="active-code-input">Nhập code</label>
        <Input id="active-code-input" ref={inputRef} />
        <Button
          type="primary"
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
      <Divider plain>Hoặc</Divider>
      <div id="buy-block">
        <Button
          type="primary"
          onClick={handleBuyCourse}
          className="active-course-button"
        >
          MUA NGAY
        </Button>
      </div>
    </Modal>
  )
}

export default memo(ActiveCourseModal);
