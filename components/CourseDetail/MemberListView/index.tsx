import { Button, message, Skeleton, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import moment from 'moment';
import { useRouter } from 'next/router';
import { PropsWithChildren, useEffect, useReducer, useState } from 'react';
import { MapUserCourseStatus } from '../../../custom-types/MapContraint';
import { getCookie, TOKEN } from '../../../sub_modules/common/utils/cookie';
import { USER_COURSE_APPROVE, USER_COURSE_REJECT, USER_COURSE_WAITING } from '../../../sub_modules/share/constraint';
import { Course } from '../../../sub_modules/share/model/courses';
import { UserInfo } from '../../../sub_modules/share/model/user';
import UserCourse from '../../../sub_modules/share/model/userCourse';
import { apiChangeCourseMemberStatus, apiGetCourseMembers } from '../../../utils/apis/courseApi';
import { getCourseMembersPageSlug } from '../../../utils/router';
import { TimeOnline } from '../../TimeOnline';
import { changePage, initMemList, memListInitState, memListReducer, setLoading, setNewMemListStatus, setOnAction, setUserStat } from './memberListView.logic';
import './style.scss';

const LOAD_LIMIT = 10;

const MemListCell = (props: PropsWithChildren<{ centerAlign?: boolean, width?: string }>) => (
  <div className="item-table" style={{
    textAlign: props.centerAlign ? "center" : "left", width: props.width,
    wordWrap: "break-word"
  }}>
    {props.children}
  </div>
)

const MemberListView = (props: { course: Course  }) => {
  const { course } = props;
  const [{
    memLists, currentPage, totalMems, isLoading, isOnAction, userStat
  }, uiLogic] = useReducer(memListReducer, memListInitState);
  const router = useRouter();
  const userStatId = router.query.userId as string;

  useEffect(() => {
    // const token = getCookie(TOKEN);
    // if (!token) return;
    apiGetCourseMembers({
      // token,
      courseId: course._id,
      field: 'joinDate',
      asc: false,
      skip: 0,
      limit: LOAD_LIMIT,
    })
      .then(({ dataList = [], total = 0 }) => {
        uiLogic(initMemList({ memLists: dataList, totalMems: total }));
      })
      .catch((e) => {
        message.error("Có lỗi xảy ra!");
        console.error(e);
      })
      .finally(() => uiLogic(setLoading(false)));
  }, []);

  const onChangePage = (page: number) => {
    // const token = getCookie(TOKEN);
    // if (!token) return;
    uiLogic(setLoading(true));
    apiGetCourseMembers({
      // token,
      courseId: course._id,
      field: 'joinDate',
      asc: false,
      skip: (page - 1) * LOAD_LIMIT,
      limit: LOAD_LIMIT,
    })
      .then(({ dataList, total }) => {
        uiLogic(changePage({ currentPage: page, memLists: dataList, totalMems: total }))
      })
      .catch((e) => {
        message.error("Có lỗi xảy ra!");
        console.error(e);
      })
      .finally(() => uiLogic(setLoading(false)))
  }

  const onAction = (args: { userId: string; status: number }) => {
    // const token = getCookie(TOKEN);
    // if (!token) return;
    uiLogic(setOnAction(true));
    apiChangeCourseMemberStatus({ ...args, courseId: course._id })
      .then((newUc) => {
        if (newUc) {
          uiLogic(setNewMemListStatus(newUc));
          message.success("Thành công!");
        }
      })
      .catch((e) => {
        message.error("Có lỗi xảy ra!");
        console.error(e);
      })
      .finally(() => uiLogic(setOnAction(false)));
  }
  const [userStatistical, setUserStatistical] = useState(false)
  const changView = (user: UserInfo) =>{
    setUserStatistical(true);
    uiLogic(setUserStat(user));
    router.push(`${getCourseMembersPageSlug({ course })}?userId=${user._id}`, undefined, { shallow: true });
  }

  useEffect(() => {
    if (!isLoading && router.isReady) {
      if (!!userStatId) {
        const userCourse = memLists.find(({ user }) => user._id === userStatId);
        if (userCourse) {
          changView(userCourse.user);
        }
      } else {
        setUserStatistical(false)
      }
    }
  }, [isLoading, router.isReady, userStatId]);

  const columns: ColumnsType<UserCourse> = [

    {
      key: 'index',
      title: 'STT',
      dataIndex: null,
      className: "col_1",
      render: (_, _row, i) => <MemListCell centerAlign>{(currentPage - 1) * LOAD_LIMIT + i + 1}</MemListCell>
    },
    {
      key: 'name',
      title: 'Tên học sinh',
      dataIndex: 'userName',
      render: (_, { user }) => <MemListCell><div style={{cursor:'pointer]'}} onClick={() => changView(user)}><div className="name-student">{user?.name}</div><div className="email-student">{user?.email}</div></div></MemListCell>,
      width: "20%"
    },
    {
      key: 'phone',
      title: 'Số điện thoại',
      dataIndex: 'Số điện thoại',
      render: (_, { user }) => <MemListCell>{user?.phoneNumber}</MemListCell>,
      width: "15%"
    },
    {
      key: 'joinDate',
      title: 'Ngày tham gia',
      dataIndex: 'joinDate',
      width: "15%",
      render: (_, { joinDate }) => <MemListCell>{joinDate ? moment(joinDate).format("DD-MM-YYYY") : ''}</MemListCell>
    },
    {
      key: 'joinDate',
      title: 'Ngày hết hạn',
      dataIndex: 'endDate',
      width: "15%",
      render: (_, { expireDate }) => <MemListCell>{expireDate ? moment(expireDate).format("DD-MM-YYYY") : ''}</MemListCell>
    },
    {
      key: 'lastUpdate',
      title: 'Truy cập gần nhất',
      dataIndex: 'lastUpdate',
      width: "20%",
      render: (_, { lastUpdate }) => <MemListCell>{lastUpdate ? moment(lastUpdate).format("DD-MM-YYYY") : ''}</MemListCell>
    },
    {
      key: 'status',
      title: 'Trạng thái',
      dataIndex: 'status',
      width: "15%",
      className: 'isStatus',
      render: (_, { status }) => <MemListCell><span style={status == USER_COURSE_APPROVE ? { color: "#219653" } : { color: "red" }}>{MapUserCourseStatus[status]}</span></MemListCell>
    },
    {
      key: 'action',
      title: 'Hành động',
      dataIndex: 'action',
      render: (_, { status, userId }) => (<MemListCell>
        {
          status === USER_COURSE_REJECT
          && <Button className="action-button" type="default" danger onClick={() => onAction({ userId, status: USER_COURSE_APPROVE })}>Khôi phục</Button>
        }
        {
          status === USER_COURSE_WAITING
          && <Button className="action-button" type="primary" onClick={() => onAction({ userId, status: USER_COURSE_APPROVE })}>Duyệt</Button>
        }
        {
          status === USER_COURSE_APPROVE
          && <Button className="action-button" type="primary" danger onClick={() => onAction({ userId, status: USER_COURSE_REJECT })}>Xoá</Button>
        }
      </MemListCell>)
    }
  ]

  return (
    <div id="members-view">
      <div className="container">
        {!userStatistical ? 
        <div className="wrap-member-list">
          <div className="header-table-member">
            <div className="member_">
              Thành viên
            </div>
            <div className="search-member">
              <input type="text" placeholder="Tìm kiếm thành viên" />
              <i className="far fa-search icon-search"> </i>
            </div>
          </div>
          <Table
            className="table-list-member-panel"
            columns={columns}
            dataSource={memLists}
            rowKey={(uc) => uc._id}
            loading={isLoading}
            scroll={{ x: '1000px'}}
            pagination={{
              pageSize: LOAD_LIMIT,
              current: currentPage,
              total: totalMems,
              position: ["bottomCenter"],
              showTotal: (total) => {
                return <div className="total-pagi">Total {Math.ceil((total || 1) / LOAD_LIMIT)} Pages</div>
              },
              onChange: (page) => onChangePage(page),
              className: "sss",
              itemRender: (page, type) => (
                <div className={`page-item-member-custom${currentPage === page && type === 'page' ? ' active1' : ''}`}>
                  {type === 'prev' && <i className="fas fa-chevron-left chevron-custtom" />}
                  {type === 'next' && <i className="fas fa-chevron-right chevron-custtom" />}
                  {type === 'page' && page}
                
                </div>
              )
            }}
          />
        </div>
         :<TimeOnline course={props.course} user={userStat} />}
        <div>

        </div>
      </div>
    </div>
  );
}

export default MemberListView;
