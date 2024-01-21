import documentApi from 'apis/documentApi';
import classNames from 'classnames/bind';
import { useEffect, useState, useRef } from 'react';
import styles from './DocumentSignerPage.module.scss';
import DocumentSignerPageSearch from './DocumentSignerPageSearch/DocumentSignerPageSearch';
import DocumentSignerTableData from './DocumentSignerTableData/DocumentSignerTableData';
import { Direction, NotificationType } from 'common/enum';
import { Divider, Form, Button, Input, Modal, Select } from 'antd';
import { openNotification } from 'helpers/notification';
import { Option } from 'antd/lib/mentions';
import { FileAddFilled } from '@ant-design/icons';
import { TypeUpdate, DEFAULT_COLUMN_ORDER_BY } from 'common/constant';
import Loading from 'components/Loading/Loading';
const { TextArea } = Input;
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const cx = classNames.bind(styles);

DocumentSignerPage.propTypes = {};

DocumentSignerPage.defaultProps = {};

function DocumentSignerPage(props) {
  const MODAL_TYPE = {
    EDIT: 0,
    DETAIL: 1,
  };
  const [document, setDocument] = useState({
    content: null,
    type: null,
  });

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
  const [confirmLoading, setConfirmLoading] = useState(true);

  useEffect(() => {
    if (isFirstCall.current) {
      isFirstCall.current = false;
      // return;
    }
    fetchProductList();
  }, [objFilter]);

  const fetchProductList = async () => {
    try {
      setConfirmLoading(true);
      const response = await documentApi.getDocumentSingerAll(objFilter);
      setNewsData({
        data: response?.PagedData?.Results ?? [],
        total: response?.PagedData?.RowCount ?? 0,
      });
    } catch (error) {
      openNotification('Lấy  người ký thất bại', '', NotificationType.ERROR);
    } finally {
      setConfirmLoading(false);
    }
  };

  const showModal = async () => {
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
    const response = await documentApi.getDocumentSingerAll(filterRoot);
    setDataRoot(response?.PagedData?.Results ?? []);
    setConfirmLoading(false);
  };

  const handleCancel = () => {
    form.resetFields();
    setIsModalOpen(false);
    setDocument({
      content: null,
      type: null,
    });
  };

  /**
   * Submit form tạo nguồn tin tức
   * @param {*} values Đối tượng submit form
   */
  const onFinish = (values) => {
    let parentID = null;
    if (values.parentId) {
      parentID = parseInt(
        dataRoot.find((x) => x.Title === values.parentId)?.Id ?? '0'
      );
    }
    values = {
      Title: values?.title,
      Order: parseInt(values?.order ?? 0),
      Description: values?.description,
    };

    values.ParentId = parentID || 0;

    if (document?.type === MODAL_TYPE.EDIT) updateCategoryNews(values);
    else insertCategoryNews(values);

    form.resetFields();
  };

  /**
   * Gọi api lấy dữ liệu danh sách nguồi tin tức
   */
  const updateCategoryNews = async (values) => {
    try {
      setConfirmLoading(true);
      await documentApi.updateSingerDocument(document?.content?.Id, values);
      handleCancel();
      fetchProductList();
      openNotification('Sửa thành công');
    } catch (error) {
      openNotification('Sửa thất bại', '', NotificationType.ERROR);
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
      await documentApi.insertSingerDocument(values);
      handleCancel();
      fetchProductList();
      openNotification('Tạo mới người ký thành công');
    } catch (error) {
      openNotification('Tạo mới người ký thất bại', '', NotificationType.ERROR);
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
      await documentApi.deleteSingerDocument(id);
      openNotification('Xóa người ký thành công');
      fetchProductList();
    } catch (error) {
      openNotification('Xóa người ký thất bại', '', NotificationType.ERROR);
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleUpdateStatusNew = async (values) => {
    try {
      setConfirmLoading(true);
      await documentApi.updatStatusSingerDocument({
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

  const renderOption = (
    <Select
      placeholder='Chọn cấp cha'
      style={{ width: '100%' }}
      allowClear={true}
      showSearch
    >
      {dataRoot.map((x) => (
        <Option value={x.Title} key={x.Id}>
          {x.Title}
        </Option>
      ))}
    </Select>
  );

  return (
    <div className={cx('wrapper')}>
      <Loading show={confirmLoading} />

      {
        //#region popup thêm mới
      }
      <Modal
        className={cx('modal-category-news')}
        title={
          document?.type === MODAL_TYPE.DETAIL
            ? 'Xem chi tiết'
            : document?.type === MODAL_TYPE.EDIT
            ? 'Chỉnh sửa'
            : 'Thêm mới loại văn bản tin'
        }
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
            {document?.type === MODAL_TYPE.DETAIL ? (
              <div>{document?.content?.Title}</div>
            ) : (
              <Input />
            )}
          </Form.Item>
          <Form.Item name='parentId' label='Danh mục cấp cha'>
            {document?.type === MODAL_TYPE.DETAIL ? (
              <div>
                {
                  newsData?.data?.find(
                    (item) => item?.Id === document?.content?.ParentId
                  )?.Title
                }
              </div>
            ) : (
              renderOption
            )}
          </Form.Item>
          <Form.Item name='order' label='Số thứ tự'>
            {document?.type === MODAL_TYPE.DETAIL ? (
              <div>{document?.content?.Order}</div>
            ) : (
              <Input type='number' min={0} defaultValue={0} />
            )}
          </Form.Item>
          <Form.Item name='description' label='Mô tả'>
            {document?.type === MODAL_TYPE.DETAIL ? (
              <div>{document?.content?.Description}</div>
            ) : (
              <TextArea />
            )}
          </Form.Item>

          {document?.type === MODAL_TYPE.DETAIL ? null : (
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button
                type='primary'
                htmlType={
                  document?.type === MODAL_TYPE.EDIT ? 'Lưu' : 'Tạo mới'
                }
              >
                {document?.type === MODAL_TYPE.EDIT ? 'Lưu' : 'Tạo mới'}
              </Button>
            </Form.Item>
          )}
        </Form>
      </Modal>
      {
        //#endregion
      }
      <div className={cx('top')}>
        <DocumentSignerPageSearch setTextSearch={handleChangeTextSearch} />

        <div className={cx('btn-add-signer-document')}>
          <Button type='primary' icon={<FileAddFilled />} onClick={showModal}>
            Thêm mới
          </Button>
        </div>
      </div>
      <Divider style={{ margin: '0' }} />
      <div className={cx('table-data')}>
        <DocumentSignerTableData
          data={newsData}
          setPagination={handleChangePagination}
          deleteSourceNew={handleDeleteSourceNew}
          updateStatusNew={handleUpdateStatusNew}
          onEdit={(res) => {
            showModal();
            setDocument({
              content: res,
              type: MODAL_TYPE.EDIT,
            });
            form.setFieldsValue({
              title: res?.Title,
              parentId:
                dataRoot?.find((item) => item?.Id === res?.ParentId)?.Title ||
                null,
              order: res?.Order,
              description: res?.Description,
            });
          }}
          onClickRow={(res) => {
            showModal();
            setDocument({
              content: res,
              type: MODAL_TYPE.DETAIL,
            });
          }}
        />
      </div>
    </div>
  );
}

export default DocumentSignerPage;
