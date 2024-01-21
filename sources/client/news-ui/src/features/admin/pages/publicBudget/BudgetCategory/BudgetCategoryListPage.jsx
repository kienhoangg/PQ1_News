import { FileAddFilled, UploadOutlined, FileOutlined } from '@ant-design/icons';
import {
  Button,
  Divider,
  Form,
  TreeSelect,
  Modal,
  Input,
  Row,
  Col,
  Upload,
} from 'antd';
import { TreeNode } from 'antd/lib/tree-select';
import budgetPublicAPI from 'apis/budgetPublicApi';
import classNames from 'classnames/bind';
import commonFunc from 'common/commonFunc';
import { Direction, NotificationType } from 'common/enum';
import convertHelper from 'helpers/convertHelper';
import { openNotification } from 'helpers/notification';
import { useEffect, useRef, useState } from 'react';
import styles from './BudgetCategoryListPage.module.scss';
import BudgetCategoryPageSearch from './BudgetCategoryPageSearch/BudgetCategoryPageSearch';
import BudgetCategoryTableData from './BudgetCategoryTableData/BudgetCategoryTableData';
import { Select } from 'antd';
import { Option } from 'antd/lib/mentions';
import { TypeUpdate, DEFAULT_COLUMN_ORDER_BY } from 'common/constant';
import imageHelper from 'helpers/imageHelper';
import { envDomainBackend } from 'common/enviroments';
import Loading from 'components/Loading/Loading';
const { TextArea } = Input;

const cx = classNames.bind(styles);

BudgetCategoryListPage.propTypes = {};
const LIMIT_UP_LOAD_FILE = 2_097_152; //2mb
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const Mode = {
  Create: 1,
  Edit: 0,
};

function BudgetCategoryListPage(props) {
  const [newsData, setNewsData] = useState({
    data: [],
    total: 0,
  });
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
    if (isFirstCall.current) {
      isFirstCall.current = false;
      // return;
    }
    fetchCategoryList();
  }, [objFilter]);

  /**
   * Gọi api lấy dữ liệu danh sách loại văn bản tin
   */
  const fetchCategoryList = async () => {
    try {
      setConfirmLoading(true);
      const response = await budgetPublicAPI.getBudgetCategoryAll(objFilter);

      setNewsData({
        data: response?.PagedData?.Results ?? [],
        total: response?.PagedData?.RowCount ?? 0,
      });
    } catch (error) {
      openNotification('Lấy loại văn bản thất bại', '', NotificationType.ERROR);
    } finally {
      setConfirmLoading(false);
    }
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

  const handleDeleteCategoryNew = async (id) => {
    try {
      setConfirmLoading(true);
      await budgetPublicAPI.deleteCategory(id);
      openNotification('Xóa danh mục công khai thành công');
      fetchCategoryList();
    } catch (error) {
      openNotification(
        'Xóa danh mục công khai thất bại',
        '',
        NotificationType.ERROR
      );
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleUpdateStatusNew = async (values) => {
    try {
      setConfirmLoading(true);
      await budgetPublicAPI.updateStatusCategory({
        Ids: [values.Id],
        Value: values.Status === 0 ? 1 : 0,
        Field: TypeUpdate.STATUS,
      });
      fetchCategoryList();
      openNotification('Cập nhật thành công');
    } catch (error) {
      openNotification('Cập nhật thất bại', '', NotificationType.ERROR);
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

  const onCancel = () => {
    setIsModalOpen(false);
  };
  const onCreate = async (formData) => {
    try {
      setConfirmLoading(true);
      await budgetPublicAPI.insertCategory(formData);
      openNotification('Tạo mới nội dung công khai thành công');
    } catch (error) {
      openNotification(
        'Tạo mới nội dung công khai thất bại',
        '',
        NotificationType.ERROR
      );
    } finally {
      setConfirmLoading(false);
    }
  };

  const showModal = async () => {
    mode.current = Mode.Create;
    form?.setFieldsValue({});
    setIsModalOpen(true);
  };

  /**
   * Submit form tạo nguồn tin tức
   * @param {*} values Đối tượng submit form
   */
  const onFinish = async (values) => {
    const { Title, Order, Description } = values;
    let bodyData = {
      Title,
      Order,
      Description,
    };

    setIsModalOpen(false);
    form.resetFields();
    if (mode.current === Mode.Create) {
      await onCreate(bodyData);
    } else {
      await updateSounceNews(bodyData);
    }
    fetchCategoryList();
  };

  const updateSounceNews = async (values) => {
    try {
      setConfirmLoading(true);
      await budgetPublicAPI.updateCategoryByID(idEdit.current, values);
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
      const res = await budgetPublicAPI.getCategoryByID(id);
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
      Title: res?.Title,
      Description: res?.Description,
      Order: res?.Order,
    });
    setIsModalOpen(true);
  }

  return (
    <div className={cx('wrapper')}>
      <Loading show={confirmLoading} />
      <Modal
        open={isModalOpen}
        title={
          mode.current === Mode.Edit
            ? 'Cập nhật danh mục công khai'
            : 'Tạo mới danh mục công khai'
        }
        okText='Thêm mới'
        cancelText='Thoát'
        onCancel={onCancel}
        footer={null}
      >
        <Form form={form} {...layout} name='control-hooks' onFinish={onFinish}>
          <Form.Item
            label='Tiêu đề'
            name='Title'
            rules={[
              {
                required: true,
                message: 'Tiêu đề không được để trống',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item name='Order' label='Số thứ tự'>
            <Input type='number' min={0} />
          </Form.Item>

          <Form.Item name='Description' label='Mô tả'>
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
        <BudgetCategoryPageSearch setTextSearch={handleChangeTextSearch} />
        <div>
          <Button type='primary' icon={<FileAddFilled />} onClick={showModal}>
            Tạo mới
          </Button>
        </div>
      </div>
      <Divider style={{ marginBottom: 16 }} />
      <div className={cx('table-data')}>
        <BudgetCategoryTableData
          data={newsData}
          setPagination={handleChangePagination}
          deleteCategoryNew={handleDeleteCategoryNew}
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

export default BudgetCategoryListPage;
