import { FileAddFilled, PlusOutlined, UploadOutlined } from '@ant-design/icons';
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
  TreeSelect,
  Upload,
} from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { Option } from 'antd/lib/mentions';
import { TreeNode } from 'antd/lib/tree-select';
import documentApi from 'apis/documentApi';
import { CKEditor } from 'ckeditor4-react';
import classNames from 'classnames/bind';
import commonFunc from 'common/commonFunc';
import { Direction, NotificationType } from 'common/enum';
import convertHelper from 'helpers/convertHelper';
import datetimeHelper from 'helpers/datetimeHelper';
import { openNotification } from 'helpers/notification';
import { useEffect, useRef, useState } from 'react';
import styles from './DocumentListPage.module.scss';
import DocumentListPageSearch from './DocumentListPageSearch/DocumentListPageSearch';
import DocumentListTableData from './DocumentListTableData/DocumentListTableData';
import { TypeUpdate, DEFAULT_COLUMN_ORDER_BY } from 'common/constant';
import PopupUpdateDocuments from './PopupUpdateDocuments/PopupUpdateDocuments';
import PopupDocumentDetail from './PopupDocumentDetail/PopupDocumentDetail';
import Loading from 'components/Loading/Loading';
const LIMIT_UP_LOAD_FILE = 2_097_152; //2mb
const cx = classNames.bind(styles);

DocumentListPage.propTypes = {};

DocumentListPage.defaultProps = {};

