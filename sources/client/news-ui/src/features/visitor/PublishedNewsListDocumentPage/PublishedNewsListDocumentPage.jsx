import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styles from './PublishedNewsListDocumentPage.module.scss';
import classNames from 'classnames/bind';
import { Table } from 'antd';
import { commonRenderTable } from 'common/commonRender';
import publishedDocumentApi from 'apis/published/publishedDocumentApi';

const cx = classNames.bind(styles);

PublishedNewsListDocumentPage.propTypes = {};

PublishedNewsListDocumentPage.defaultProps = {};

const columns = [
  {
    key: 'title',
    dataIndex: 'title',
    title: 'Tiêu đề',
    render: (_, { Id, title }) => (
      <div
      // style={{ cursor: 'pointer' }}
      // onClick={() => {
      //     handleOnClickTitle({ Id, Title });
      // }}
      >
        {title}
      </div>
    ),
    sorter: (a, b) => a.title - b.title,
  },
  {
    key: 'description',
    dataIndex: 'description',
    title: 'Trích yếu',
  },
  {
    title: 'Thông tin',
    dataIndex: 'Info',
    key: 'info',
    width: 200,
    sorter: (a, b) => a.Status - b.Status,
  },
];

function PublishedNewsListDocumentPage(props) {
  const [data, setData] = useState({});

  /**
   * Khởi tạo dữ liệu
   */
  useEffect(() => {
    const fetchList = async () => {
      try {
        const params = {
          _page: 1,
          _limit: 10,
        };
        const response = await publishedDocumentApi.getData(params);

        setData(response);
      } catch (error) {
        console.log('Failed to fetch list: ', error);
      }
    };
    fetchList();
  }, []);

  return (
    <div className={cx('wrapper')}>
      <div>
        <Table
          columns={columns}
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: [10, 20, 30],
            showTotal: () =>
              commonRenderTable.showTableTotalPagination(data?.total ?? 0),
          }}
          dataSource={data?.data ?? []}
          size='small'
        />
      </div>
    </div>
  );
}

export default PublishedNewsListDocumentPage;
