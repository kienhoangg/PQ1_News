import { UploadOutlined } from '@ant-design/icons';
import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Upload,
} from 'antd';
import { Option } from 'antd/lib/mentions';
import axiosClient from 'apis/axiosClient';
import questionApi from 'apis/questionApi';
import { CKEditor } from 'ckeditor4-react';
import classNames from 'classnames/bind';
import commonFunc from 'common/commonFunc';
import { TypeUpdate, DEFAULT_COLUMN_ORDER_BY } from 'common/constant';
import { Direction, NotificationType } from 'common/enum';
import Loading from 'components/Loading/Loading';
import convertHelper from 'helpers/convertHelper';
import datetimeHelper from 'helpers/datetimeHelper';
import imageHelper from 'helpers/imageHelper';
import { openNotification } from 'helpers/notification';
import moment from 'moment';
import { useEffect, useState } from 'react';
import styles from './QuestionListPage.module.scss';
import QuestionListPageSearch from './QuestionListPageSearch/QuestionListPageSearch';
import QuestionListTableData from './QuestionListTableData/QuestionListTableData';

const cx = classNames.bind(styles);

QuestionListPage.propTypes = {};

QuestionListPage.defaultProps = {};

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

function QuestionListPage(props) {
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

  const handleChangeAttachment = ({ fileList: newFileList }) => {
    setFileListAttachment(newFileList);
  };

  const callApiGetDetail = async (id) => {
    try {
      setConfirmLoading(true);
      const res = await axiosClient.get('/questions/' + id);
      setQuestionDetail(res);
      // const label =
      //   QuestionStatus.find((x) => x.id === res?.QuestionStatus)?.label ?? "";
      form.setFieldsValue({
        QuestionCategoryId:
          dataCategoryQuestion.find((x) => x.Id === res?.QuestionCategoryId)
            ?.Title ?? '',
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
      const response = await questionApi.getAll(objFilter);
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
  const handleChangeTextSearch = (
    textSearch,
    questionStatus,
    categoryQuestion
  ) => {
    let _objFilter = {
      ...objFilter,
      keyword: textSearch,
      ...(questionStatus || questionStatus === 0
        ? { questionStatus: questionStatus }
        : {}),
      ...(categoryQuestion || categoryQuestion === 0
        ? { questionCategoryId: categoryQuestion }
        : {}),
    };

    if (!_objFilter?.questionCategoryId) {
      delete _objFilter?.questionCategoryId;
    }

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
      setConfirmLoading(true);
      await questionApi.updateStatusQuestion({
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
      await questionApi.deleteQuestion(id);
      openNotification('Xóa hình ảnh thành công');
      fetchProductList();
    } catch (error) {
      openNotification('Xóa hình ảnh thất bại', '', NotificationType.ERROR);
    } finally {
      setConfirmLoading(false);
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

  useEffect(() => {
    getCategoryQuestion();
  }, []);

  const [dataCategoryQuestion, setDataCategoryQuestion] = useState([]);

  /**
   * Call API lấy danh mục câu hỏi
   */
  const getCategoryQuestion = async () => {
    try {
      setConfirmLoading(true);
      const res = await axiosClient.post('/questioncategories/filter', {
        pageSize: 9999,
        currentPage: 1,
        direction: -1,
        orderBy: DEFAULT_COLUMN_ORDER_BY,
      });

      setDataCategoryQuestion(res?.PagedData?.Results);
    } catch (err) {
    } finally {
      setConfirmLoading(false);
    }
  };
  const LIMIT_UP_LOAD_FILE = 2_097_152; //2mb
  const onCreate = async (values = {}) => {
    try {
      var formData = new FormData();
      formData.append(
        'JsonString',
        convertHelper.Serialize(values?.JsonString)
      );

      if (values?.FileAttachment) {
        formData.append('FileAttachment', values?.FileAttachment);
      }
      setConfirmLoading(true);
      if (isModalOpen?.type === MODAL_TYPE.CREATE) {
        await axiosClient.post('/questions', formData);
        openNotification('Tạo mới thành công');
      } else {
        await axiosClient.put('/questions/' + questionDetail?.Id, formData);
        openNotification('Cập nhật thành công');
      }

      onCancel();

      fetchProductList();
    } catch (error) {
      openNotification('Cập nhật tin tức thất bại', '', NotificationType.ERROR);
    } finally {
      setConfirmLoading(false);
    }
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
              ? 'Chi tiết câu hỏi'
              : 'Chỉnh sửa câu hỏi'
          }
          okText={isModalOpen?.type === MODAL_TYPE.CREATE ? 'Tạo mới' : 'Lưu'}
          cancelText='Thoát'
          onCancel={onCancel}
          width={'90vw'}
          style={{
            top: 20,
          }}
          {...(isModalOpen?.type === MODAL_TYPE.DETAIL ? { footer: null } : {})}
          centered
          onOk={() => {
            form
              .validateFields()
              .then((values) => {
                values.QuestionContent =
                  values.QuestionContent?.editor?.getData();

                values.AnswerContent = values.AnswerContent?.editor?.getData();

                const {
                  QuestionCategoryId,
                  Title,
                  AskedPersonName,
                  Department,
                  Address,
                  Phone,
                  Email,
                  QuestionDate,
                  IsNoticed,
                  QuestionContent,
                  // questionStatus,
                  AnswerPersonName,
                  AnswerContent,
                  AnswerDate,
                } = values;
                let bodyData = {
                  QuestionCategoryId: parseInt(
                    dataCategoryQuestion.find(
                      (x) => x.Title === QuestionCategoryId
                    )?.Id ?? '0'
                  ),
                  Title: Title,
                  AskedPersonName: AskedPersonName,
                  Department: Department,
                  Address: Address,
                  Phone: Phone,
                  Email: Email,
                  QuestionDate: QuestionDate?._d
                    ? datetimeHelper.formatDatetimeToDateSerer(QuestionDate?._d)
                    : null,
                  IsNoticed: IsNoticed,
                  QuestionContent: QuestionContent,
                  // QuestionStatus: parseInt(
                  //   QuestionStatus.find((x) => x.label === questionStatus)
                  //     ?.id ?? "0"
                  // ),
                  AnswerPersonName: AnswerPersonName,
                  AnswerContent: AnswerContent,
                  AnswerDate: AnswerDate?._d
                    ? datetimeHelper.formatDatetimeToDateSerer(AnswerDate?._d)
                    : null,
                };

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
                  delete bodyData?.FilePath;
                } else if (
                  fileListAttachment?.[0]?.isFileFormServer &&
                  fileListAttachment.length > 0
                ) {
                  bodyData = {
                    ...bodyData,
                    FilePath: questionDetail?.FilePath,
                  };
                }

                body = { ...body, JsonString: bodyData };

                onCreate(body);
              })
              .catch((info) => {
                console.log('Validate Failed:', info);
              });
          }}
        >
          <Form
            form={form}
            {...layout}
            name='form_in_modal'
            // onFinish={onFinish}
          >
            <Row>
              <Col>
                <div
                  style={{
                    marginBottom: 20,
                  }}
                >
                  <b>Thông tin gửi câu hỏi</b>
                </div>
                <Form.Item label='Danh mục chủ đề' name='QuestionCategoryId'>
                  {isModalOpen?.type === MODAL_TYPE.DETAIL ? (
                    <div>
                      {
                        dataCategoryQuestion?.find(
                          (item) =>
                            item?.Id ===
                            isModalOpen?.content?.QuestionCategoryId
                        )?.Title
                      }
                    </div>
                  ) : (
                    <Select
                      placeholder='Danh mục chủ đề'
                      style={{ width: '100%' }}
                      allowClear
                      showSearch
                    >
                      {dataCategoryQuestion?.map((x) => (
                        <Option value={x.Title} key={x.Id}>
                          {x.Title}
                        </Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
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
                  {isModalOpen?.type === MODAL_TYPE.DETAIL ? (
                    <div>{isModalOpen?.content?.Title}</div>
                  ) : (
                    <Input />
                  )}
                </Form.Item>
                <Form.Item label='Người hỏi' name='AskedPersonName'>
                  {isModalOpen?.type === MODAL_TYPE.DETAIL ? (
                    <div>{isModalOpen?.content?.AskedPersonName}</div>
                  ) : (
                    <Input />
                  )}
                </Form.Item>
                <Form.Item label='Cơ quan' name='Department'>
                  {isModalOpen?.type === MODAL_TYPE.DETAIL ? (
                    <div>{isModalOpen?.content?.Department}</div>
                  ) : (
                    <Input />
                  )}
                </Form.Item>
                <Form.Item label='Địa chỉ' name='Address'>
                  {isModalOpen?.type === MODAL_TYPE.DETAIL ? (
                    <div>{isModalOpen?.content?.Address}</div>
                  ) : (
                    <Input />
                  )}
                </Form.Item>
                <Form.Item label='Điện thoại' name='Phone'>
                  {isModalOpen?.type === MODAL_TYPE.DETAIL ? (
                    <div>{isModalOpen?.content?.Phone}</div>
                  ) : (
                    <Input />
                  )}
                </Form.Item>
                <Form.Item label='Email' name='Email'>
                  {isModalOpen?.type === MODAL_TYPE.DETAIL ? (
                    <div>{isModalOpen?.content?.Email}</div>
                  ) : (
                    <Input />
                  )}
                </Form.Item>
                <Form.Item label='Ngày gửi câu hỏi' name='QuestionDate'>
                  {isModalOpen?.type === MODAL_TYPE.DETAIL ? (
                    <div>
                      {moment(isModalOpen?.content?.QuestionDate).format(
                        'DD/MM/YYYY'
                      )}
                    </div>
                  ) : (
                    <DatePicker
                      placeholder='Ngày gửi câu hỏi'
                      style={{ width: '100%' }}
                    />
                  )}
                </Form.Item>
                <Form.Item
                  style={{ marginBottom: 0 }}
                  name='IsNoticed'
                  valuePropName='checked'
                  label={'Câu hỏi chú ý'}
                >
                  {isModalOpen?.type === MODAL_TYPE.DETAIL ? (
                    <Checkbox
                      checked={isModalOpen?.content?.IsNoticed}
                    ></Checkbox>
                  ) : (
                    <Checkbox></Checkbox>
                  )}
                </Form.Item>
                <Form.Item label='Nội dung văn bản' name='QuestionContent'>
                  {isModalOpen?.type === MODAL_TYPE.DETAIL ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: isModalOpen?.content?.QuestionContent,
                      }}
                    ></div>
                  ) : (
                    <CKEditor
                      initData={questionDetail?.QuestionContent}
                      // onChange={onEditorChange}
                      config={{
                        language: 'vi',
                        toolbarGroups: [
                          {
                            name: 'document',
                            groups: ['mode', 'document', 'doctools'],
                          },
                          { name: 'clipboard', groups: ['clipboard', 'undo'] },
                          {
                            name: 'editing',
                            groups: [
                              'find',
                              'selection',
                              'spellchecker',
                              'editing',
                            ],
                          },
                          { name: 'forms', groups: ['forms'] },
                          '/',
                          '/',
                          {
                            name: 'basicstyles',
                            groups: ['basicstyles', 'cleanup'],
                          },
                          {
                            name: 'paragraph',
                            groups: [
                              'list',
                              'indent',
                              'blocks',
                              'align',
                              'bidi',
                              'paragraph',
                            ],
                          },
                          { name: 'links', groups: ['links'] },
                          { name: 'insert', groups: ['insert'] },
                          '/',
                          { name: 'styles', groups: ['styles'] },
                          { name: 'colors', groups: ['colors'] },
                          { name: 'tools', groups: ['tools'] },
                          { name: 'others', groups: ['others'] },
                          { name: 'about', groups: ['about'] },
                        ],
                        extraPlugins: 'justify,font,colorbutton,forms, image2',
                        removeButtons: 'Scayt,HiddenField,CopyFormatting,About',
                      }}
                    />
                  )}
                </Form.Item>
              </Col>

              <Col>
                <div
                  style={{
                    marginBottom: 20,
                  }}
                >
                  <b>Thông tin trả lời</b>
                </div>

                <Form.Item
                  label='Người trả lời'
                  name='AnswerPersonName'
                  style={
                    isModalOpen?.type === MODAL_TYPE.DETAIL
                      ? { width: 300 }
                      : {}
                  }
                >
                  {isModalOpen?.type === MODAL_TYPE.DETAIL ? (
                    <div style={{ marginLeft: 5 }}>
                      {isModalOpen?.content?.AnswerPersonName}
                    </div>
                  ) : (
                    <Input />
                  )}
                </Form.Item>
                <Form.Item
                  label='Nội dung trả lời'
                  name='AnswerContent'
                  style={
                    isModalOpen?.type === MODAL_TYPE.DETAIL
                      ? { width: 300 }
                      : {}
                  }
                >
                  {isModalOpen?.type === MODAL_TYPE.DETAIL ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: isModalOpen?.content?.AnswerContent,
                      }}
                    ></div>
                  ) : (
                    <CKEditor
                      initData={questionDetail?.AnswerContent}
                      // onChange={onEditorChange}
                      config={{
                        language: 'vi',
                        toolbarGroups: [
                          {
                            name: 'document',
                            groups: ['mode', 'document', 'doctools'],
                          },
                          { name: 'clipboard', groups: ['clipboard', 'undo'] },
                          {
                            name: 'editing',
                            groups: [
                              'find',
                              'selection',
                              'spellchecker',
                              'editing',
                            ],
                          },
                          { name: 'forms', groups: ['forms'] },
                          '/',
                          '/',
                          {
                            name: 'basicstyles',
                            groups: ['basicstyles', 'cleanup'],
                          },
                          {
                            name: 'paragraph',
                            groups: [
                              'list',
                              'indent',
                              'blocks',
                              'align',
                              'bidi',
                              'paragraph',
                            ],
                          },
                          { name: 'links', groups: ['links'] },
                          { name: 'insert', groups: ['insert'] },
                          '/',
                          { name: 'styles', groups: ['styles'] },
                          { name: 'colors', groups: ['colors'] },
                          { name: 'tools', groups: ['tools'] },
                          { name: 'others', groups: ['others'] },
                          { name: 'about', groups: ['about'] },
                        ],
                        extraPlugins: 'justify,font,colorbutton,forms',
                        removeButtons: 'Scayt,HiddenField,CopyFormatting,About',
                      }}
                    />
                  )}
                </Form.Item>
                <Form.Item
                  label='Ngày trả lời'
                  name='AnswerDate'
                  style={
                    isModalOpen?.type === MODAL_TYPE.DETAIL
                      ? { width: 300 }
                      : {}
                  }
                >
                  {isModalOpen?.type === MODAL_TYPE.DETAIL ? (
                    <div>
                      {moment(isModalOpen?.content?.AnswerDate).format(
                        'DD/MM/YYYY'
                      )}
                    </div>
                  ) : (
                    <DatePicker
                      placeholder='Ngày trả lời'
                      style={{ width: '100%' }}
                    />
                  )}
                </Form.Item>
                <Form.Item
                  name='lb-attachment'
                  label='Tệp đính kèm'
                  style={
                    isModalOpen?.type === MODAL_TYPE.DETAIL
                      ? { width: 300 }
                      : {}
                  }
                >
                  {isModalOpen?.type === MODAL_TYPE.DETAIL ? (
                    <a
                      href={imageHelper.getLinkImageUrl(
                        isModalOpen?.content?.FilePath
                      )}
                    >
                      {imageHelper.getNameFile(isModalOpen?.content?.FilePath)}
                    </a>
                  ) : (
                    <Upload
                      listType='picture'
                      maxCount={1}
                      fileList={fileListAttachment}
                      onChange={handleChangeAttachment}
                      customRequest={commonFunc.dummyRequest}
                      style={{
                        left: 20,
                      }}
                    >
                      {fileListAttachment.length < 1 ? (
                        <Button icon={<UploadOutlined />}>Tải lên Tệp</Button>
                      ) : null}
                    </Upload>
                  )}
                </Form.Item>
              </Col>
            </Row>
            {/* <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="Tạo mới">
              {isModalOpen?.type === MODAL_TYPE.CREATE ? "Tạo mới" : "Lưu"}
            </Button>
          </Form.Item> */}
          </Form>
        </Modal>
      ) : null}
      <div className={cx('top')}>
        <QuestionListPageSearch
          setTextSearch={handleChangeTextSearch}
          onCreate={() => {
            setIsModalOpen({
              id: null,
              show: true,
              type: POPUP_TYPE.CREATE,
            });
          }}
          dataCategoryQuestion={dataCategoryQuestion}
        />
      </div>
      <Divider style={{ margin: '0' }} />
      <div className={cx('table-data')}>
        <QuestionListTableData
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

export default QuestionListPage;
