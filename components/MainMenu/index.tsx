import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { Modal, Button, Space } from "antd";
import "./style.scss";
import { PhoneOutlined } from "@ant-design/icons";
import { Course } from "../../sub_modules/share/model/courses";
import { activeCode, apiGetCodeInfo, apiGetCoursesActivedByUser, apiLoadCourseByCode } from "../../utils/apis/courseApi";
import * as Config from "../../utils/contrants"
import { useSelector } from "react-redux";
import { AppState } from "../../redux/reducers";
function MainMenu() {
  const router = useRouter();
  const currentUser = useSelector((state: AppState) => state.userReducer.currentUser)
  const [isActiveOnMobile, setisActiveOnMobile] = useState(false);
  const [showModalAct, setShowModalAct] = useState(false);
  const [courses, setCourses] = useState<Array<Course>>([]);
  const [textError, setTextError] = useState<String>("");
  const [listCourseActived, setListCourseActived] = useState([])
  const codeRef = useRef(null);

  const showModalActiveCourse = () => {
    setShowModalAct(true);
  };
  const hideModal = () => {
    setShowModalAct(false);
  };

  const getCoursesActivedByUser = async () => {
    const userActive = await apiGetCoursesActivedByUser({ userId: currentUser._id })
    setListCourseActived(userActive.data)
  }

  const getCodeInfo = async () => {
    const codeInfo = await apiGetCodeInfo(codeRef.current.value);
    if (codeInfo.data) {
      if (codeInfo.data.userBuyId === currentUser._id || codeInfo.data.userBuyId === null) {
        if (codeInfo.data.startTime <= Date.now() && codeInfo.data.endTime >= Date.now()) {
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

  const loadCourseByCode = async () => {
    Promise.all([
      getCoursesActivedByUser(),
      getCodeInfo()
    ])
  };

  const handleActiveCode = async (course: Course) => {
    await activeCode({ code: codeRef.current.value, userBuyId: currentUser._id, activeDate: Date.now(), courseId: course._id })
    const userActive = await apiGetCoursesActivedByUser({ userId: currentUser._id })
    setListCourseActived(userActive.data)
  }

  const checkCourseIsActive = (itemId: string) => {
    if (listCourseActived.length > 0) {
      return listCourseActived.some(value => value.itemId === itemId)
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
          <div className="menu-item" onClick={() => router.push("/")}>
            Trang chủ
          </div>
          <div
            className="menu-item document"
            onClick={() => router.push("/document")}
          >
            Tài liệu
          </div>
          <div className="menu-item" onClick={() => router.push('/livegame')}>
            Live game
          </div>
          <div className="menu-item">
            Tin tức
          </div>
          <div className="menu-item">
            Liên hệ
          </div>
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
