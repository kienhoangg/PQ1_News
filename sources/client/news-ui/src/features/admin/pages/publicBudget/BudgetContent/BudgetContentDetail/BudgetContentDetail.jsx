import { FileOutlined } from '@ant-design/icons';
import { Col, Modal, Row } from 'antd';
import classNames from 'classnames/bind';
import imageHelper from 'helpers/imageHelper';
import styles from './BudgetContentDetail.module.scss';
const cx = classNames.bind(styles);

BudgetContentDetail.propTypes = {};

function BudgetContentDetail(props) {
  const { open, onCancel, confirmLoading } = props;
  const { data } = props;

  return (
    <Modal
      confirmLoading={confirmLoading}
      open={open}
      title='Hiển thị thông tin'
      okButtonProps={{
        style: {
          display: 'none',
        },
      }}
      cancelText='Thoát'
      onCancel={onCancel}
      width={1300}
      onOk={() => {}}
    >
      <Row gutter={8}>
        <Col span={16}>
          <Row gutter={16} className={cx('row-item')}>
            <Col span={4}>
              <div className={cx('row-item-label')}>Tiêu đề</div>
            </Col>
            <Col span={20}>
              <div>{data?.Title}</div>
            </Col>
          </Row>
          <Row gutter={16} className={cx('row-item')}>
            <Col span={4}>
              <div className={cx('row-item-label')}>Mô tả</div>
            </Col>
            <Col span={20}>
              <div>{data?.Description}</div>
            </Col>
          </Row>
          <Row gutter={16} className={cx('row-item')}>
            <Col span={4}>
              <div className={cx('row-item-label')}>Nội dung</div>
            </Col>
            <Col span={20}>
              <div dangerouslySetInnerHTML={{ __html: data?.Content }}></div>
            </Col>
          </Row>
          <Row gutter={16} className={cx('row-item')}>
            <Col span={4}>
              <div className={cx('row-item-label')}>Danh mục</div>
            </Col>
            <Col span={20}>
              <div>{data?.PublicInformationCategory?.Title}</div>
            </Col>
          </Row>

          <Row gutter={16} className={cx('row-item')}>
            <Col span={4}>
              <div className={cx('row-item-label')}>Tệp dính kèm</div>
            </Col>
            <Col span={20}>
              {Array.isArray(data?.FileAttachment?.split(';;')) &&
                data?.FileAttachment?.split(';;').map((item, index) => {
                  return (
                    <div
                      key={index}
                      className={cx('file-attachment')}
                      onClick={() =>
                        window.open(imageHelper.getLinkImageUrl(item))
                      }
                    >
                      <FileOutlined /> {imageHelper.getNameFile(item)}
                    </div>
                  );
                })}
            </Col>
          </Row>
        </Col>
      </Row>
    </Modal>
  );
}

export default BudgetContentDetail;
