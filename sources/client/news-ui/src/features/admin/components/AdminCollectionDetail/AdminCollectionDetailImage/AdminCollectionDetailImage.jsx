import React from 'react';
import PropTypes from 'prop-types';
import styles from './AdminCollectionDetailImage.module.scss';
import classNames from 'classnames/bind';
import { Col, Image, Row } from 'antd';
import stringHelper from 'helpers/stringHelper';

const cx = classNames.bind(styles);

AdminCollectionDetailImage.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
};

AdminCollectionDetailImage.defaultProps = {};

function AdminCollectionDetailImage(props) {
  const { label, value } = props;
  return (
    <Row gutter={16} className={cx('row-item')}>
      <Col span={8}>
        <div className={cx('row-item-label')}>{label}</div>
      </Col>
      <Col span={16}>
        {stringHelper.isNullOrEmpty(value) && <Image height={50} src={value} />}
      </Col>
    </Row>
  );
}
export default AdminCollectionDetailImage;
