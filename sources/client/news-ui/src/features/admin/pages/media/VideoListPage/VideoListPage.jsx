import { Button, Divider, Form, Input, Modal, Select, Upload } from 'antd';
import { useEffect, useState } from 'react';
import VideoListPageSearch from './VideoListPageSearch/VideoListPageSearch';
import VideoListTableData from './VideoListTableData/VideoListTableData';

import mediaApi from 'apis/mediaApi';
import classNames from 'classnames/bind';
import styles from './VideoListPage.module.scss';
import { openNotification } from 'helpers/notification';
import { Direction, NotificationType } from 'common/enum';
import convertHelper from 'helpers/convertHelper';
import { Option } from 'antd/lib/mentions';
import commonFunc from 'common/commonFunc';
import { UploadOutlined } from '@ant-design/icons';
import imageHelper from 'helpers/imageHelper';
import TextArea from 'antd/lib/input/TextArea';
import { TypeUpdate, DEFAULT_COLUMN_ORDER_BY } from 'common/constant';
import Loading from 'components/Loading/Loading';

const cx = classNames.bind(styles);

VideoListPage.propTypes = {};

VideoListPage.defaultProps = {};

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const filterAll = {
  currentPage: 1,
  pageSize: 9_999_999,
  direction: Direction.DESC,
  orderBy: DEFAULT_COLUMN_ORDER_BY,
};

