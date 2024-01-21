import { Divider, Form, Button, Input, Modal, Select } from 'antd';
import newsApi from 'apis/newsApi';
import { useEffect, useRef, useState } from 'react';
import NewsCategoryPageSearch from './NewsCategoryPageSearch/NewsCategoryPageSearch';
import NewsCategoryTableData from './NewsCategoryTableData/NewsCategoryTableData';
import styles from './NewsCategoryPage.module.scss';
import classNames from 'classnames/bind';
import AdminCollectionDetail from 'features/admin/components/AdminCollectionDetail/AdminCollectionDetail';
import { Direction, NotificationType } from 'common/enum';
import { openNotification } from 'helpers/notification';
import { Option } from 'antd/lib/mentions';
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

NewsCategoryPage.propTypes = {};

NewsCategoryPage.defaultProps = {};

function NewsCategoryPage(props) {
  const [newsData, setNewsData] = useState({
    data: [],
    total: 0,
  });
  const [dataRoot, setDataRoot] = useState([]);
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

  const [openCollectionDetail, setOpenCollectionDetail] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const detail = useRef({});
  const idEdit = useRef();
  const mode = useRef();
  const [dataFilter, setDataFilter] = useState({
    fieldNews: [],
  });
  /**
   * Thay đổi bộ lọc thì gọi lại danh sách
   */
  useEffect(() => {
    if (isFirstCall.current) {
      isFirstCall.current = false;
      getDataFilter();
    }
    fetchCategoryList();
  }, [objFilter]);

  /**
   * Gọi api lấy dữ liệu danh sách danh mục tin
   */
  const fetchCategoryList = async () => {
    try {
      setConfirmLoading(true);
      const response = await newsApi.getNewsCategoryAll(objFilter);
      setNewsData({
        data: response?.PagedData?.Results ?? [],
        total: response?.PagedData?.RowCount ?? 0,
      });
    } catch (error) {
      openNotification('Lấy  danh mục thất bại', '', NotificationType.ERROR);
    } finally {
      setConfirmLoading(false);
    }
  };

  const getDataFilter = async () => {
    try {
      const filterAll = {
        currentPage: 1,
        pageSize: 9_999_999,
        direction: Direction.DESC,
        orderBy: DEFAULT_COLUMN_ORDER_BY,
      };
      setConfirmLoading(true);
      const responseFieldNews = newsApi.getNewsFieldAll(filterAll);
      Promise.all([responseFieldNews]).then((values) => {
        setDataFilter({
          fieldNews: values[0]?.PagedData?.Results ?? [],
        });
      });
    } catch (error) {
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleOnClickShowRowDetail = async (Id) => {
    const response = await getSourceNewById(Id);
    const dicDetail = [
      {
        type: 'string',
        label: 'Danh mục cấp cha',
        content: response?.ParentName ?? '',
      },
      {
        type: 'string',
        label: 'Tiêu đề',
        content: response?.CategoryNewsName,
      },
      {
        type: 'number',
        label: 'Số thứ tự',
        content: response?.Order,
      },
      {
        type: 'string',
        label: 'Loại tin',
        content:
          dataFilter?.fieldNews.find((x) => x.Id === response?.FieldNews_SK_FK)
            ?.Title ?? '',
      },
      {
        type: 'string',
        label: 'Keyword',
        content: response?.Keyword ?? '',
      },
    ];

    detail.current = dicDetail;
    setConfirmLoading(false);
    setOpenCollectionDetail(true);
  };

  const showModal = async () => {
    mode.current = Mode.Create;
    form?.setFieldsValue({});
    await getParentRoot();
    setIsModalOpen(true);
  };

  const getParentRoot = async () => {
    const filterRoot = {
      currentPage: 1,
      pageSize: 9_999_999,
      direction: Direction.DESC,
      orderBy: DEFAULT_COLUMN_ORDER_BY,
      keyword: '',
      parentId: 0,
    };
    setConfirmLoading(true);
    const response = await newsApi.getNewsCategoryAll(filterRoot);
    setDataRoot(response?.PagedData?.Results ?? []);
    setConfirmLoading(false);
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
    let parentID = null;
    let fieldNews_SK_FK = null;
    if (values.parentId) {
      parentID = parseInt(
        dataRoot.find((x) => x.CategoryNewsName === values.parentId)?.Id ?? '0'
      );
    }
    if (values.FieldNews_SK_FK) {
      fieldNews_SK_FK = parseInt(
        dataFilter?.fieldNews.find((x) => x.Title === values.FieldNews_SK_FK)
          ?.Id ?? '0'
      );
    }
    values = {
      CategoryNewsName: values?.title,
      Order: parseInt(values?.order ?? 0),
      Keyword: values?.keyword,
    };
    values.ParentId = parentID || 0;
    if (fieldNews_SK_FK) {
      values.FieldNews_SK_FK = fieldNews_SK_FK;
    }

    setIsModalOpen(false);
    if (mode.current === Mode.Create) {
      await insertCategoryNews(values);
    } else {
      await updateSounceNews(values);
    }
    form.resetFields();
    fetchCategoryList();
  };

  const updateSounceNews = async (values) => {
    try {
      setConfirmLoading(true);
      await newsApi.updateCategoryNews(idEdit.current, values);
      openNotification('Cập nhật thành công');
    } catch (error) {
      openNotification('Cập nhật thất bại', '', NotificationType.ERROR);
    } finally {
      setConfirmLoading(false);
    }
  };

  /**
   * Gọi api lấy dữ liệu danh sách nguồi tin tức
   */
  const insertCategoryNews = async (values) => {
    try {
      setConfirmLoading(true);
      await newsApi.insertCategoryNews(values);
      setIsModalOpen(false);
      fetchCategoryList();
      openNotification('Tạo mới danh mục thành công');
    } catch (error) {
      openNotification('Tạo mới danh mục thất bại', '', NotificationType.ERROR);
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

  const handleDeleteCategoryNew = async (id) => {
    try {
      setConfirmLoading(true);
      await newsApi.deleteCategoryNews(id);
      openNotification('Xóa danh mục thành công');
      fetchCategoryList();
    } catch (error) {
      openNotification('Xóa danh mục thất bại', '', NotificationType.ERROR);
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleUpdateStatusNew = async (values) => {
    try {
      setConfirmLoading(true);
      await newsApi.updateStatusCategoryNews({
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

  const renderOption = (
    <Select
      showSearch
      placeholder='Chọn cấp cha'
      style={{ width: '100%' }}
      allowClear={true}
    >
      {dataRoot.map((x) => (
        <Option value={x.CategoryNewsName} key={x.Id}>
          {x.CategoryNewsName}
        </Option>
      ))}
    </Select>
  );

  const renderField = (
    <Select
      showSearch
      placeholder='Chọn lĩnh vực'
      style={{ width: '100%' }}
      allowClear={true}
    >
      {dataFilter?.fieldNews.map((x) => (
        <Option value={x.Title} key={x.Id}>
          {x.Title}
        </Option>
      ))}
    </Select>
  );

  async function getSourceNewById(id) {
    try {
      setConfirmLoading(true);
      const res = await newsApi.getNewsCategoryByID(id);
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
    await getParentRoot();
    const res = await getSourceNewById(id);
    idEdit.current = id;
    mode.current = Mode.Edit;
    form?.setFieldsValue({
      title: res?.CategoryNewsName,
      FieldNews_SK_FK:
        dataFilter?.fieldNews.find((x) => x.Id === res?.FieldNews_SK_FK)
          ?.Title ?? '',
      description: res?.Description,
      order: res?.Order,
      keyword: res?.Keyword,
      parentId: res?.ParentName || null,
    });
    setIsModalOpen(true);
  }
  return (
    <div className={cx('wrapper')}>
      <Loading show={confirmLoading} />
      {
        //#region popup thêm mới
      }
      <Modal
        className={cx('modal-category-news')}
        title={
          mode.current === Mode.Edit
            ? 'Cập nhật danh mục tin'
            : 'Tạo mới danh mục tin'
        }
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Form {...layout} form={form} name='control-hooks' onFinish={onFinish}>
          <Form.Item name='parentId' label='Danh mục cấp cha'>
            {renderOption}
          </Form.Item>
          <Form.Item
            name='title'
            label='Tiêu đề'
            rules={[{ required: true, message: 'Tiêu đề không được để trống' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name='order' label='Số thứ tự'>
            <Input type='number' min={0} defaultValue={0} />
          </Form.Item>

          <Form.Item name='FieldNews_SK_FK' label='Loại tin'>
            {renderField}
          </Form.Item>
          <Form.Item name='keyword' label='Keyword'>
            <Input placeholder='Nhập Keyword' />
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
      {
        //#endregion
      }

      <div className={cx('top')}>
        <NewsCategoryPageSearch setTextSearch={handleChangeTextSearch} />
        <div className={cx('btn-add-category-news')}>
          <Button type='primary' icon={<FileAddFilled />} onClick={showModal}>
            Thêm mới
          </Button>
        </div>
      </div>
      <Divider style={{ margin: '0' }} />
      <div className={cx('table-data')}>
        <NewsCategoryTableData
          data={newsData}
          onClickShowRowDetail={handleOnClickShowRowDetail}
          setPagination={handleChangePagination}
          deleteCategoryNew={handleDeleteCategoryNew}
          updateStatusNew={handleUpdateStatusNew}
          updateData={handleUpdate}
        />
      </div>

      <AdminCollectionDetail
        listData={detail.current}
        open={openCollectionDetail}
        onCancel={() => {
          setOpenCollectionDetail(false);
        }}
      />
    </div>
  );
}

export default NewsCategoryPage;