function DocumentListPage(props) {
  const filterAll = {
    currentPage: 1,
    pageSize: 9_999_999,
    direction: Direction.DESC,
    orderBy: DEFAULT_COLUMN_ORDER_BY,
  };

  const [popupUpdate, setPopupUpdate] = useState({
    id: null,
    show: false,
  });
  const [documentSelected, setDocumentSelected] = useState({
    id: null,
    show: false,
  });
  const [newsData, setNewsData] = useState({});
  const [objFilter, setObjFilter] = useState({
    currentPage: 1,
    pageSize: 10,
    direction: Direction.DESC,
    orderBy: DEFAULT_COLUMN_ORDER_BY,
    keyword: '',
  });
  const isFirstCall = useRef(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataFilter, setDataFilter] = useState({
    categoryAll: [],
    sourceAll: [],
    fieldAll: [],
    singerAll: [],
  });
  const [fileListAttachment, setFileListAttachment] = useState([]);
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(true);

  useEffect(() => {
    if (isFirstCall.current) {
      isFirstCall.current = false;
      getDataFilter();
      // return;
    }
    fetchList();
  }, [objFilter]);

  const fetchList = async () => {
    try {
      setConfirmLoading(true);
      const response = await documentApi.getDocumentAll(objFilter);
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
    try {
      setConfirmLoading(true);
      // loại văn bản
      const responseCategoryAll = documentApi.getDocumentCategoryAll(filterAll);
      //Cơ quan ban hành
      const responseSourceAll = documentApi.getDocumentSourceAll(filterAll);
      //Lĩnh vực
      const responseFieldAll = documentApi.getDocumentFieldAll(filterAll);
      // Người ký
      const responseSingerAll = documentApi.getDocumentSingerAll(filterAll);
      Promise.all([
        responseCategoryAll,
        responseSourceAll,
        responseFieldAll,
        responseSingerAll,
      ]).then((values) => {
        setDataFilter({
          categoryAll: values[0]?.PagedData?.Results ?? [],
          sourceAll: values[1]?.PagedData?.Results ?? [],
          fieldAll: values[2]?.PagedData?.Results ?? [],
          singerAll: values[3]?.PagedData?.Results ?? [],
        });
      });
    } catch (error) {
    } finally {
      setConfirmLoading(false);
    }
  };

  function onEditorChange(event) {
    // console.log('data: ', event.editor.getData());
  }

  const handleChangeAttachment = ({ fileList: newFileList }) => {
    setFileListAttachment(newFileList);
  };

  const renderFieldNews = (
    <Select
      placeholder='Lĩnh vực'
      style={{ width: '100%' }}
      allowClear={true}
      showSearch
    >
      {dataFilter?.fieldAll?.map((x) => (
        <Option value={x.Title} key={x.Id}>
          {x.Title}
        </Option>
      ))}
    </Select>
  );

  const renderSourceNews = (
    <Select
      placeholder='Loại văn bản'
      style={{ width: '100%' }}
      showSearch
      allowClear
    >
      {dataFilter?.categoryAll?.map((x) => (
        <Option value={x.Title} key={x.Id}>
          {x.Title}
        </Option>
      ))}
    </Select>
  );

  const renderSingerNews = (
    <Select
      placeholder='Nguồn tin'
      style={{ width: '100%' }}
      allowClear={true}
      showSearch
    >
      {dataFilter?.singerAll?.map((x) => (
        <Option value={x.Title} key={x.Id}>
          {x.Title}
        </Option>
      ))}
    </Select>
  );

  const generateTree = (arrNode) => {
    return arrNode.map((x) => (
      <TreeNode value={x.Title} title={x.Title} key={x.Id}>
        {x.children.length > 0 && generateTree(x.children)}
      </TreeNode>
    ));
  };

  const renderCategoryNews = (
    <TreeSelect
      showSearch
      style={{
        width: '100%',
      }}
      // value={valueNewsType}
      dropdownStyle={{
        maxHeight: 400,
        overflow: 'auto',
      }}
      placeholder='Chọn loại tin tức'
      allowClear
      treeDefaultExpandAll
      // onChange={onChangeNewsType}
    >
      {generateTree(commonFunc.list_to_tree(dataFilter?.sourceAll ?? []))}
    </TreeSelect>
  );
  const onCancel = () => {
    setIsModalOpen(false);
  };
  const onCreate = async (values) => {
    try {
      var formData = new FormData();
      formData.append('JsonString', convertHelper.Serialize(values.JsonString));

      if (values.FileAttachment) {
        formData.append('FileAttachment', values.FileAttachment);
      }
      setIsModalOpen(false);
      setConfirmLoading(true);
      await documentApi.insertDocument(formData);
      openNotification('Tạo mới tin thành công');
      fetchList();
    } catch (error) {
      openNotification('Tạo mới tin thất bại', '', NotificationType.ERROR);
    } finally {
      setConfirmLoading(false);
    }
  };
  const showModal = () => {
    setIsModalOpen(true);
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
      await documentApi.deleteDocument(id);
      openNotification('Xóa nguồn tin thành công');
      fetchList();
    } catch (error) {
      openNotification('Xóa nguồn tin thất bại', '', NotificationType.ERROR);
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleUpdateStatusNew = async (values) => {
    try {
      setConfirmLoading(true);
      await documentApi.updatStatusDocument({
        Ids: [values.Id],
        Value: values.Status === 0 ? 1 : 0,
        Field: TypeUpdate.STATUS,
      });
      fetchList();
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

  return (
      <div className={cx('wrapper')}>
          <Loading show={confirmLoading} />

          <Modal
              open={isModalOpen}
              title='Tạo mới văn bản'
              okText='Thêm mới'
              cancelText='Thoát'
              onCancel={onCancel}
              width={1300}
              centered
              onOk={() => {
                  form.validateFields()
                      .then((values) => {
                          values.content = values.Content?.editor?.getData();
                          const date = values?.PublishedDate?._d ?? '0001-01-01 00:00:00.0000000';
                          const publishedDate = datetimeHelper.formatDatetimeToDateSerer(date);
                          const { Code, Name, DocumentDepartmentId, DocumentFieldId, DocumentSignPersonId, DocumentTypeId, content, IsDocumentSection } = values;
                          const bodyData = {
                              Code,
                              Name,
                              content,
                              PublishedDate: publishedDate,
                              IsDocumentSection,
                          };
                          if (DocumentDepartmentId) {
                              bodyData.DocumentDepartmentId = parseInt(dataFilter?.sourceAll.find((x) => x.Title === DocumentDepartmentId)?.Id ?? '0');
                          }
                          if (DocumentFieldId) {
                              bodyData.DocumentFieldId = parseInt(dataFilter?.fieldAll.find((x) => x.Title === DocumentFieldId)?.Id ?? '0');
                          }
                          if (DocumentSignPersonId) {
                              bodyData.DocumentSignPersonId = parseInt(dataFilter?.singerAll.find((x) => x.Title === DocumentSignPersonId)?.Id ?? '0');
                          }
                          if (DocumentTypeId) {
                              bodyData.DocumentTypeId = parseInt(dataFilter?.categoryAll.find((x) => x.Title === DocumentTypeId)?.Id ?? '0');
                          }
                          let body = { JsonString: bodyData };

                          if (fileListAttachment.length > 0) {
                              const file = fileListAttachment[0].originFileObj;
                              if (file.size > LIMIT_UP_LOAD_FILE) {
                                  openNotification('File đính kèm đã lớn hơn 2MB', '', NotificationType.ERROR);
                                  return;
                              }
                              body.FileAttachment = file;
                          }
                          form.resetFields();
                          setFileListAttachment([]);
                          onCreate(body);
                      })
                      .catch((info) => {
                          console.log('Validate Failed:', info);
                      });
              }}
          >
              <Form
                  form={form}
                  // size={'small'}
                  // layout='vertical'
                  name='form_in_modal'
                  labelCol={{ span: 2 }}
                  // wrapperCol={{ span: 21 }}
                  initialValues={{
                      modifier: 'public',
                      IsDocumentSection: false,
                  }}
              >
                  <Form.Item
                      label={
                          <span>
                              <span style={{ color: 'red' }}>* </span>Số ký hiệu
                          </span>
                      }
                  >
                      <Row gutter={8} justify={'space-between'}>
                          <Col span={7}>
                              <Form.Item
                                  style={{ marginBottom: 0 }}
                                  name='Code'
                                  rules={[
                                      {
                                          required: true,
                                          message: 'Số ký hiệu không được để trống',
                                      },
                                  ]}
                              >
                                  <Input />
                              </Form.Item>
                          </Col>
                          <Col span={7}>
                              <Form.Item style={{ marginBottom: 0 }} label='Cơ quan ban hành' name='DocumentDepartmentId'>
                                  {renderCategoryNews}
                              </Form.Item>
                          </Col>
                          <Col span={7}>
                              <Form.Item style={{ marginBottom: 0 }} label='Lĩnh vực' name='DocumentFieldId'>
                                  {renderFieldNews}
                              </Form.Item>
                          </Col>
                      </Row>
                  </Form.Item>

                  <Form.Item label='Loại văn bản'>
                      <Row gutter={8} justify={'space-between'}>
                          <Col span={7}>
                              <Form.Item style={{ marginBottom: 0 }} name='DocumentTypeId'>
                                  {renderSourceNews}
                              </Form.Item>
                          </Col>
                          <Col span={7}>
                              <Form.Item name='PublishedDate' label='Ngày phát hành' style={{ marginBottom: 0 }}>
                                  <DatePicker style={{ width: '100%' }} />
                              </Form.Item>
                          </Col>
                          <Col span={7}>
                              <Form.Item style={{ marginBottom: 0 }} label='Người ký' name='DocumentSignPersonId'>
                                  {renderSingerNews}
                              </Form.Item>
                          </Col>
                      </Row>
                  </Form.Item>

                  <Form.Item name='Name' label='Trích yếu' style={{ marginBottom: 0 }}>
                      <TextArea
                          showCount
                          style={{
                              height: 80,
                          }}
                      />
                  </Form.Item>
                  <Form.Item name='Content' label='Nội dung'>
                      <CKEditor
                          initData='<p>Nội dung</p>'
                          // onInstanceReady={() => {
                          //     alert('Editor is ready!');
                          // }}
                          onChange={onEditorChange}
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
                                      groups: ['find', 'selection', 'spellchecker', 'editing'],
                                  },
                                  { name: 'forms', groups: ['forms'] },
                                  '/',
                                  '/',
                                  { name: 'basicstyles', groups: ['basicstyles', 'cleanup'] },
                                  {
                                      name: 'paragraph',
                                      groups: ['list', 'indent', 'blocks', 'align', 'bidi', 'paragraph'],
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
                              extraPlugins: 'justify,font,colorbutton,forms,image2',
                              removeButtons: 'Scayt,HiddenField,CopyFormatting,About',
                              allowedContent: true,
                          }}
                      />
                  </Form.Item>
                  <Form.Item name='lb-attachment' label='Tệp đính kèm'>
                      <Row gutter={8}>
                          <Col span={8}>
                              <Upload listType='picture' maxCount={1} fileList={fileListAttachment} onChange={handleChangeAttachment} customRequest={commonFunc.dummyRequest}>
                                  {fileListAttachment.length < 1 ? <Button icon={<UploadOutlined />}>Tải lên Tệp</Button> : null}
                              </Upload>
                          </Col>
                          <Col span={8}>
                              <Form.Item name='IsDocumentSection' valuePropName='checked' label={'Thông tin chung'}>
                                  <Checkbox></Checkbox>
                              </Form.Item>
                          </Col>
                      </Row>
                  </Form.Item>
              </Form>
          </Modal>

          <div className={cx('top')}>
              <DocumentListPageSearch setTextSearch={handleChangeTextSearch} />
              <div>
                  <Button type='primary' icon={<FileAddFilled />} onClick={showModal}>
                      Tạo mới
                  </Button>
              </div>
          </div>
          <Divider style={{ margin: '0' }} />
          <div className={cx('table-data')}>
              <DocumentListTableData
                  data={newsData}
                  setPagination={handleChangePagination}
                  deleteSourceNew={handleDeleteSourceNew}
                  updateStatusNew={handleUpdateStatusNew}
                  onClickEdit={(id) => {
                      setPopupUpdate({
                          id: id,
                          show: true,
                      });
                  }}
                  onClickRow={(item) => {
                      setDocumentSelected({
                          id: item?.Id,
                          show: true,
                      });
                  }}
              />
          </div>
          {(popupUpdate?.id || popupUpdate?.id === 0) && popupUpdate?.show ? (
              <PopupUpdateDocuments
                  onSuccess={() => {
                      setPopupUpdate({
                          id: null,
                          show: false,
                      });
                      fetchList();
                  }}
                  Id={popupUpdate?.id}
                  onCancel={() => {
                      setPopupUpdate({
                          id: null,
                          show: false,
                      });
                  }}
              />
          ) : null}

          {(documentSelected?.id || documentSelected?.id === 0) && documentSelected?.show ? (
              <PopupDocumentDetail
                  Id={documentSelected?.id}
                  onCancel={() =>
                      setDocumentSelected({
                          id: null,
                          show: false,
                      })
                  }
              />
          ) : null}
      </div>
  );
}

export default DocumentListPage;
