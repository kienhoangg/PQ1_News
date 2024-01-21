import React from 'react';
import PropTypes from 'prop-types';
import styles from './AdminCollectionDetailText.module.scss';
import classNames from 'classnames/bind';
import { Col, Row } from 'antd';

const cx = classNames.bind(styles);

AdminCollectionDetailText.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
};

AdminCollectionDetailText.defaultProps = {};

function AdminCollectionDetailText(props) {
  const { label, value } = props;
  return (
    <Row gutter={16} className={cx('row-item')}>
      <Col span={8}>
        <div className={cx('row-item-label')}>{label}</div>
      </Col>
      <Col span={16}>
        <div>{value}</div>
      </Col>
    </Row>
  );
}

export default AdminCollectionDetailText;
