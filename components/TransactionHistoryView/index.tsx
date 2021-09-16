import { Col, Row } from 'antd';
import { ROUTER_TRANSACTION_HISTORY } from '../../utils/router';
import Breadcrumb from '../Breadcrumb';
import './style.scss';

const TransactionHistoryView = () => {
  return (<>
    <Breadcrumb items={[{ name: 'Lịch sử giao dịch', slug: ROUTER_TRANSACTION_HISTORY }]} />

    <div id="transaction-history" className="container">
      <Row gutter={[16, 16]}>
        <Col span={24} md={6}>
          <div className="panel order-list">
            <label className="title">
              Danh sách đơn hàng
            </label>
          </div>
        </Col>

        <Col span={24} md={18}>
          <div className="panel order-detail">
            Chi tiết 1 đơn
          </div>
        </Col>
      </Row>
    </div>
  </>);
}

export default TransactionHistoryView;