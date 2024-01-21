import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styles from '../../../news/NewsListPage/CollectionNewsDetail/CollectionNewsDetail.module.scss';
import classNames from 'classnames/bind';
import { Card, Col, Divider, Form, Modal, Row } from 'antd';
import datetimeHelper from 'helpers/datetimeHelper';
import imageHelper from 'helpers/imageHelper';
import axiosClient from 'apis/axiosClient';

const cx = classNames.bind(styles);

/**
 * Popup xem chi tiết văn bản
 * @author TDBA (26/10/2022)
 */
const PopupDocumentDetail = (props) => {
  const { Id, open, onCancel, confirmLoading } = props;
  const [newsDetail, setNewsDetail] = useState();

  useEffect(() => {
    getDetailNewsPost(Id);
  }, [Id]);

  const getDetailNewsPost = async (id) => {
    try {
      const res = await axiosClient.get('/documents/' + id);
      setNewsDetail(res);
    } catch (err) { }
  };

  return (
    <Modal
      confirmLoading={confirmLoading}
      open={true}
      title='Hiển thị thông tin'
      okButtonProps={{
        style: {
          display: 'none',
        },
      }}
      cancelText='Thoát'
      onCancel={onCancel}
      width={1300}
      centered
      onOk={() => { }}
    >
      <Row gutter={8}>
        <Col span={16}>
          <Row gutter={16} className={cx('row-item')}>
            <Col span={4}>
              <div className={cx('row-item-label')}>
                <span style={{ color: 'red' }}>* </span>Số ký hiệu
              </div>
            </Col>
            <Col span={20}>
              <div>{newsDetail?.Code}</div>
            </Col>
          </Row>
          <Row gutter={16} className={cx('row-item')}>
            <Col span={4}>
              <div className={cx('row-item-label')}>Trích yếu</div>
            </Col>
            <Col span={20}>
              <div>{newsDetail?.Name}</div>
            </Col>
          </Row>
          <Row gutter={16} className={cx('row-item')}>
            <Col span={4}>
              <div className={cx('row-item-label')}>Nội dung</div>
            </Col>
            <Col span={20}>
              <div
                dangerouslySetInnerHTML={{ __html: newsDetail?.Content }}
              ></div>
            </Col>
          </Row>
          <Row gutter={16} className={cx('row-item')}>
            <Col span={4}>
              <div className={cx('row-item-label')}>Loại văn bản</div>
            </Col>
            <Col span={20}>
              <div>{newsDetail?.DocumentType?.Title}</div>
            </Col>
          </Row>
          <Row gutter={16} className={cx('row-item')}>
            <Col span={4}>
              <div className={cx('row-item-label')}>Cơ quan ban hành</div>
            </Col>
            <Col span={20}>
              <div>{newsDetail?.DocumentDepartment?.Title}</div>
            </Col>
          </Row>
          <Row gutter={16} className={cx('row-item')}>
            <Col span={4}>
              <div className={cx('row-item-label')}>Lĩnh vực</div>
            </Col>
            <Col span={20}>
              <div>{newsDetail?.DocumentField?.Title}</div>
            </Col>
          </Row>
          <Row gutter={16} className={cx('row-item')}>
            <Col span={4}>
              <div className={cx('row-item-label')}>Người ký</div>
            </Col>
            <Col span={20}>
              <div>{newsDetail?.DocumentSignPerson?.Title}</div>
            </Col>
          </Row>
          <Row gutter={16} className={cx('row-item')}>
            <Col span={4}>
              <div className={cx('row-item-label')}>Ngày phát hành</div>
            </Col>
            <Col span={20}>
              <div>
                {datetimeHelper.formatDateToDateVN(newsDetail?.PublishedDate)}
              </div>
            </Col>
          </Row>
          <Row gutter={16} className={cx('row-item')}>
            <Col span={4}>
              <div className={cx('row-item-label')}>Tệp đính kèm</div>
            </Col>
            <Col span={20}>
              <a href={imageHelper.getLinkImageUrl(newsDetail?.FilePath)}>
                {imageHelper?.getNameFile(newsDetail?.FilePath)}
              </a>
            </Col>
          </Row>
          <Row gutter={16} className={cx('row-item')}>
            <Col span={4}>
              <div className={cx('row-item-label')}>Thông tin chung</div>
            </Col>
            <Col span={20}>
              {newsDetail?.IsDocumentSection === true ? 'Có' : 'Không'}
            </Col>
          </Row>
        </Col>
      </Row>
    </Modal>
  );
};

PopupDocumentDetail.propTypes = {};

export default PopupDocumentDetail;
