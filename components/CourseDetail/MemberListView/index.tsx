import {
  Button, Table, TableBody, TableCell as MuiTableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow, withStyles
} from "@material-ui/core";
import moment from 'moment';
import { useRouter } from 'next/router';
import { useSnackbar } from "notistack";
import { useEffect, useMemo, useReducer, useState } from 'react';
import { Column, useTable } from "react-table";
import { MapUserCourseStatus } from '../../../custom-types/MapContraint';
import { USER_COURSE_APPROVE, USER_COURSE_REJECT, USER_COURSE_WAITING } from '../../../sub_modules/share/constraint';
import { Course } from '../../../sub_modules/share/model/courses';
import { UserInfo } from '../../../sub_modules/share/model/user';
import { apiChangeCourseMemberStatus, apiGetCourseMembers } from '../../../utils/apis/courseApi';
import { getCourseMembersPageSlug } from '../../../utils/router';
import { TimeOnline } from '../../TimeOnline';
import { changePage, initMemList, memListInitState, memListReducer, setLoading, setNewMemListStatus, setOnAction, setUserStat } from './memberListView.logic';
import './style.scss';

const LOAD_LIMIT = 10;

const MemberListView = (props: { course: Course }) => {
  const { course } = props;
  const [{
    memLists, currentPage, totalMems, isLoading, isOnAction, userStat
  }, uiLogic] = useReducer(memListReducer, memListInitState);
  const router = useRouter();
  const userStatId = router.query.userId as string;
  const { enqueueSnackbar } = useSnackbar();

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
        enqueueSnackbar("Có lỗi xảy ra!", { variant: "error" })
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
      skip: page * LOAD_LIMIT,
      limit: LOAD_LIMIT,
    })
      .then(({ dataList, total }) => {
        uiLogic(changePage({ currentPage: page, memLists: dataList, totalMems: total }))
      })
      .catch((e) => {
        enqueueSnackbar("Có lỗi xảy ra!", { variant: "error" })
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
          enqueueSnackbar("Thành công!", { variant: "success" })
        }
      })
      .catch((e) => {
        enqueueSnackbar("Có lỗi xảy ra!", { variant: "error" });
        console.error(e);
      })
      .finally(() => uiLogic(setOnAction(false)));
  }
  const [userStatistical, setUserStatistical] = useState(false)
  const changView = (user: UserInfo) => {
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

  const columns: Array<Column<{
    index: number;
    userName: JSX.Element;
    userPhoneNumber: string;
    joinDate: string;
    expireDate: string;
    lastUpdate: string;
    status: JSX.Element;
    action: JSX.Element;

  }>> = useMemo(() => [
    { Header: 'STT', accessor: 'index', },
    { Header: 'Tên học sinh', accessor: 'userName' },
    { Header: 'Số điện thoại', accessor: 'userPhoneNumber' },
    { Header: 'Ngày tham gia', accessor: 'joinDate' },
    { Header: 'Ngày hết hạn', accessor: 'expireDate' },
    { Header: 'Truy cập gần nhất', accessor: 'lastUpdate' },
    { Header: 'Trạng thái', accessor: 'status' },
    { Header: 'Hành động', accessor: 'action' }
  ], []);

  const data = useMemo(() => {
    return memLists.map((uc, i) => ({
      index: currentPage * LOAD_LIMIT + i + 1,
      userName:
        <div>
          <div className="name-student" onClick={() => changView(uc.user)}>{uc.user?.name ?? ''}</div>
          <div className="email-student">{uc.user?.email ?? ''}</div>
        </div>,
      userPhoneNumber: uc.user?.phoneNumber ?? '',
      joinDate: uc.joinDate ? moment(uc.joinDate).format('DD-MM-YYYY') : '',
      expireDate: uc.expireDate ? moment(uc.expireDate).format("DD-MM-YYYY") : '',
      lastUpdate: uc.lastUpdate ? moment(uc.lastUpdate).format("DD-MM-YYYY") : '',
      status: <span style={uc.status == USER_COURSE_APPROVE ? { color: "#219653" } : { color: "red" }}>{MapUserCourseStatus[uc.status]}</span>,
      action: <>
        {
          uc.status === USER_COURSE_REJECT
          && <Button className="action-button" variant="contained" color="secondary" onClick={() => onAction({ userId: uc.userId, status: USER_COURSE_APPROVE })}>Khôi phục</Button>
        }
        {
          uc.status === USER_COURSE_WAITING
          && <Button className="action-button" variant="outlined" onClick={() => onAction({ userId: uc.userId, status: USER_COURSE_APPROVE })}>Duyệt</Button>
        }
        {
          uc.status === USER_COURSE_APPROVE
          && <Button className="action-button" variant="outlined" color="secondary" onClick={() => onAction({ userId: uc.userId, status: USER_COURSE_REJECT })}>Xoá</Button>
        }
      </>
    }))
  }, [memLists, currentPage])

  const {
    getTableProps,
    getTableBodyProps,
    rows,
    prepareRow,
    headers,
  } = useTable({
    columns,
    data
  });

  const TableCell = withStyles({
    root: {
      overflowWrap: "break-word"
    }
  })(MuiTableCell);

  return (
    <div style={{ backgroundColor: 'white' }}>
      <div id="members-view">
        <div className="container">
          <div className="wraper-content">
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

                <TableContainer>
                  <Table className="table-list-member-panel" {...getTableProps()}>
                    <TableHead className="table-list-member-panel-header">
                      <TableRow>
                        {headers.map((header, i) => (
                          <TableCell {...header.getHeaderProps()} className={`col_${i + 1} table-list-member-panel-header-cell`}>{header.Header}</TableCell>
                        ))}
                      </TableRow>
                    </TableHead>

                    <TableBody {...getTableBodyProps()} className="table-list-member-body">
                      {rows.map((row, i) => {
                        prepareRow(row);
                        return (
                          <TableRow {...row.getRowProps()}>
                            {row.cells.map((cell, i) => (
                              <TableCell {...cell.getCellProps()} className={`col_${i + 1} table-list-member-body-cell`}>
                                <div className="item-table">
                                  {cell.render('Cell')}
                                </div>
                              </TableCell>
                            ))}
                          </TableRow>
                        )
                      })}
                    </TableBody>

                    <TableFooter>
                      <TableRow>
                        <TablePagination
                          count={totalMems}
                          rowsPerPage={LOAD_LIMIT}
                          rowsPerPageOptions={[]}
                          page={currentPage}
                          onChangePage={(e, page) => {
                            onChangePage(page)
                          }}
                          labelDisplayedRows={({ count }) => {
                            const pageNum = Math.ceil((count || 1) / LOAD_LIMIT);
                            return `Total: ${pageNum} page${pageNum > 1 ? 's' : ''}`;
                          }}
                        />
                      </TableRow>
                    </TableFooter>
                  </Table>
                </TableContainer>

                {/* <Table
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
          /> */}
              </div>
              : <TimeOnline course={props.course} user={userStat} />}
            <div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MemberListView;
