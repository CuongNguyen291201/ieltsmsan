import { Button, message, Skeleton, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import moment from 'moment';
import { PropsWithChildren, useEffect, useReducer } from 'react';
import { MapUserCourseStatus } from '../../../custom-types/MapContraint';
import { getCookie, TOKEN } from '../../../sub_modules/common/utils/cookie';
import { USER_COURSE_APPROVE, USER_COURSE_REJECT, USER_COURSE_WAITING } from '../../../sub_modules/share/constraint';
import { Course } from '../../../sub_modules/share/model/courses';
import UserCourse from '../../../sub_modules/share/model/userCourse';
import { apiChangeCourseMemberStatus, apiGetCourseMembers } from '../../../utils/apis/courseApi';
import { changePage, initMemList, memListInitState, memListReducer, setLoading, setNewMemListStatus, setOnAction } from './memberListView.logic';
import './style.scss';

const LOAD_LIMIT = 10;

const MemListCell = (props: PropsWithChildren<{ centerAlign?: boolean, width?: string }>) => (
  <div style={{
    textAlign: props.centerAlign ? "center" : "initial", width: props.width,
    wordWrap: "break-word"
  }}>
    {props.children}
  </div>
)

const MemberListView = (props: { course: Course }) => {
  const { course } = props;
  const [{
    memLists, currentPage, totalMems, isLoading, isOnAction
  }, uiLogic] = useReducer(memListReducer, memListInitState);

  useEffect(() => {
    const token = getCookie(TOKEN);
    if (!token) return;
    apiGetCourseMembers({
      token,
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
      .finally(() => uiLogic(setLoading(false)))
  }, []);

  const onChangePage = (page: number) => {
    const token = getCookie(TOKEN);
    if (!token) return;
    uiLogic(setLoading(true));
    apiGetCourseMembers({
      token,
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
    const token = getCookie(TOKEN);
    if (!token) return;
    uiLogic(setOnAction(true));
    apiChangeCourseMemberStatus({ token, ...args, courseId: course._id })
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

  const columns: ColumnsType<UserCourse> = [
    {
      key: 'index',
      title: 'STT',
      dataIndex: null,
      render: (_, _row, i) => <MemListCell centerAlign>{(currentPage - 1) * LOAD_LIMIT + i + 1}</MemListCell>
    },
    {
      key: 'name',
      title: 'Tên học sinh',
      dataIndex: 'userName',
      render: (_, { user }) => <MemListCell width="120px">{user?.name}</MemListCell>,
      width: "20%"
    },
    {
      key: 'email',
      title: 'Email',
      dataIndex: 'email',
      render: (_, { user }) => <MemListCell width="120px">{user?.email}</MemListCell>,
      width: "20%"
    },
    {
      key: 'joinDate',
      title: 'Ngày tham gia',
      dataIndex: 'joinDate',
      render: (_, { joinDate }) => <MemListCell>{joinDate ? moment(joinDate).format("HH:mm:ss DD-MM-YYYY") : ''}</MemListCell>
    },
    {
      key: 'status',
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (_, { status }) => <MemListCell>{MapUserCourseStatus[status]}</MemListCell>
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
      <Table
        columns={columns}
        dataSource={memLists}
        rowKey={(uc) => uc._id}
        loading={isLoading}
        pagination={{
          pageSize: LOAD_LIMIT,
          current: currentPage,
          total: totalMems,
          position: ["bottomCenter"],
          onChange: (page) => onChangePage(page)
        }}
      />
    </div>
  );
}

export default MemberListView;
