import {
  Box, Button,
  Card,
  CardActions,
  CardContent,
  Dialog,
  DialogActions, DialogContent, FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TextField,
  Autocomplete, Pagination
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select"
import dynamic from "next/dynamic";
import { useRouter } from 'next/router';
import { useSnackbar } from "notistack";
import React, { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Column, useTable } from "react-table";
import { CommentScopes, _Category } from '../../custom-types';
import { PAGE_COURSE_DETAIL, PAGE_TOPIC_DETAIL } from '../../custom-types/PageType';
import { useScrollToTop } from '../../hooks/scrollToTop';
import { AppState } from '../../redux/reducers';
import { formatFullDateTime } from '../../utils';
import { apiGetAllCourse } from '../../utils/apis/courseApi';
import { apiDiscussionsById, apiListDiscussionsByFilter, apiUpdateReply } from '../../utils/apis/notificationApi';
import { getBrowserSlug } from '../../utils/router';
import SanitizedDiv from '../SanitizedDiv';
import './style.scss';

const CommentPanel = dynamic(() => import('../CommentPanelNew'), { ssr: false });

const ReplyComment = (props: { category: _Category; childCategories: _Category[]; }) => {
  useScrollToTop();
  const router = useRouter();
  const { category, childCategories = [] } = props;
  const [dataNoti, setDataNoti] = useState([]);
  const currentUser = useSelector((state: AppState) => state.userReducer.currentUser)
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [discussions, setDiscussions] = useState(null);
  const [key, setKey] = useState(Math.random());
  const [keyTable, setKeyTable] = useState(Math.random());
  const [total, setTotal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dataSelect, setDataSelect] = useState<any[]>([]);
  const [current, setCurrent] = useState(1)
  const [dataFilter, setDataFilter] = useState<any>({});
  const [courseFilter, setCourseFilter] = useState(null);
  const [statusFilter, setStatusFilter] = useState(-1);
  const { enqueueSnackbar } = useSnackbar();

  const _columns: Array<Column<{
    index: JSX.Element;
    content: JSX.Element;
    createDate: string;
    replyStatus: JSX.Element;
    viewDetail: JSX.Element;
  }>> = useMemo(() => [
    { Header: 'STT', accessor: 'index' },
    { Header: 'Nội dung', accessor: 'content' },
    { Header: 'Ngày tạo', accessor: 'createDate' },
    { Header: 'Trạng thái', accessor: 'replyStatus' },
    { Header: 'Xem chi tiết', accessor: 'viewDetail' }
  ], []);

  const data = useMemo(() => {
    return dataNoti.map((row, index) => ({
      index: <span style={{ color: row.replyStatus === 1 ? '#008000' : (row.replyStatus === 2 ? 'rgb(255, 202, 0)' : 'unset') }}>{(current - 1) * 20 + index + 1}</span>,
      content: <>
        <div>
          <strong style={{ color: row.replyStatus === 1 ? '#008000' : (row.replyStatus === 2 ? 'rgb(255, 202, 0)' : 'unset') }}>{row.user?.name}</strong> đã bình luận trong {row.topicId ? `bài học ${row.topicName || row?.topic?.name}` : `khóa học ${row.courseName || row?.course?.name}`}
        </div>
        <div>
          <SanitizedDiv className="text-html" content={row.content} />
        </div>
        <div>
          <Button style={{ textTransform: "none" }} size="small" variant="outlined" onClick={() => handleReply(row)}>Trả lời</Button>
        </div>
      </>,
      createDate: `${formatFullDateTime(row.createDate)}`,
      replyStatus: <>
        <Select
          size="small"
          defaultValue={row.replyStatus}
          onChange={(e: SelectChangeEvent<number>) => handleUpdateReply(row._id, Number(e.target.value), index)}
          style={{
            width: 120,
            color: row.replyStatus === 1 ? '#008000' : (row.replyStatus === 2 ? 'rgb(255, 202, 0)' : 'unset')
          }}
        >
          <MenuItem value={0}>Chưa trả lời</MenuItem>
          <MenuItem value={1}>Đã trả lời</MenuItem>
          <MenuItem value={2}>Note</MenuItem>
        </Select>
      </>,
      viewDetail: <Button style={{ textTransform: "none" }} size="small" variant="outlined" onClick={() => handleRouter(row)}>Xem chi tiết</Button>
    }))
  }, [dataNoti, current]);

  const {
    getTableProps,
    getTableBodyProps,
    rows,
    prepareRow,
    headers,
  } = useTable({ columns: _columns, data });

  useEffect(() => {
    if (currentUser?._id) {
      const queryName = {
        target: currentUser?._id,
        offset: 0,
        limit: 20,
        replyStatus: 0
      }
      apiListDiscussionsByFilter({ offset: 0, limit: 20, replyStatus: 0 })
        .then((data) => {
          if (data?.data?.result) {
            setDataNoti([...data.data.result])
            setTotal(data.data.total)
            setLoading(false)
            setDataFilter(queryName)
          }
        });
      apiGetAllCourse()
        .then((data) => {
          setDataSelect(data?.data)
        })
    }
  }, [currentUser]);

  const handleRouter = (row: any) => {
    router.push({
      pathname: getBrowserSlug(row.topic?.slug || row.course?.slug, row.topic?.type ? PAGE_TOPIC_DETAIL : PAGE_COURSE_DETAIL, row.topic?._id || row.course?._id),
      query: {
        discussionsId: row.parentId || row._id,
        activeTab: '1'
      }
    });
  }

  const handleFilter = () => {
    setLoading(true);
    const queryFilter = {
      offset: 0, limit: 20,
      courseId: courseFilter?._id,
      replyStatus: statusFilter === -1 ? undefined : statusFilter
    }
    apiListDiscussionsByFilter(queryFilter)
      .then((data) => {
        if (data?.data?.result) {
          setDataNoti([...data.data.result])
          setTotal(data.data.total)
          setLoading(false)
          setCurrent(1)
          setKeyTable(Math.random());
          setDataFilter(queryFilter);
        }
      })
  }

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setKey(Math.random())
  };

  const handleReply = (row) => {
    apiDiscussionsById({ _id: row.parentId || row._id })
      .then((data) => {
        setDiscussions(data?.data)
        showModal();
      });
  };

  const onPageChange = (newPage: number, newPageSize?: number) => {
    const data = dataFilter
    data.offset = (newPage - 1) * 20
    apiListDiscussionsByFilter(data)
      .then((data) => {
        if (data?.data?.result) {
          setDataNoti([...data.data.result])
          setTotal(data.data.total)
          setLoading(false)
          setCurrent(newPage)
          setKeyTable(Math.random());
        }
      });
    // onPagination(newPage, newPageSize || 10);
    // setEditingKey('');
  };

  const handleUpdateReply = (id: string, replyStatus: number, index: number) => {
    apiUpdateReply({ discussionId: id, replyStatus })
      .then((data) => {
        if (data.data?.message === 'success') {
          const dataTemp = [...dataNoti]
          if (dataTemp?.[index]) {
            dataTemp[index].replyStatus = replyStatus
          }
          // console.log('dataTemp: ', dataTemp);

          setDataNoti([...dataTemp]);
          enqueueSnackbar('Cập nhật trạng thái thành công', { variant: "success" });
        } else {
          enqueueSnackbar('Cập nhật trạng thái thất bại', { variant: "error" })
        }
      })
  }

  return (
    <React.Fragment>
      <div className="container reply-comment">
        <Card style={{ margin: "20px 0" }} elevation={2}>
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  id="filter-course"
                  options={dataSelect}
                  getOptionLabel={(option) => option.name}
                  fullWidth
                  renderInput={(params) => <TextField {...params} label="Chọn khoá học" variant="outlined" fullWidth />}
                  size="small"
                  value={courseFilter}
                  onChange={(e, value) => {
                    setCourseFilter(value)
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl size="small" fullWidth variant="outlined">
                  <InputLabel id="filter-status">Chọn trạng thái</InputLabel>
                  <Select
                    size="small"
                    labelId="filter-status"
                    value={statusFilter}
                    label="Chọn trạng thái"
                    autoWidth
                    onChange={(e: SelectChangeEvent<number>) => {
                      setStatusFilter(Number(e.target.value));
                    }}
                  >
                    <MenuItem value={-1}>Tất cả</MenuItem>
                    <MenuItem value={0}>Chưa trả lời</MenuItem>
                    <MenuItem value={1}>Đã trả lời</MenuItem>
                    <MenuItem value={2}>Note</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
          <CardActions>
            <div style={{ marginLeft: "auto" }}>
              <Button variant="outlined" onClick={handleFilter}>
                Tìm kiếm
              </Button>
            </div>
          </CardActions>
        </Card>


        <TableContainer style={{ maxHeight: 700, margin: "20px 0" }}>
          <Table key={keyTable} {...getTableProps()} style={{ minWidth: "992px" }} stickyHeader>
            <TableHead>
              <TableRow>
                {headers.map((header, i) => (
                  <TableCell {...header.getHeaderProps()}>{header.Header}</TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody {...getTableBodyProps()}>
              {rows.map((row, i) => {
                prepareRow(row);
                return (
                  <TableRow {...row.getRowProps()}>
                    {row.cells.map((cell, i) => (
                      <TableCell {...cell.getCellProps()}>{cell.render('Cell')}</TableCell>
                    ))}
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <Box style={{ display: "flex", justifyContent: "flex-end", margin: "20px 0", paddingBottom: "20px" }}>
          <Pagination
            shape="rounded"
            count={Math.ceil((total || 1) / 20)}
            page={current}
            onChange={(e, page) => {
              onPageChange(page);
            }}
          />
        </Box>
      </div>
      <Dialog
        open={isModalVisible}
        onClose={handleCancel}
        key={key}
        fullWidth
        maxWidth="sm"
      >
        <DialogContent>
          <CommentPanel discussions={discussions} commentScope={CommentScopes.COURSE} />

        </DialogContent>
        <DialogActions>
          <Button
            key="back"
            onClick={handleCancel}
            style={{ textTransform: "none" }}
            size="small" variant="outlined"
          >
            Tắt
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default ReplyComment;