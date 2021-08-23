import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { Modal, Button, Space } from "antd";
import "./style.scss";
import { PhoneOutlined } from "@ant-design/icons";
import { Course } from "../../sub_modules/share/model/courses";
import { apiActiveCode, apiGetCodeInfo, apiGetCoursesActivedByUser, apiGetMyCourses, apiLoadCourseByCode } from "../../utils/apis/courseApi";
import * as Config from "../../utils/contrants"
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../../redux/reducers";
import Link from 'next/link';
import { showLoginModalAction } from "../../sub_modules/common/redux/actions/userActions";
import { showToastifySuccess, showToastifyWarning } from "../../sub_modules/common/utils/toastify";
import { ROUTER_DOCUMENT, ROUTER_NEWS } from '../../utils/router';
import { getCookie, TOKEN } from '../../sub_modules/common/utils/cookie';
function MainMenu() {
  const router = useRouter();
  const currentUser = useSelector((state: AppState) => state.userReducer.currentUser)
  const [isActiveOnMobile, setisActiveOnMobile] = useState(false);
  const [showModalAct, setShowModalAct] = useState(false);
  const [courses, setCourses] = useState<Array<Course>>([]);
  const [textError, setTextError] = useState<String>("");
  const [userCourses, setUserCourse] = useState([])
  const codeRef = useRef(null);
  const dispatch = useDispatch()

  const showModalActiveCourse = () => {
    setShowModalAct(true);
  };
  const hideModal = () => {
    setShowModalAct(false);
    resetData()
  };

  const resetData = () => {
    codeRef.current.value = ''
    setCourses([])
  }

  useEffect(() => {
    if (!!currentUser) {
      apiGetMyCourses(currentUser?._id)
        .then((courses) => {
          setUserCourse(courses);
        })
    }
  }, [currentUser]);

  const getCodeInfo = async () => {
    const codeInfo = await apiGetCodeInfo(codeRef.current.value);
    if (codeInfo.data) {
      if (codeInfo.data.userBuyId === currentUser._id || codeInfo.data.userBuyId === null) {
        if (codeInfo.data.startTime <= Date.now() && (codeInfo.data.endTime >= Date.now() || codeInfo.data.endTime === 0)) {
          const courses = await apiLoadCourseByCode(codeRef.current.value);
          setCourses(courses.data);
          setTextError("")
        }
        else {
          setTextError("Code đã quá hạn kích hoạt")
        }
      }
      else {
        setTextError("Code đã được sử dụng")
      }
    }
  }

  // useEffect(() => {
  //   const userActive = apiGetCoursesActivedByUser({ userId: currentUser._id })
  //   setListCourseActived(userActive.data)
  // }, [])

  const loadCourseByCode = async () => {
    if (!currentUser) {
      hideModal();
      dispatch(showLoginModalAction(true));
      return;
    }
    getCodeInfo()
  };

  const handleActiveCode = async (course: Course) => {
    const token = getCookie(TOKEN);
    if (!token) return;
    await apiActiveCode({ code: codeRef.current.value, token, courseId: course._id })
    await apiGetMyCourses(currentUser?._id)
      .then((courses) => {
        setUserCourse(courses);
      })
  }

  const checkExpriseCourse = (_id: string) => {
    if (userCourses.length > 0) {
      return userCourses.some(value => value?.course?._id === _id)
    }
    else {
      return false
    }
  }

  const checkCourseIsActive = (_id: string) => {
    if (userCourses.length > 0) {
      return userCourses.some(value => value?.course?._id === _id)
    }
    else {
      return false
    }
  }

  return (
    <div className="main-menu">
      <div className="container">
        <div className="search">
          <div className="icon">
            <img src="/home/search-icon.png" alt="" />
          </div>
          <input type="text" placeholder="Tìm kiếm" />
        </div>
        <div className={`${isActiveOnMobile ? "active-on-mobile" : ""} menu`}>
          <div
            className="close-menu-icon"
            onClick={() => {
              setisActiveOnMobile(false);
            }}
          >
            <i className="fas fa-arrow-right"></i>
          </div>
          <Link href="/">
            <a><div className="menu-item">
              Trang chủ
            </div></a>
          </Link>
          <Link href={ROUTER_DOCUMENT}>
            <a><div className="menu-item document">
              Tài liệu
            </div></a>
          </Link>
          <Link href="/livegame">
            <a><div className="menu-item">
              Live game
            </div></a>
          </Link>
          <Link href={ROUTER_NEWS}>
            <a><div className="menu-item">
              Tin tức
            </div></a>
          </Link>
          <Link href="/lien-he" passHref={true}>
            <a><div className="menu-item">
              Liên hệ
            </div></a>
          </Link>
          <div onClick={() => showModalActiveCourse()} className="active-course">
            Kích hoạt khóa học
          </div>
        </div>
        <div
          className="menu-icon"
          onClick={() => setisActiveOnMobile(true)}
        ></div>
        <div
          className={`${isActiveOnMobile ? "active-on-mobile" : ""
            } overlay-on-mobile`}
        ></div>
      </div>
      <div className="modal-active-course">
        <Modal
          title="Kích hoạt khoá học "
          visible={showModalAct}
          onCancel={hideModal}
          cancelText="Cancel"
          footer=""
        >
          <div className="wrapper-active-course">
            <div className="title-active-course">
              <div>Nhập mã kích hoạt mã học vào ô bên dưới</div>
            </div>
            <div className="insert-code">
              <input type="text" ref={codeRef} />
            </div>
            <div style={{ color: 'red' }}>{textError}</div>
            {courses?.length > 0 &&
              courses?.map((value, key) => (
                <div key={key} className="course-item-modal">
                  <div className="course-subitem">
                    <img src={value?.avatar} className="course-avatar-modal" />
                    <div style={{ textAlign: "left", marginLeft: 2 }}>
                      <p className="title-course">{value?.name}</p>
                      <p className="des-course">{value?.shortDesc}</p>
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3>{value?.cost.toLocaleString('vi', { currency: 'VND' })} VNĐ</h3>
                    <div>Mã Code</div>
                    <div className="title-course">{codeRef.current.value}</div>
                    {
                      !checkCourseIsActive(value?._id) ?
                        <Button size="small" type="primary" onClick={() => handleActiveCode(value)} style={{ backgroundColor: '#3fb307', borderColor: '#3fb307' }}>Kích hoạt</Button> :
                        <Button size="small" type="primary" style={{ backgroundColor: '#d9534f', borderColor: '#d9534f' }}>Đã kích hoạt</Button>
                    }
                  </div>
                </div>
              ))}
            <div className="search-code">
              <button onClick={loadCourseByCode}>Tìm kiếm</button>
            </div>
          </div>
          <div className="giai-dap-thac-mac">
            <div>Giải đáp thắc mắc Hotline:</div>{" "}
            <div>
              <PhoneOutlined /> 0947090981
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}

export default MainMenu;
