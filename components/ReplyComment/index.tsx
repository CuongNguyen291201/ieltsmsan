import { Button, Col, Form, message, Modal, Row, Select, Table } from 'antd';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { CommentScopes, _Category } from '../../custom-types';
import { PAGE_COURSE_DETAIL, PAGE_TOPIC_DETAIL } from '../../custom-types/PageType';
import { useScrollToTop } from '../../hooks/scrollToTop';
import { AppState } from '../../redux/reducers';
import { formatFullDateTime } from '../../utils';
import { apiGetAllCourse } from '../../utils/apis/courseApi';
import { apiDiscussionsById, apiListDiscussionsByFilter, apiUpdateReply } from '../../utils/apis/notificationApi';
import { getBrowserSlug } from '../../utils/router';
import CommentPanel from '../CommentPanel';
import SanitizedDiv from '../SanitizedDiv';
import './style.scss';

const { Option } = Select;

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
  const [dataSelect, setDataSelect] = useState(null);
  const [current, setCurrent] = useState(1)
  const [dataFilter, setDataFilter] = useState<any>({})

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

  // function onChange(value) {
  //   console.log(`selected ${value}`);
  // }

  // function onBlur() {
  //   console.log('blur');
  // }

  // function onFocus() {
  //   console.log('focus');
  // }

  // function onSearch(val) {
  //   console.log('search:', val);
  // }

  const handleRouter = (row) => {
    router.push({
      pathname: getBrowserSlug(row.topic?.slug || row.course?.slug, row.topic?.type ? PAGE_TOPIC_DETAIL : PAGE_COURSE_DETAIL, row.topic?._id || row.course?._id),
      query: {
        discussionsId: row.parentId || row._id,
        activeTab: '1'
      }
    });
  }

  const columns = [
    {
      title: 'STT',
      dataIndex: null,
      width: '5%',
      // fixed: true,
      render: (text, row, index) => <span style={{ color: row.replyStatus === 1 ? '#008000' : (row.replyStatus === 2 ? 'rgb(255, 202, 0)' : 'unset') }}>{index + 1}</span>,
    },
    {
      title: 'Nội dung',
      name: 'content',
      dataIndex: 'content',
      width: '46%',
      render: (text, row, index) => (
        <React.Fragment>
          <div>
            <strong style={{ color: row.replyStatus === 1 ? '#008000' : (row.replyStatus === 2 ? 'rgb(255, 202, 0)' : 'unset') }}>{row.user?.name}</strong> đã bình luận trong {row.topicId ? `bài học ${row.topicName || row?.topic?.name}` : `khóa học ${row.courseName || row?.course?.name}`}
          </div>
          <div>
            <SanitizedDiv className="text-html" content={row.content} />
          </div>
          <div>
            <Button style={{ borderRadius: '4px' }} onClick={() => handleReply(row)}>Trả lời</Button>
          </div>
        </React.Fragment>
      ),
    },
    {
      title: 'Ngày tạo',
      name: 'createDate',
      dataIndex: 'createDate',
      width: '15%',
      render: text => (
        <span>{formatFullDateTime(text)}</span>
      )
    },
    {
      title: 'Trạng thái',
      name: 'replyStatus',
      width: '19%',
      dataIndex: 'replyStatus',
      render: (text, row, index) => (
        <React.Fragment>
          <Select
            style={{
              width: 120,
              color: row.replyStatus === 1 ? '#008000' : (row.replyStatus === 2 ? 'rgb(255, 202, 0)' : 'unset')
            }}
            defaultValue={text}
            onChange={(value) => handleUpdateReply(row._id, value, index)}
          // onFocus={onFocus}
          // onBlur={onBlur}
          // onSearch={onSearch}
          >
            <Option value={0}>Chưa trả lời</Option>
            <Option value={1}>Đã trả lời</Option>
            <Option value={2}>Note</Option>
          </Select>
        </React.Fragment>
      )
    },
    {
      title: 'Xem chi tiết',
      dataIndex: null,
      width: '15%',
      render: (text, row) => (
        <Button style={{ borderRadius: '4px' }} onClick={() => handleRouter(row)}>Xem chi tiết</Button>
      )
      // render: (text, record) => (
      //   <Space size="middle">
      //     <a>Invite {record.name}</a>
      //     <a>Delete</a>
      //   </Space>
      // ),
    },
  ];

  const layout = {
    labelCol: {
      sm: { span: 7 },
      xs: { span: 7 },
      md: { span: 7 },
      xl: { span: 7 },
    },
    wrapperCol: {
      xs: { span: 17 },
      sm: { span: 17 },
      md: { span: 17 },
      xl: { span: 17 },
    },
  };
  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  };

  const onFinish = (values: any) => {
    setLoading(true)
    const queryName = {
      target: currentUser?._id,
      offset: 0,
      limit: 20,
      courseId: values.courseId,
      replyStatus: values.replyStatus
    }
    if (values.courseId === '0') {
      delete queryName.courseId;
    }
    if (values.replyStatus === -1) {
      delete queryName.replyStatus;
    }
    apiListDiscussionsByFilter(queryName)
      .then((data) => {
        if (data?.data?.result) {
          setDataNoti([...data.data.result])
          setTotal(data.data.total)
          setLoading(false)
          setCurrent(1)
          setKeyTable(Math.random())
          setDataFilter(queryName)
        }
      });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

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
          setKeyTable(Math.random())
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

          setDataNoti([...dataTemp])
          message.success('Cập nhật trạng thái thành công');
        } else {
          message.error('Cập nhật trạng thái thất bại');
        }
      })
  }

  // console.log('dataSelect: ', dataSelect);

  return (
    <React.Fragment>
      <div className="container reply-comment">
        <Form
          initialValues={{
            courseId: '0',
            replyStatus: 0
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          style={{ marginTop: '20px' }}
        >
          <Row gutter={{ md: 0, lg: 8, xl: 32 }}>
            <Col xl={10} md={12} xs={24}>
              <Form.Item
                {...layout}
                labelAlign='left'
                label="Chọn khóa học"
                name="courseId"
              >
                <Select
                  showSearch
                  optionFilterProp="children"
                // onChange={onChange}
                // onFocus={onFocus}
                // onBlur={onBlur}
                // onSearch={onSearch}
                >
                  <Option value="0">Tất cả</Option>
                  {dataSelect?.map((item) => (
                    <Option key={item._id} value={item._id}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xl={10} md={12} xs={24}>
              <Form.Item
                {...layout}
                labelAlign='left'
                label="Chọn trạng thái"
                name="replyStatus"
              >
                <Select
                // onChange={onChange}
                // onFocus={onFocus}
                // onBlur={onBlur}
                // onSearch={onSearch}
                >
                  <Option value={-1}>Tất cả</Option>
                  <Option value={0}>Chưa trả lời</Option>
                  <Option value={1}>Đã trả lời</Option>
                  <Option value={2}>Note</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xl={4} md={12} xs={24}>
              <Form.Item>
                <Button
                  htmlType="submit"
                  style={{ borderRadius: '4px' }}
                >
                  Tìm kiếm
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <Table
          columns={columns}
          key={keyTable}
          dataSource={dataNoti}
          pagination={{
            onChange: onPageChange,
            pageSize: 20,
            current,
            total,
            position: ['bottomRight'],
          }}
          loading={loading}
          scroll={{ x: '100vh', y: '65vh' }}
        />
      </div>
      <Modal
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        key={key}
        width={700}
        bodyStyle={{ overflow: "auto", maxHeight: '500px' }}
        footer={[
          <Button
            key="back"
            onClick={handleCancel}
            style={{ borderRadius: '4px' }}
          >
            Tắt
          </Button>,
        ]}
      >
        <CommentPanel discussions={discussions} commentScope={CommentScopes.COURSE} />
      </Modal>
    </React.Fragment>
  );
};

export default ReplyComment;