function VideoListPage(props) {
  const [objFilter, setObjFilter] = useState({
    currentPage: 1,
    pageSize: 10,
    direction: Direction.DESC,
    orderBy: DEFAULT_COLUMN_ORDER_BY,
    keyword: '',
  });
  const [newsData, setNewsData] = useState({
    data: [],
    total: 0,
  });

  const MODAL_TYPE = {
    EDIT: 0,
    CREATE: 1,
  };

  const [isModalOpen, setIsModalOpen] = useState({
    imageDetail: null,
    type: null,
    show: false,
  });

  const [dataFilter, setDataFilter] = useState({
    categoryAll: [],
  });

  const [form] = Form.useForm();
  const [avatar, setAvatar] = useState([]);
  const [fileListAttachment, setFileListAttachment] = useState([]);
  const [confirmLoading, setConfirmLoading] = useState(true);

  const onCancel = () => {
    setIsModalOpen({
      imageDetail: null,
      type: null,
      show: false,
    });
    form.resetFields();
    setFileListAttachment([]);
    setAvatar([]);
  };

  const handleChangeAttachment = ({ fileList: newFileList }) => {
    setFileListAttachment(newFileList);
  };

  const handleChangeAvatar = ({ fileList: newFileList }) => {
    setAvatar(newFileList);
  };

  const LIMIT_UP_LOAD_FILE = 2_097_152; //2mb

  const handleUpdateStatusNew = async (values) => {
    try {
      setConfirmLoading(true);
      await mediaApi.updateStatusVideo({
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

  const handleDeleteCategoryNew = async (id) => {
    try {
      setConfirmLoading(true);
      await mediaApi.deleteVideo(id);
      openNotification('Xóa hình ảnh thành công');
      fetchProductList();
    } catch (error) {
      openNotification('Xóa hình ảnh thất bại', '', NotificationType.ERROR);
    } finally {
      setConfirmLoading(false);
    }
  };

  /**
   * Gọi API lấy chi tiết
   */
  const callApiGetDetailVideo = async (id) => {
    if (!id && id !== 0) return;
    try {
      setConfirmLoading(true);
      const res = await mediaApi.getDetailVideo(id);
      setIsModalOpen({
        imageDetail: res,
        type: MODAL_TYPE.EDIT,
        show: true,
      });
      form.setFieldsValue({
        Title: res?.Title,
        VideoCategoryId:
          dataFilter?.categoryAll.find((x) => x.Id === res?.VideoCategoryId)
            ?.Title ?? '',
        LinkVideo: res?.LinkVideo,
      });

      res?.FileAttachment &&
        setFileListAttachment([
          {
            isFileFormServer: true,
            uid: '1',
            name: imageHelper.getNameFile(res?.FileAttachment),
            status: 'done',
            url: imageHelper.getLinkImageUrl(res?.FileAttachment),
          },
        ]);

      res?.Avatar &&
        setAvatar([
          {
            isFileFormServer: true,
            uid: '1',
            name: imageHelper.getNameFile(res?.Avatar),
            status: 'done',
            url: imageHelper.getLinkImageUrl(res?.Avatar),
          },
        ]);
    } catch (err) {
    } finally {
      setConfirmLoading(false);
    }
  };

  const renderStaticCategoryId = (
    <Select
      placeholder='Chọn danh mục'
      style={{ width: '100%' }}
      allowClear={true}
      showSearch
    >
      {dataFilter?.categoryAll.map((x) => (
        <Option value={x.Title} key={x.Id}>
          {x.Title}
        </Option>
      ))}
    </Select>
  );

  const onCreate = async (values) => {
    try {
      var formData = new FormData();
      formData.append('JsonString', convertHelper.Serialize(values.JsonString));

      if (values.FileAttachment) {
        formData.append('FileAttachment', values.FileAttachment);
      }

      if (values.Avatar) {
        formData.append('Avatar', values.Avatar);
      }
      setConfirmLoading(true);
      if (isModalOpen?.type === MODAL_TYPE.CREATE) {
        await mediaApi.insertVideo(formData);
        openNotification('Tạo mới video thành công');
      } else {
        await mediaApi.updateVideo(isModalOpen?.imageDetail?.Id, formData);
        openNotification('Cập nhật video thành công');
      }

      fetchProductList();

      setIsModalOpen({
        imageDetail: null,
        type: null,
        show: false,
      });

      onCancel();

      fetchProductList();
    } catch (error) {
      if (isModalOpen?.type === MODAL_TYPE.CREATE) {
        openNotification('Tạo mới video thất bại', '', NotificationType.ERROR);
      } else {
        openNotification('Cập nhật video thất bại', '', NotificationType.ERROR);
      }
    } finally {
      setConfirmLoading(false);
    }
  };

  /**
   * Submit form tạo nguồn tin tức
   * @param {*} values Đối tượng submit form
   */
  const onFinish = (values) => {
    const { Title, LinkVideo, VideoCategoryId } = values;
    let bodyData = {
      Title,
      LinkVideo,
    };
    if (VideoCategoryId) {
      bodyData.VideoCategoryId = parseInt(
        dataFilter?.categoryAll.find((x) => x.Title === VideoCategoryId)?.Id ??
          undefined
      );
    }
    let body = { JsonString: bodyData };

    if (
      fileListAttachment.length > 0 &&
      !fileListAttachment?.[0]?.isFileFormServer
    ) {
      let listFileUpload = [];
      for (let i = 0; i < fileListAttachment.length; i++) {
        const file = fileListAttachment[i].originFileObj;
        if (file.size > LIMIT_UP_LOAD_FILE) {
          openNotification(
            `File thứ ${i + 1} đã lớn hơn 2MB`,
            '',
            NotificationType.ERROR
          );
          return;
        }
        listFileUpload.push(file);
      }

      body.FileAttachment = listFileUpload?.[0];
    } else if (
      fileListAttachment?.[0]?.isFileFormServer &&
      fileListAttachment.length > 0 &&
      isModalOpen?.type === MODAL_TYPE.EDIT
    ) {
      bodyData = {
        ...bodyData,
        FileAttachment: isModalOpen?.imageDetail?.FileAttachment,
      };
    }

    if (avatar.length > 0 && !avatar?.[0]?.isFileFormServer) {
      let listFileUpload = [];
      for (let i = 0; i < avatar.length; i++) {
        const file = avatar[i].originFileObj;
        if (file.size > LIMIT_UP_LOAD_FILE) {
          openNotification(
            `File thứ ${i + 1} đã lớn hơn 2MB`,
            '',
            NotificationType.ERROR
          );
          return;
        }
        listFileUpload.push(file);
      }

      body.Avatar = listFileUpload?.[0];
    } else if (
      avatar?.[0]?.isFileFormServer &&
      avatar.length > 0 &&
      isModalOpen?.type === MODAL_TYPE.EDIT
    ) {
      bodyData = {
        ...bodyData,
        Avatar: isModalOpen?.imageDetail?.Avatar,
      };
    }

    body = { ...body, JsonString: bodyData };

    onCreate(body);
  };

  useEffect(() => {
    getDataFilter();
  }, []);

  useEffect(() => {
    fetchProductList();
  }, [objFilter]);

  const getDataFilter = async () => {
    setConfirmLoading(true);
    const res = await mediaApi.getVideoCategoryFilter(filterAll);

    setDataFilter({
      categoryAll: res?.PagedData?.Results ?? [],
    });
    setConfirmLoading(false);
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

  /**
   * Sử lý thay đổi text search
   * @param {*} textSearch Từ cần tìm
   */
  const handleChangeTextSearch = (textSearch) => {
    setObjFilter({ ...objFilter, keyword: textSearch });
  };

  const fetchProductList = async () => {
    try {
      setConfirmLoading(true);
      const response = await mediaApi.getVideoAll(objFilter);
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

  return (
    <div className={cx('wrapper')}>
      <Loading show={confirmLoading} />

      {(isModalOpen?.type === MODAL_TYPE.CREATE ||
        isModalOpen?.type === MODAL_TYPE.EDIT) &&
      isModalOpen?.show ? (
        <Modal
          open={true}
          title={
            isModalOpen?.type === MODAL_TYPE.CREATE
              ? 'Tạo mới video'
              : 'Chỉnh sửa video'
          }
          okText={isModalOpen?.type === MODAL_TYPE.CREATE ? 'Tạo mới' : 'Lưu'}
          cancelText='Thoát'
          onCancel={onCancel}
          footer={null}
        >
          <Form
            form={form}
            {...layout}
            name='control-hooks'
            onFinish={onFinish}
          >
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

            <Form.Item label='Danh mục video' name='VideoCategoryId'>
              {renderStaticCategoryId}
            </Form.Item>

            <Form.Item name='lb-attachment' label='Ảnh đại diện'>
              <Upload
                listType='picture'
                fileList={avatar}
                onChange={handleChangeAvatar}
                customRequest={commonFunc.dummyRequest}
                multiple={false}
                maxCount={1}
              >
                <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>

                {/* {fileListAttachment.length < 1 ? (
                <Button icon={<UploadOutlined />}>Tải lên Tệp</Button>
              ) : null} */}
              </Upload>
            </Form.Item>

            <Form.Item name='LinkVideo' label='Link video'>
              <TextArea
                type='text'
                min={0}
                style={{
                  height: 200,
                }}
              />
            </Form.Item>

            <Form.Item name='lb-attachment' label='File đính kèm'>
              <Upload
                listType='picture'
                fileList={fileListAttachment}
                onChange={handleChangeAttachment}
                customRequest={commonFunc.dummyRequest}
                multiple={false}
                maxCount={1}
                accept='.mp4'
              >
                <Button icon={<UploadOutlined />}>Tải lên Tệp</Button>

                {/* {fileListAttachment.length < 1 ? (
                <Button icon={<UploadOutlined />}>Tải lên Tệp</Button>
              ) : null} */}
              </Upload>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type='primary' htmlType='Tạo mới'>
                {isModalOpen?.type === MODAL_TYPE.CREATE ? 'Tạo mới' : 'Lưu'}
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      ) : null}

      <div className={cx('top')}>
        <VideoListPageSearch
          setTextSearch={handleChangeTextSearch}
          onCreate={() =>
            setIsModalOpen({
              imageDetail: null,
              type: MODAL_TYPE.CREATE,
              show: true,
            })
          }
        />
      </div>
      <Divider style={{ margin: '0' }} />
      <div className={cx('table-data')}>
        <VideoListTableData
          setPagination={handleChangePagination}
          data={newsData}
          onEdit={(res) => callApiGetDetailVideo(res?.Id)}
          updateStatusNew={handleUpdateStatusNew}
          deleteCategoryNew={(res) => handleDeleteCategoryNew(res?.Id)}
        />
      </div>
    </div>
  );
}

export default VideoListPage;
