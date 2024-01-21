import { Button, Divider, Form, Input, Modal, Row, Col } from 'antd';
import newsApi from 'apis/newsApi';
import classNames from 'classnames/bind';
import { Direction, NotificationType } from 'common/enum';
import { openNotification } from 'helpers/notification';
import { useEffect, useRef, useState } from 'react';
import styles from './NewsSourcePage.module.scss';
import NewsSourcePageSearch from './NewsSourcePageSearch/NewsSourcePageSearch';
import NewsSourceTableData from './NewsSourceTableData/NewsSourceTableData';
import { FileAddFilled } from '@ant-design/icons';
import { DEFAULT_COLUMN_ORDER_BY, TypeUpdate } from 'common/constant';
import Loading from 'components/Loading/Loading';
const { TextArea } = Input;
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const Mode = {
  Create: 1,
  Edit: 0,
};

const cx = classNames.bind(styles);

NewsSourcePage.propTypes = {};

NewsSourcePage.defaultProps = {};

function NewsSourcePage(props) {
  const [newsData, setNewsData] = useState({});
  const isFirstCall = useRef(true);
  const [objFilter, setObjFilter] = useState({
    currentPage: 1,
    pageSize: 10,
    direction: Direction.DESC,
    orderBy: DEFAULT_COLUMN_ORDER_BY,
    keyword: '',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const detail = useRef({});
  const [isShowDetail, setIsShowDetail] = useState(false);
  const idEdit = useRef();
  const mode = useRef();
  const [confirmLoading, setConfirmLoading] = useState(true);

  /**
   * Thay đổi bộ lọc thì gọi lại danh sách
   */
  useEffect(() => {
    // if (isFirstCall.current) {
    //   isFirstCall.current = false;
    //   return;
    // }
    fetchProductList();
  }, [objFilter]);

  /**
   * Gọi api lấy dữ liệu danh sách nguồi tin tức
   */
  const fetchProductList = async () => {
    try {
      setConfirmLoading(true);
      const response = await newsApi.getNewsSourceAll(objFilter);
      setNewsData({
        data: response?.PagedData?.Results ?? [],
        total: response?.PagedData?.RowCount ?? 0,
      });
    } catch (error) {
      console.log('Failed to fetch list: ', error);
    } finally {
      setConfirmLoading(false);
    }
  };

  /**
   * Sử lý thay đổi text search
   * @param {*} textSearch Từ cần tìm
   */
  const handleChangeTextSearch = (textSearch) => {
    setObjFilter({ ...objFilter, keyword: textSearch });
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

  const handleDeleteSourceNew = async (id) => {
    try {
      setConfirmLoading(true);
      await newsApi.deleteSourceNew(id);
      openNotification('Xóa nguồn tin thành công');
      fetchProductList();
    } catch (error) {
      openNotification('Xóa nguồn tin thất bại', '', NotificationType.ERROR);
    } finally {
      setConfirmLoading(false);
    }
  };

  const showModal = () => {
    mode.current = Mode.Create;
    form?.setFieldsValue({});
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    form.resetFields();
    setIsModalOpen(false);
  };

  /**
   * Submit form tạo nguồn tin tức
   * @param {*} values Đối tượng submit form
   */
  const onFinish = async (values) => {
    setIsModalOpen(false);
    if (mode.current === Mode.Create) {
      await insertSounceNews(values);
    } else {
      await updateSounceNews(values);
    }
    form.resetFields();
    fetchProductList();
  };

  const insertSounceNews = async (values) => {
    try {
      setConfirmLoading(true);
      await newsApi.insertSourceNew(values);
      openNotification('Tạo mới nguồn tin tức thành công');
    } catch (error) {
      openNotification('Tạo mới thất bại', '', NotificationType.ERROR);
    } finally {
      setConfirmLoading(false);
    }
  };

  const updateSounceNews = async (values) => {
    try {
      setConfirmLoading(true);
      await newsApi.updateSourceNew(idEdit.current, values);
      openNotification('Cập nhật thành công');
    } catch (error) {
      openNotification('Cập nhật thất bại', '', NotificationType.ERROR);
    } finally {
      setConfirmLoading(false);
    }
  };
  const handleUpdateStatusNew = async (values) => {
    try {
      setConfirmLoading(true);
      await newsApi.updateStatusSourceNew({
        Ids: [values.Id],
        Value: values.Status === 0 ? 1 : 0,
        Field: TypeUpdate.STATUS,
      });
      fetchProductList();
      openNotification('Cập nhật thành công');
    } catch (error) {
      openNotification('Cập nhật thất bại', '', NotificationType.ERROR);
    } finally {
      setConfirmLoading(false);
    }
  };

  async function handleShowDetail(Id) {
    const res = await getSourceNewById(Id);
    detail.current = res;
    setIsShowDetail(true);
  }

  async function getSourceNewById(id) {
    try {
      setConfirmLoading(true);
      const res = await newsApi.getSourceNewByID(id);
      return res;
    } catch (err) {
      openNotification(
        'Lấy chi tiết dữ liệu thất bại',
        '',
        NotificationType.ERROR
      );
      return null;
    } finally {
      setConfirmLoading(false);
    }
  }

  async function handleUpdate(id) {
    const res = await getSourceNewById(id);
    idEdit.current = id;
    mode.current = Mode.Edit;
    form?.setFieldsValue({
      title: res?.Title,
      description: res?.Description,
      order: res?.Order,
    });
    setIsModalOpen(true);
  }

  return (
    <div className={cx('wrapper')}>
      <Loading show={confirmLoading} />

      <Modal
        className={cx('modal-insert-source-news')}
        title='Thêm mới nguồn tin tức'
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Form {...layout} form={form} name='control-hooks' onFinish={onFinish}>
          <Form.Item
            name='title'
            label='Tiêu đề'
            rules={[{ required: true, message: 'Tiêu đề không được để trống' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name='order'
            label='Số thứ tự'
            rules={[
              { required: true, message: 'Số thứ tự không được để trống' },
            ]}
          >
            <Input type='number' min={0} />
          </Form.Item>

          <Form.Item name='description' label='Mô tả'>
            <TextArea />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button
              type='primary'
              htmlType={mode.current === Mode.Edit ? 'Cập nhật' : 'Tạo mới'}
            >
              {mode.current === Mode.Edit ? 'Cập nhật' : 'Tạo mới'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <div className={cx('top')}>
        <NewsSourcePageSearch setTextSearch={handleChangeTextSearch} />
        <div className={cx('btn-add-source-news')}>
          <Button type='primary' icon={<FileAddFilled />} onClick={showModal}>
            Thêm mới
          </Button>
        </div>
      </div>
      <Divider style={{ margin: '0' }} />
      <div className={cx('table-data')}>
        <NewsSourceTableData
          data={newsData}
          setPagination={handleChangePagination}
          deleteSourceNew={handleDeleteSourceNew}
          updateStatusNew={handleUpdateStatusNew}
          showDetail={handleShowDetail}
          updateData={handleUpdate}
        />
      </div>

      <Modal
        open={isShowDetail}
        title='Hiển thị thông tin'
        okButtonProps={{
          style: {
            display: 'none',
          },
        }}
        cancelText='Thoát'
        onCancel={() => {
          setIsShowDetail(false);
        }}
      >
        <Row gutter={8}>
          <Col span={16}>
            <Row gutter={16} className={cx('row-item')}>
              <Col span={8}>
                <div className={cx('row-item-label')}>Tiêu đề</div>
              </Col>
              <Col span={16}>
                <div>{detail.current?.Title}</div>
              </Col>
            </Row>

            <Row gutter={16} className={cx('row-item')}>
              <Col span={8}>
                <div className={cx('row-item-label')}>Số thứ tự</div>
              </Col>
              <Col span={16}>
                <div>{detail.current?.Order}</div>
              </Col>
            </Row>

            <Row gutter={16} className={cx('row-item')}>
              <Col span={8}>
                <div className={cx('row-item-label')}>Mô tả</div>
              </Col>
              <Col span={16}>
                <div>{detail.current?.Description}</div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Modal>
    </div>
  );
}

export default NewsSourcePage;
