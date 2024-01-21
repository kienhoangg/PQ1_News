import React from 'react';
import PropTypes from 'prop-types';
import styles from './AdminCollectionDetailDateTime.module.scss';
import classNames from 'classnames/bind';
import { Col, Row } from 'antd';
import datetimeHelper from 'helpers/datetimeHelper';

const cx = classNames.bind(styles);

AdminCollectionDetailDateTime.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
};

AdminCollectionDetailDateTime.defaultProps = {};

function AdminCollectionDetailDateTime(props) {
  const { label, value } = props;

  return (
    <Row gutter={16} className={cx('row-item')}>
      <Col span={8}>
        <div className={cx('row-item-label')}>{label}</div>
      </Col>
      <Col span={16}>
        <div>{datetimeHelper.formatDatetimeToDateVN(value)}</div>
      </Col>
    </Row>
  );
}

export default AdminCollectionDetailDateTime;
