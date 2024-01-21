import classNames from 'classnames/bind';
import styles from './NewsCommentPage.module.scss';

import { Divider, Form, Modal, Button } from 'antd';
import newsApi from 'apis/newsApi';
import { useEffect, useState } from 'react';
import NewsCommentPageSearch from './NewsCommentPageSearch/NewsCommentPageSearch';
import NewsCommentTableData from './NewsCommentTableData/NewsCommentTableData';
import { Direction, NotificationType } from 'common/enum';
import axiosClient from 'apis/axiosClient';
import { TypeUpdate } from 'common/constant';
import { openNotification } from 'helpers/notification';
import moment from 'moment';
import datetimeHelper from 'helpers/datetimeHelper';
import Loading from 'components/Loading/Loading';

const cx = classNames.bind(styles);

NewsCommentPage.propTypes = {};

NewsCommentPage.defaultProps = {};

function NewsCommentPage(props) {
  const [objFilter, setObjFilter] = useState({
    currentPage: 1,
    pageSize: 10,
    direction: Direction.DESC,
    orderBy: 'CreatedDate',
    keyword: '',
  });
  const [newsData, setNewsData] = useState({
    data: [],
    total: 0,
  });
  const [confirmLoading, setConfirmLoading] = useState(true);

  useEffect(() => {
    getCategoryNews();
  }, []);

  useEffect(() => {
    fetchProductList();
  }, [objFilter]);

  const fetchProductList = async () => {
    try {
      setConfirmLoading(true);
      const response = await axiosClient.post('/comments/filter', objFilter);
      setNewsData({
        data: response?.PagedData?.Results,
        total: response?.PagedData?.RowCount,
      });
    } catch (error) {
      console.log('Failed to fetch list: ', error);
    } finally {
      setConfirmLoading(false);
    }
  };

  const [listCategoryNews, setListCategoryNews] = useState([]);

  const getCategoryNews = async () => {
    try {
      const responseCategoryNews = await newsApi.getNewsCategoryAll({
        pageSize: 9999,
        currentPage: 1,
        direction: -1,
        orderBy: 'CreatedDate',
      });
      setListCategoryNews(responseCategoryNews?.PagedData?.Results);
    } catch (err) {}
  };

  /**
   * Sử lý thay đổi text search
   * @param {*} textSearch Từ cần tìm
   */
  const handleChangeTextSearch = (textSearch, categoryNews) => {
    const _newsFilter = {
      ...objFilter,
      keyword: textSearch,
      categoryNewsId: categoryNews,
    };

    if (!categoryNews) delete _newsFilter?.categoryNewsId;

    setObjFilter(_newsFilter);
  };

  /**
   * Thay đổi phân trang
   */
  const handleChangePagination = (
    currentPage,
    pageSize,
    orderBy,
    direction
  ) => {
    setObjFilter({ ...objFilter, currentPage, pageSize, orderBy, direction });
  };

  const handleUpdateStatusNew = async (values) => {
    try {
      setConfirmLoading(true);
      await axiosClient.put('/comments', {
        ids: [values.Id],
        value: values.Status === 0,
        field: TypeUpdate.STATUS,
      });
      fetchProductList();
      openNotification('Cập nhật thành công');
    } catch (error) {
      openNotification('Cập nhật thất bại', '', NotificationType.ERROR);
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleDeleteCategoryNew = async (res) => {
    try {
      setConfirmLoading(true);
      await axiosClient.delete('/comments/' + res?.Id);
      openNotification('Xóa bình luận thành công');
      fetchProductList();
    } catch (error) {
      openNotification('Xóa bình luận thất bại', '', NotificationType.ERROR);
    } finally {
      setConfirmLoading(false);
    }
  };

  const [isModalOpen, setIsModalOpen] = useState({
    comment: null,
    show: false,
  });

  const [form] = Form.useForm();
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  return (
    <div className={cx('wrapper')}>
      <Loading show={confirmLoading} />

      <Modal
        open={isModalOpen?.show}
        title={'Hiển thị thông tin'}
        okText={false}
        okButtonProps={{
          hidden: true,
        }}
        cancelText='Thoát'
        onCancel={() => {
          setIsModalOpen({
            comment: null,
            show: false,
          });
        }}
      >
        <Form form={form} {...layout} name='control-hooks'>
          <Form.Item label='Thuộc tin'>
            <div>{isModalOpen?.comment?.NewsPost?.Title}</div>
          </Form.Item>

          <Form.Item label='Người gửi'>
            <div>{isModalOpen?.comment?.Username}</div>
          </Form.Item>

          <Form.Item label='Nội dung'>
            <div>{isModalOpen?.comment?.Content}</div>
          </Form.Item>

          <Form.Item label='Ngày gửi'>
            <div>
              {datetimeHelper.formatDateToDateVN(
                isModalOpen?.comment?.CreatedDateRaw
              )}
            </div>
          </Form.Item>
        </Form>
      </Modal>
      <div className={cx('top')}>
        <NewsCommentPageSearch
          setTextSearch={handleChangeTextSearch}
          listCategoryNews={listCategoryNews}
        />
      </div>
      <Divider style={{ margin: '0' }} />
      <div className={cx('table-data')}>
        <NewsCommentTableData
          data={newsData}
          setPagination={handleChangePagination}
          updateStatusNew={handleUpdateStatusNew}
          deleteCategoryNew={handleDeleteCategoryNew}
          onClickRow={(item) => {
            setIsModalOpen({
              comment: item,
              show: true,
            });
          }}
        />
      </div>
    </div>
  );
}

export default NewsCommentPage;
