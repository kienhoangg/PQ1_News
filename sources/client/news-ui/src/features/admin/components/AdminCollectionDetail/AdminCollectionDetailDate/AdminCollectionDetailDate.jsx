import React from 'react';
import PropTypes from 'prop-types';
import styles from './AdminCollectionDetailDate.module.scss';
import classNames from 'classnames/bind';
import { Col, Row } from 'antd';
import datetimeHelper from 'helpers/datetimeHelper';

const cx = classNames.bind(styles);

AdminCollectionDetailDate.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
};

AdminCollectionDetailDate.defaultProps = {};

function AdminCollectionDetailDate(props) {
  const { label, value } = props;

  return (
    <Row gutter={16} className={cx('row-item')}>
      <Col span={8}>
        <div className={cx('row-item-label')}>{label}</div>
      </Col>
      <Col span={16}>
        <div>{datetimeHelper.formatDateToDateVN(value)}</div>
      </Col>
    </Row>
  );
}

export default AdminCollectionDetailDate;
