import { Divider, Form, Input, Button, Select, Upload, Row, Col } from 'antd';
import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import styles from './CompanyListPage.module.scss';
import CompanyListTableData from './CompanyListTableData/CompanyListTableData';
import CompanyListPageSearch from './CompanyListPageSearch/CompanyListPageSearch';
import linkAndCompanyApi from 'apis/linkAndCompanyApi';
import { useRef } from 'react';
import { Direction, NotificationType } from 'common/enum';
import { openNotification } from 'helpers/notification';
import { DEFAULT_COLUMN_ORDER_BY, TypeUpdate } from 'common/constant';
import { Modal } from 'antd';
import { FileAddFilled, UploadOutlined } from '@ant-design/icons';
import { Option } from 'antd/lib/mentions';
import commonFunc from 'common/commonFunc';
import convertHelper from 'helpers/convertHelper';
import imageHelper from 'helpers/imageHelper';
import { envDomainBackend } from 'common/enviroments';
import datetimeHelper from 'helpers/datetimeHelper';
import Loading from 'components/Loading/Loading';
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const LIMIT_UP_LOAD_FILE = 2_097_152; //2mb
const Mode = {
  Create: 1,
  Edit: 0,
};

const cx = classNames.bind(styles);

CompanyListPage.propTypes = {};

CompanyListPage.defaultProps = {};

