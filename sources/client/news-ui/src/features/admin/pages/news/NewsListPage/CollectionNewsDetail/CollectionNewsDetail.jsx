import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styles from './CollectionNewsDetail.module.scss';
import classNames from 'classnames/bind';
import { Card, Col, Divider, Form, Modal, Row } from 'antd';
import datetimeHelper from 'helpers/datetimeHelper';
import imageHelper from 'helpers/imageHelper';
import axiosClient from 'apis/axiosClient';

const cx = classNames.bind(styles);

CollectionNewsDetail.propTypes = {
  data: PropTypes.object,
};

CollectionNewsDetail.defaultProps = {};

function CollectionNewsDetail(props) {
  const { open, onCancel, confirmLoading, dataDetail } = props;

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
      centered
      onOk={() => {}}
    >
      <Row gutter={8}>
        <Col span={16}>
          <Row gutter={16} className={cx('row-item')}>
            <Col span={4}>
              <div className={cx('row-item-label')}>Tiêu đề</div>
            </Col>
            <Col span={20}>
              <div>{dataDetail?.Title}</div>
            </Col>
          </Row>
          <Row gutter={16} className={cx('row-item')}>
            <Col span={4}>
              <div className={cx('row-item-label')}>Ảnh đại diện</div>
            </Col>
            <Col span={20}>
              <div style={{ width: 150, height: 200 }}>
                {
                  <img
                    alt=''
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                    src={imageHelper.getLinkImageUrl(dataDetail?.Avatar)}
                  />
                }
              </div>
            </Col>
          </Row>
          <Row gutter={16} className={cx('row-item')}>
            <Col span={4}>
              <div className={cx('row-item-label')}>Tiêu đề ảnh</div>
            </Col>
            <Col span={20}>
              <div>{dataDetail?.AvatarTitle}</div>
            </Col>
          </Row>
          <Row gutter={16} className={cx('row-item')}>
            <Col span={4}>
              <div className={cx('row-item-label')}>Mô tả</div>
            </Col>
            <Col span={20}>
              <div>{dataDetail?.Description}</div>
            </Col>
          </Row>
          <Row gutter={16} className={cx('row-item')}>
            <Col span={4}>
              <div className={cx('row-item-label')}>Nội dung</div>
            </Col>
            <Col span={20}>
              <div
                dangerouslySetInnerHTML={{ __html: dataDetail?.Content }}
              ></div>
            </Col>
          </Row>

          <Row gutter={16} className={cx('row-item')}>
            <Col span={4}>
              <div className={cx('row-item-label')}>Danh mục</div>
            </Col>
            <Col span={20}>
              <div>{dataDetail?.CategoryNews?.CategoryNewsName}</div>
            </Col>
          </Row>

          <Row gutter={16} className={cx('row-item')}>
            <Col span={4}>
              <div className={cx('row-item-label')}>Lĩnh vực</div>
            </Col>
            <Col span={20}>
              <div>{dataDetail?.FieldNews?.Title}</div>
            </Col>
          </Row>

          <Row gutter={16} className={cx('row-item')}>
            <Col span={4}>
              <div className={cx('row-item-label')}>Nguồn tin</div>
            </Col>
            <Col span={20}>
              <div>{dataDetail?.SourceNews?.Title}</div>
            </Col>
          </Row>
          <Row gutter={16} className={cx('row-item')}>
            <Col span={4}>
              <div className={cx('row-item-label')}>Tác giả</div>
            </Col>
            <Col span={20}>
              <div>{dataDetail?.Collaborator?.Name}</div>
            </Col>
          </Row>
          <Row gutter={16} className={cx('row-item')}>
            <Col span={4}>
              <div className={cx('row-item-label')}>Tin nổi bật</div>
            </Col>
            <Col span={20}>
              <div>{dataDetail?.IsDocumentNews ? 'Có' : 'Không'}</div>
            </Col>
          </Row>
          {/* <Row gutter={16} className={cx('row-item')}>
            <Col span={4}>
              <div className={cx('row-item-label')}>Tin nổi bật</div>
            </Col>
            <Col span={20}>
              <div>{dataDetail?.IsHotNews ? 'Có' : 'Không'}</div>
            </Col>
          </Row>

          <Row gutter={16} className={cx('row-item')}>
            <Col span={4}>
              <div className={cx('row-item-label')}>Tin video</div>
            </Col>
            <Col span={20}>
              <div>{dataDetail?.IsVideoNews ? 'Có' : 'Không'}</div>
            </Col>
          </Row>

          <Row gutter={16} className={cx('row-item')}>
            <Col span={4}>
              <div className={cx('row-item-label')}>Hiển thị tiêu đề</div>
            </Col>
            <Col span={20}>
              <div>{dataDetail?.IsShowTitle ? 'Có' : 'Không'}</div>
            </Col>
          </Row>

          <Row gutter={16} className={cx('row-item')}>
            <Col span={4}>
              <div className={cx('row-item-label')}>Bình luận</div>
            </Col>
            <Col span={20}>
              <div>{dataDetail?.IsShowComment ? 'Có' : 'Không'}</div>
            </Col>
          </Row> */}
          <Row gutter={16} className={cx('row-item')}>
            <Col span={4}>
              <div className={cx('row-item-label')}>Ngày sửa</div>
            </Col>
            <Col span={20}>
              <div>
                {datetimeHelper.formatDatetimeToDateVN(
                  dataDetail?.LastModifiedDate
                )}
              </div>
            </Col>
          </Row>
          <Row gutter={16} className={cx('row-item')}>
            <Col span={4}>
              <div className={cx('row-item-label')}>Ngày xuất bản</div>
            </Col>
            <Col span={20}>
              <div>
                {datetimeHelper.formatDatetimeToDateVN(
                  dataDetail?.PublishedDate
                )}
              </div>
            </Col>
          </Row>
          <Row gutter={16} className={cx('row-item')}>
            <Col span={4}>
              <div className={cx('row-item-label')}>Tệp đính kèm</div>
            </Col>
            <Col span={20}>
              <a href={imageHelper.getLinkImageUrl(dataDetail?.FilePath)}>
                {imageHelper?.getNameFile(dataDetail?.FilePath)}
              </a>
            </Col>
          </Row>
        </Col>
      </Row>
    </Modal>
  );
}

export default CollectionNewsDetail;
