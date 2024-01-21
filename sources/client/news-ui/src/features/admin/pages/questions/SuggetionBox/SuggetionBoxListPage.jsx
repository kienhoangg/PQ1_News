import { FileOutlined } from '@ant-design/icons';
import { Col, Divider, Form, Modal, Row } from 'antd';
import axiosClient from 'apis/axiosClient';
import questionApi from 'apis/questionApi';
import classNames from 'classnames/bind';
import { DEFAULT_COLUMN_ORDER_BY, TypeUpdate } from 'common/constant';
import { Direction, NotificationType } from 'common/enum';
import Loading from 'components/Loading/Loading';
import convertHelper from 'helpers/convertHelper';
import imageHelper from 'helpers/imageHelper';
import { openNotification } from 'helpers/notification';
import moment from 'moment';
import { useEffect, useState } from 'react';
import styles from './SuggetionBoxListPage.module.scss';
import SuggetionBoxListPageSearch from './SuggetionBoxListPageSearch/SuggetionBoxListPageSearch';
import SuggetionBoxTablePage from './SuggetionBoxTablePage/SuggetionBoxTablePage';

const cx = classNames.bind(styles);

SuggetionBoxListPage.propTypes = {};

SuggetionBoxListPage.defaultProps = {};

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

function SuggetionBoxListPage(props) {
  const [form] = Form.useForm();

  const POPUP_TYPE = {
    CREATE: 0,
    UPDATE: 1,
    DETAIL: 2,
  };
  const MODAL_TYPE = {
    EDIT: 1,
    CREATE: 0,
    DETAIL: 2,
  };

  const [isModalOpen, setIsModalOpen] = useState({
    imageDetail: null,
    type: null,
    show: false,
  });

  const [newsData, setNewsData] = useState({
    data: [],
    total: 0,
  });
  const [fileListAttachment, setFileListAttachment] = useState([]);
  const [questionDetail, setQuestionDetail] = useState({});
  const [objFilter, setObjFilter] = useState({
    currentPage: 1,
    pageSize: 10,
    direction: Direction.DESC,
    orderBy: DEFAULT_COLUMN_ORDER_BY,
    keyword: '',
  });
  const [confirmLoading, setConfirmLoading] = useState(true);

  const callApiGetDetail = async (id) => {
    try {
      setConfirmLoading(true);
      const res = await axiosClient.get('/Feedbacks/' + id);
      setQuestionDetail(res);
      // const label =
      //   QuestionStatus.find((x) => x.id === res?.QuestionStatus)?.label ?? "";
      form.setFieldsValue({
        Title: res?.Title,
        AskedPersonName: res?.AskedPersonName,
        Department: res?.Department,
        Address: res?.Address,
        Phone: res?.Phone,
        Email: res?.Email,
        QuestionDate: moment(res?.QuestionDate),
        IsNoticed: res?.IsNoticed,
        QuestionContent: res?.QuestionContent,
        // questionStatus: label,
        AnswerPersonName: res?.AnswerPersonName,
        AnswerContent: res?.AnswerContent,
        AnswerDate: moment(res?.AnswerDate),
      });

      res?.FilePath &&
        setFileListAttachment([
          {
            isFileFormServer: true,
            uid: '1',
            name: imageHelper.getNameFile(res?.FilePath),
            status: 'done',
            url: imageHelper.getLinkImageUrl(res?.FilePath),
          },
        ]);
    } catch (err) {
    } finally {
      setConfirmLoading(false);
    }
  };

  useEffect(() => {
    fetchProductList();
  }, [objFilter]);

  const fetchProductList = async () => {
    try {
      setConfirmLoading(true);
      const response = await questionApi.getSuggetBoxFillter(objFilter);
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

  /**
   * Sử lý thay đổi text search
   * @param {*} textSearch Từ cần tìm
   */
  const handleChangeTextSearch = (textSearch) => {
    let _objFilter = {
      ...objFilter,
      keyword: textSearch,
    };
    setObjFilter(_objFilter);
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
      await questionApi.updateStatusQuestion({
        ids: [values.Id],
        value: values.Status === 0,
        field: TypeUpdate.STATUS,
      });
      fetchProductList();
      openNotification('Cập nhật thành công');
    } catch (error) {
      openNotification('Cập nhật thất bại', '', NotificationType.ERROR);
    }
  };

  const handleDeleteCategoryNew = async (id) => {
    try {
      await questionApi.deleteQuestion(id);
      openNotification('Xóa hình ảnh thành công');
      fetchProductList();
    } catch (error) {
      openNotification('Xóa hình ảnh thất bại', '', NotificationType.ERROR);
    }
  };

  const onCancel = () => {
    setIsModalOpen({
      imageDetail: null,
      type: null,
      show: false,
    });
    form.resetFields();
    setFileListAttachment([]);
    setQuestionDetail({});
  };

  return (
    <div className={cx('wrapper')}>
      <Loading show={confirmLoading} />
      {(
        isModalOpen?.type === MODAL_TYPE.CREATE ||
        isModalOpen?.type === MODAL_TYPE.DETAIL
          ? isModalOpen?.show
          : questionDetail?.Id && isModalOpen?.show
      ) ? (
        <Modal
          open={true}
          title={
            isModalOpen?.type === MODAL_TYPE.CREATE
              ? 'Tạo mới câu hỏi'
              : isModalOpen?.type === MODAL_TYPE.DETAIL
              ? 'Chi tiết'
              : 'Chỉnh sửa câu hỏi'
          }
          okText={isModalOpen?.type === MODAL_TYPE.CREATE ? 'Tạo mới' : 'Lưu'}
          cancelText='Thoát'
          onCancel={onCancel}
          {...(isModalOpen?.type === MODAL_TYPE.DETAIL ? { footer: null } : {})}
          onOk={() => {}}
        >
          <Form
            form={form}
            {...layout}
            name='form_in_modal'
            // onFinish={onFinish}
          >
            <Row gutter={8}>
              <Col span={16}>
                <Row gutter={16} className={cx('row-item')}>
                  <Col span={8}>
                    <div className={cx('row-item-label')}>Họ tên</div>
                  </Col>
                  <Col span={16}>
                    <div>{isModalOpen?.content?.FullName}</div>
                  </Col>
                </Row>
                <Row gutter={16} className={cx('row-item')}>
                  <Col span={8}>
                    <div className={cx('row-item-label')}>Email</div>
                  </Col>
                  <Col span={16}>
                    <div>{isModalOpen?.content?.Email}</div>
                  </Col>
                </Row>
                <Row gutter={16} className={cx('row-item')}>
                  <Col span={8}>
                    <div className={cx('row-item-label')}>Điện thoại</div>
                  </Col>
                  <Col span={16}>
                    <div>{isModalOpen?.content?.Phone}</div>
                  </Col>
                </Row>
                <Row gutter={16} className={cx('row-item')}>
                  <Col span={8}>
                    <div className={cx('row-item-label')}>Địa chỉ</div>
                  </Col>
                  <Col span={16}>
                    <div>{isModalOpen?.content?.Address}</div>
                  </Col>
                </Row>
                <Row gutter={16} className={cx('row-item')}>
                  <Col span={8}>
                    <div className={cx('row-item-label')}>Tiêu đề</div>
                  </Col>
                  <Col span={16}>
                    <div>{isModalOpen?.content?.Title}</div>
                  </Col>
                </Row>
                <Row gutter={16} className={cx('row-item')}>
                  <Col span={8}>
                    <div className={cx('row-item-label')}>Nội dung</div>
                  </Col>
                  <Col span={16}>
                    <div>{isModalOpen?.content?.Content}</div>
                  </Col>
                </Row>

                <Row gutter={16} className={cx('row-item')}>
                  <Col span={8}>
                    <div className={cx('row-item-label')}>Tệp dính kèm</div>
                  </Col>
                  <Col span={16}>
                    {imageHelper.getNameFile(
                      isModalOpen?.content?.FileAttachment
                    ) && (
                      <div
                        className={cx('file-attachment')}
                        style={{ cursor: 'pointer' }}
                        onClick={() =>
                          window.open(
                            imageHelper.getLinkImageUrl(
                              isModalOpen?.content?.FileAttachment
                            )
                          )
                        }
                      >
                        <FileOutlined />{' '}
                        {imageHelper.getNameFile(
                          isModalOpen?.content?.FileAttachment
                        )}
                      </div>
                    )}
                  </Col>
                </Row>
              </Col>
            </Row>
          </Form>
        </Modal>
      ) : null}
      <div className={cx('top')}>
        <SuggetionBoxListPageSearch
          setTextSearch={handleChangeTextSearch}
          onCreate={() => {
            setIsModalOpen({
              id: null,
              show: true,
              type: POPUP_TYPE.CREATE,
            });
          }}
        />
      </div>
      <Divider style={{ margin: '0' }} />
      <div className={cx('table-data')}>
        <SuggetionBoxTablePage
          data={newsData}
          setPagination={handleChangePagination}
          updateStatusNew={handleUpdateStatusNew}
          deleteCategoryNew={(res) => handleDeleteCategoryNew(res?.Id)}
          onEdit={(Id) => {
            setIsModalOpen({
              id: Id,
              show: true,
              type: POPUP_TYPE.UPDATE,
            });
            callApiGetDetail(Id);
          }}
          onClickRow={(res) => {
            setIsModalOpen({
              id: res?.Id,
              show: true,
              type: POPUP_TYPE.DETAIL,
              content: res,
            });
          }}
        />
      </div>
    </div>
  );
}

export default SuggetionBoxListPage;