function CompanyListPage(props) {
  const filterAll = {
    currentPage: 1,
    pageSize: 9_999_999,
    direction: Direction.DESC,
    orderBy: DEFAULT_COLUMN_ORDER_BY,
  };
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
  const [popupUpdate, setPopupUpdate] = useState({
    id: null,
    show: false,
  });
  const dataDetail = useRef({});
  const [openCollectionNewsDetail, setOpenCollectionNewsDetail] =
    useState(false);
  const [dataFilter, setDataFilter] = useState({
    categoryAll: [],
  });
  const [fileListAttachment, setFileListAttachment] = useState([]);
  const mode = useRef(Mode.Create);
  const idEdit = useRef(-1);
  const handleChangeAttachment = ({ fileList: newFileList }) => {
    setFileListAttachment(newFileList);
  };

  const [isShowDetail, setIsShowDetail] = useState(false);
  const detail = useRef({});
  const [confirmLoading, setConfirmLoading] = useState(true);

  /**
   * Thay đổi bộ lọc thì gọi lại danh sách
   */
  useEffect(() => {
    if (isFirstCall.current) {
      isFirstCall.current = false;
      getDataFilter();
    }
    fetchProductList();
  }, [objFilter]);

  /**
   * Gọi api lấy dữ liệu danh sách nguồi tin tức
   */
  const fetchProductList = async () => {
    try {
      setConfirmLoading(true);
      const response = await linkAndCompanyApi.getCompanyAll(objFilter);
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

  const getDataFilter = async () => {
    setConfirmLoading(true);
    const responseCategoryAll =
      linkAndCompanyApi.getCompanyInfoCategoryAll(filterAll);

    Promise.all([responseCategoryAll]).then((values) => {
      setDataFilter({
        categoryAll: values[0]?.PagedData?.Results ?? [],
      });
    });
    setConfirmLoading(false);
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
      await linkAndCompanyApi.deleteCompany(id);
      openNotification('Xóa doanh nghiệp thành công');
      fetchProductList();
    } catch (error) {
      openNotification('Xóa doanh nghiệp thất bại', '', NotificationType.ERROR);
    } finally {
      setConfirmLoading(false);
    }
  };

  const showModal = () => {
    setFileListAttachment([]);
    mode.current = Mode.Create;
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
  const onFinish = (values) => {
    const { Title, Order, CompanyInfoCategoryId, Link } = values;
    let bodyData = {
      Title,
      Order,
      CompanyInfoCategoryId,
      Link,
    };
    if (CompanyInfoCategoryId) {
      bodyData.CompanyInfoCategoryId = parseInt(CompanyInfoCategoryId);
    }
    let body = { JsonString: bodyData };

    if (
      fileListAttachment.length > 0 &&
      !fileListAttachment?.[0]?.isFileFormServer
    ) {
      const file = fileListAttachment[0].originFileObj;
      if (file.size > LIMIT_UP_LOAD_FILE) {
        openNotification(
          'File đính kèm đã lớn hơn 2MB',
          '',
          NotificationType.ERROR
        );
        return;
      }
      body.FileAttachment = file;
    } else if (
      fileListAttachment?.[0]?.isFileFormServer &&
      fileListAttachment.length > 0
    ) {
      const files = [...fileListAttachment];
      bodyData = {
        ...bodyData,
        Avatar: files?.[0]?.url?.replaceAll(envDomainBackend, ''),
      };
    }
    body = { ...body, JsonString: bodyData };
    form.resetFields();
    setFileListAttachment([]);
    upsertSounceNews(body);
  };

  /**
   * Gọi api lấy dữ liệu danh sách nguồi tin tức
   */
  const upsertSounceNews = async (values) => {
    try {
      setIsModalOpen(false);

      var formData = new FormData();
      formData.append('JsonString', convertHelper.Serialize(values.JsonString));

      if (values.FileAttachment) {
        formData.append('FileAttachment', values.FileAttachment);
      }
      setConfirmLoading(true);
      if (mode.current === Mode.Create) {
        await linkAndCompanyApi.insertCompany(formData);
      } else {
        await linkAndCompanyApi.updateCompany(idEdit.current, formData);
      }

      openNotification('Thành công');
      fetchProductList();
      setFileListAttachment([]);
    } catch (error) {
      openNotification('Thất bại', '', NotificationType.ERROR);
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleUpdateStatusNew = async (values) => {
    try {
      setConfirmLoading(true);
      await linkAndCompanyApi.updateStatusCompany({
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

  const handleOnClickShowRowDetail = async (values) => {
    const detailRow = await fetchItem(values);
    console.log(detailRow);
    if (!detailRow) {
      return;
    }
    detail.current = detailRow;
    setIsShowDetail(true);
  };

  const fetchItem = async (values) => {
    try {
      setConfirmLoading(true);
      return await linkAndCompanyApi.getCompanyById(values?.Id);
    } catch (error) {
      openNotification('Lấy dữ liệu thất bại', '', NotificationType.ERROR);
      return null;
    } finally {
      setConfirmLoading(false);
    }
  };

  const renderStaticCategoryId = (
    <Select
      placeholder='Chọn danh mục'
      style={{ width: '100%' }}
      showSearch
      allowClear
    >
      {dataFilter?.categoryAll.map((x) => (
        <Option value={x.Id} key={x.Id}>
          {x.Title}
        </Option>
      ))}
    </Select>
  );

  const handleEdit = async (id) => {
    setConfirmLoading(true);
    const res = await linkAndCompanyApi.getCompanyById(id);
    setConfirmLoading(false);
    idEdit.current = id;
    mode.current = Mode.Edit;
    form?.setFieldsValue({
      Title: res?.Title,
      Link: res?.Link,
      CompanyInfoCategoryId: res?.CompanyInfoCategoryId,
      Order: res?.Order,
    });

    if (res?.Avatar) {
      setFileListAttachment([
        {
          isFileFormServer: true,
          uid: '1',
          name: imageHelper.getNameFile(res?.Avatar),
          status: 'done',
          url: imageHelper.getLinkImageUrl(res?.Avatar),
        },
      ]);
    }
    setIsModalOpen(true);
  };

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
            name='Title'
            label='Tiêu đề'
            rules={[{ required: true, message: 'Tiêu đề không được để trống' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label='Danh mục doanh nghiệp' name='CompanyInfoCategoryId'>
            {renderStaticCategoryId}
          </Form.Item>

          <Form.Item name='Link' label='Địa chỉ (link)'>
            <Input />
          </Form.Item>

          <Form.Item name='Order' label='Số thứ tự'>
            <Input type='number' min={0} />
          </Form.Item>

          <Form.Item name='lb-attachment' label='Ảnh đại diện'>
            <Upload
              listType='picture'
              defaultFileList={fileListAttachment}
              onChange={handleChangeAttachment}
              customRequest={commonFunc.dummyRequest}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Tải lên Tệp</Button>
            </Upload>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type='primary' htmlType='Tạo mới'>
              Tạo mới
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <div className={cx('top')}>
        <CompanyListPageSearch setTextSearch={handleChangeTextSearch} />
        <div className={cx('btn-add-source-news')}>
          <Button type='primary' icon={<FileAddFilled />} onClick={showModal}>
            Thêm mới
          </Button>
        </div>
      </div>
      <Divider style={{ margin: '0' }} />
      <div className={cx('table-data')}>
        <CompanyListTableData
          data={newsData}
          setPagination={handleChangePagination}
          deleteSourceNew={handleDeleteSourceNew}
          updateStatusNew={handleUpdateStatusNew}
          onClickShowRowDetail={handleOnClickShowRowDetail}
          onClickEdit={handleEdit}
        />
      </div>

      {/* Chi tiết */}
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
                <div className={cx('row-item-label')}>Địa chỉ</div>
              </Col>
              <Col span={16}>
                <div>{detail.current?.Link}</div>
              </Col>
            </Row>
            <Row gutter={16} className={cx('row-item')}>
              <Col span={8}>
                <div className={cx('row-item-label')}>Ngày tạo</div>
              </Col>
              <Col span={16}>
                <div>
                  {datetimeHelper.formatDatetimeToDateVN(
                    detail.current?.CreatedDate
                  )}
                </div>
              </Col>
            </Row>
            <Row gutter={16} className={cx('row-item')}>
              <Col span={8}>
                <div className={cx('row-item-label')}>Ngày sửa cuối</div>
              </Col>
              <Col span={16}>
                <div>
                  {datetimeHelper.formatDatetimeToDateVN(
                    detail.current?.LastModifiedDate
                  )}
                </div>
              </Col>
            </Row>
            <Row gutter={16} className={cx('row-item')}>
              <Col span={8}>
                <div className={cx('row-item-label')}>Ảnh đại diện</div>
              </Col>
              <Col span={16}>
                <div>
                  <img
                    alt=''
                    style={{ width: '10vw' }}
                    src={imageHelper.getLinkImageUrl(detail.current?.Avatar)}
                  />
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Modal>
    </div>
  );
}

export default CompanyListPage;
