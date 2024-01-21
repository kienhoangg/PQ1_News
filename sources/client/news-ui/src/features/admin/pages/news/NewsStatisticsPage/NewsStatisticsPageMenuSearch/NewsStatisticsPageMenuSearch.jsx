import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import styles from './NewsStatisticsPageMenuSearch.module.scss';
import classNames from 'classnames/bind';
import { Button, Col, DatePicker, Row, Select } from 'antd';
import TreeSelect, { TreeNode } from 'rc-tree-select';
import commonFunc from 'common/commonFunc';
import { Option } from 'antd/lib/mentions';
import {
  AreaChartOutlined,
  CloudDownloadOutlined,
  FileAddFilled,
} from '@ant-design/icons';

const cx = classNames.bind(styles);

NewsStatisticsPageMenuSearch.propTypes = {};

NewsStatisticsPageMenuSearch.defaultProps = {};

function NewsStatisticsPageMenuSearch(props) {
  const dateStart = useRef(null);
  const dateEnd = useRef(null);

  return (
    <div className={cx('wrapper')}>
      <Row gutter={[8, 8]}>
        <Col span={6}>
          <Select
            showSearch
            placeholder='Tác giả'
            style={{ width: '100%' }}
            allowClear={true}
          >
            <Option value={'Đinh Văn Hùng'}>Đinh Văn Hùng</Option>
            <Option value={'Đinh Văn Hùng'}>Đinh Văn Hùng 2</Option>
            <Option value={'Đinh Văn Hùng'}>Đinh Văn Hùng 3</Option>
            <Option value={'Đinh Văn Hùng'}>Đinh Văn Hùng 4</Option>
            <Option value={'Đinh Văn Hùng'}>Đinh Văn Hùng</Option>
          </Select>
        </Col>
        <Col span={5}>
          <DatePicker
            placeholder='Từ ngày'
            style={{ width: '100%' }}
            ref={dateStart}
          />
        </Col>
        <Col span={5}>
          <DatePicker
            placeholder='Đến ngày'
            style={{ width: '100%' }}
            ref={dateEnd}
          />
        </Col>
        <Col span={6}>
          <Button
            type='primary'
            style={{ marginLeft: 16 }}
            icon={<AreaChartOutlined />}
          >
            Thống kê
          </Button>
        </Col>
        <Col span={24}>
          <Button type='primary' style={{}} icon={<CloudDownloadOutlined />}>
            Xuất nhuận bút
          </Button>
        </Col>
      </Row>
    </div>
  );
}

export default NewsStatisticsPageMenuSearch;
