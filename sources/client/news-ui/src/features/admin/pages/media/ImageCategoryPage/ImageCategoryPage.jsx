import { Divider, Form, TreeSelect, Button, Modal, Input } from 'antd';
import { useEffect, useState } from 'react';
import ImageCategoryPageSearch from './ImageCategoryPageSearch/ImageCategoryPageSearch';
import ImageCategoryTableData from './ImageCategoryTableData/ImageCategoryTableData';

import mediaApi from 'apis/mediaApi';
import classNames from 'classnames/bind';
import styles from './ImageCategoryPage.module.scss';
import { useRef } from 'react';
import { Direction } from 'common/enum';
import { openNotification } from 'helpers/notification';
import { NotificationType } from 'common/enum';
import commonFunc from 'common/commonFunc';
import { TreeNode } from 'antd/lib/tree-select';
import convertHelper from 'helpers/convertHelper';
import { FileAddFilled } from '@ant-design/icons';
import TextArea from 'antd/lib/input/TextArea';
import { Option } from 'antd/lib/mentions';
import { Select } from 'antd';
import { TypeUpdate, DEFAULT_COLUMN_ORDER_BY } from 'common/constant';
import Loading from 'components/Loading/Loading';

const cx = classNames.bind(styles);
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

ImageCategoryPage.propTypes = {};

ImageCategoryPage.defaultProps = {};

function ImageCategoryPage(props) {
  const [newsData, setNewsData] = useState({
    data: [],
    total: 0,
  });
  const [dataRoot, setDataRoot] = useState([]);
  const MODAL_TYPE = {
    EDIT: 0,
    DETAIL: 1,
  };
  const [document, setDocument] = useState({
    content: null,
    type: null,
  });
  const isFirstCall = useRef(true);
  const [objFilter, setObjFilter] = useState({
    currentPage: 1,
    pageSize: 10,
    direction: Direction.DESC,
    orderBy: 'CreatedDate',
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
    fetchCategoryList();
  }, [objFilter]);

  /**
   * Gọi api lấy dữ liệu danh sách loại văn bản tin
   */
  const fetchCategoryList = async () => {
    try {
      setConfirmLoading(true);
      const response = await mediaApi.getImageCategoryAll(objFilter);

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
      await mediaApi.deleteImageCategory(id);
      openNotification('Xóa danh mục hình ảnh thành công');
      fetchCategoryList();
    } catch (error) {
      openNotification(
        'Xóa danh mục hình ảnh thất bại',
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
      await mediaApi.updateStatusImageCategory({
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
    setDocument({
      content: null,
      type: null,
    });
  };
  const onCreate = async (values) => {
    try {
      setConfirmLoading(true);
      if (document?.type === MODAL_TYPE.EDIT) {
        await mediaApi.updateImageCategory(document?.content?.Id, values);
        openNotification('Sửa danh mục hình ảnh thành công');
      } else {
        await mediaApi.insertImageCategory(values);
        openNotification('Tạo mới danh mục hình ảnh thành công');
      }

      fetchCategoryList();
      onCancel();
    } catch (error) {
      if (document?.type === MODAL_TYPE.EDIT) {
        openNotification(
          'Sửa danh mục hình ảnh thất bại',
          '',
          NotificationType.ERROR
        );
      } else {
        openNotification(
          'Tạo mới danh mục hình ảnh thất bại',
          '',
          NotificationType.ERROR
        );
      }
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
    const response = await mediaApi.getImageCategoryAll(filterRoot);
    setDataRoot(response?.PagedData?.Results ?? []);
    setConfirmLoading(false);
  };

  const renderStaticCategoryId = (
    <Select
      placeholder='Chọn cấp cha'
      style={{ width: '100%' }}
      showSearch
      allowClear
    >
      {dataRoot.map((x) => (
        <Option value={x.Id} key={x.Id}>
          {x.Title}
        </Option>
      ))}
    </Select>
  );

  /**
   * Submit form tạo nguồn tin tức
   * @param {*} values Đối tượng submit form
   */
  const onFinish = (values) => {
    const { Title, Order, ParentId, Description } = values;
    const bodyData = {
      Title,
      Order,
      Description,
    };
    bodyData.ParentId = parseInt(ParentId) || 0;
    form.resetFields();
    onCreate(bodyData);
  };

  return (
    <div className={cx('wrapper')}>
      <Loading show={confirmLoading} />

      <Modal
        open={isModalOpen}
        title={
          document?.type === MODAL_TYPE.DETAIL
            ? 'Xem chi tiết'
            : document?.type === MODAL_TYPE.EDIT
            ? 'Chỉnh sửa'
            : 'Thêm mới'
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
            {document?.type === MODAL_TYPE.DETAIL ? (
              <div>{document?.content?.Title}</div>
            ) : (
              <Input />
            )}
          </Form.Item>

          <Form.Item name='Order' label='Số thứ tự'>
            {document?.type === MODAL_TYPE.DETAIL ? (
              <div>{document?.content?.Order}</div>
            ) : (
              <Input type='number' min={0} />
            )}
          </Form.Item>

          <Form.Item label='Danh mục' name='ParentId'>
            {document?.type === MODAL_TYPE.DETAIL ? (
              <div>
                {
                  newsData?.data?.find(
                    (item) => item?.Id === document?.content?.ParentId
                  )?.Title
                }
              </div>
            ) : (
              renderStaticCategoryId
            )}
          </Form.Item>

          <Form.Item label='Mô tả' name='Description'>
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

      <div className={cx('top')}>
        <ImageCategoryPageSearch setTextSearch={handleChangeTextSearch} />
        <div>
          <Button type='primary' icon={<FileAddFilled />} onClick={showModal}>
            Tạo mới
          </Button>
        </div>
      </div>
      <Divider style={{ margin: 0 }} />
      <div className={cx('table-data')}>
        <ImageCategoryTableData
          data={newsData}
          setPagination={handleChangePagination}
          deleteCategoryNew={handleDeleteCategoryNew}
          updateStatusNew={handleUpdateStatusNew}
          onEdit={(res) => {
            showModal();
            setDocument({
              content: res,
              type: MODAL_TYPE.EDIT,
            });
            form.setFieldsValue({
              Title: res?.Title,
              ParentId: res?.ParentId || null,
              Order: res?.Order,
              Description: res?.Description,
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

export default ImageCategoryPage;
