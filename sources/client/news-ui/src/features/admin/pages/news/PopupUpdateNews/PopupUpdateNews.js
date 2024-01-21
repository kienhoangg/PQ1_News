import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Radio,
  Row,
  Select,
  TreeSelect,
  Upload,
} from 'antd';
import classNames from 'classnames/bind';
import { TreeNode } from 'antd/lib/tree-select';
import {
  FileImageFilled,
  PlusOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import TextArea from 'antd/lib/input/TextArea';
import { Option } from 'antd/lib/mentions';
import { CKEditor } from 'ckeditor4-react';
import { useState } from 'react';
import { openNotification } from 'helpers/notification';
import { Direction, NotificationType } from 'common/enum';
import datetimeHelper from 'helpers/datetimeHelper';
import { useEffect } from 'react';
import commonFunc from 'common/commonFunc';
import newsApi from 'apis/newsApi';
import axiosClient from 'apis/axiosClient';
import moment from 'moment';
import { envDomainBackend } from 'common/enviroments';
import convertHelper from 'helpers/convertHelper';
import documentApi from 'apis/documentApi';
import { DEFAULT_COLUMN_ORDER_BY } from 'common/constant';

/**
 * Popup chỉnh sửa bài viết
 * @author TDBA (24/10/2022)
 */
const PopupUpdateNews = ({ idNews, onSuccess, onCancel }) => {
  const LIMIT_UP_LOAD_FILE = 2_097_152; //2mb
  const [form] = Form.useForm();

  const [newsDetail, setNewsDetail] = useState({});

  const [dataFilter, setDataFilter] = useState({
    categoryNews: [],
    fieldNews: [],
    sourceNews: [],
    collaborators: [],
  });
  const [fileList, setFileList] = useState([]);
  const [fileListAttachment, setFileListAttachment] = useState([]);

  function onEditorChange(event) {
    setNewsDetail({
      ...newsDetail,
      Content: event.editor.getData(),
    });
  }

  useEffect(() => {
    calllApiGetDataMaster();
  }, []);

  const onUpdate = async (values) => {
    try {
      var formData = new FormData();
      formData.append('JsonString', convertHelper.Serialize(values.JsonString));

      if (values.FileAttachment) {
        formData.append('FileAttachment', values.FileAttachment);
      }

      if (values.Avatar) {
        formData.append('Avatar', values.Avatar);
      }
      await newsApi.updatNewsByID(idNews, formData);
      openNotification('Cập nhật tin tức thành công');
      onSuccess();
    } catch (error) {
      openNotification('Cập nhật tin tức thất bại', '', NotificationType.ERROR);
    }
  };

  /**
   * Gọi Api lấy danh chi tiết bài viết
   * @author TDBA (24/10/2022)
   */
  const callApiGetDetailNews = async (id) => {
    if (!id) return;
    try {
      const res = await axiosClient.get('/newspost/' + id);
      setNewsDetail(res);

      res?.Avatar &&
        setFileList([
          {
            isFileFormServer: true,
            uid: '1',
            name: res?.Avatar,
            status: 'done',
            url:
              res?.Avatar?.indexOf('https://') === 0 ||
              res?.Avatar?.indexOf('http://') === 0
                ? res?.Avatar
                : envDomainBackend +
                  (res?.Avatar?.indexOf('/') === 0
                    ? res?.Avatar
                    : '/' + res?.Avatar),
          },
        ]);

      res?.FilePath &&
        setFileListAttachment([
          {
            isFileFormServer: true,
            uid: '1',
            name: res?.FilePath,
            status: 'done',
            url:
              res?.FilePath?.indexOf('https://') === 0 ||
              res?.FilePath?.indexOf('http://') === 0
                ? res?.FilePath
                : envDomainBackend +
                  (res?.FilePath?.indexOf('/') === 0
                    ? res?.FilePath
                    : '/' + res?.FilePath),
          },
        ]);

      form?.setFieldsValue({
        category: res?.CategoryNews?.CategoryNewsName,
        title: res?.Title,
        publishedDate: moment(res?.CreatedDate),
        IsDocumentNews: res?.IsDocumentNews,
        IsNewsHot: res?.IsHotNews,
        IsNewsVideo: res?.IsVideoNews,
        IsDisplayTitle: res?.IsShowTitle,
        IsComment: res?.IsShowComment,
        avatarTitle: res?.AvatarTitle,
        description: res?.Description,
        field: res?.FieldNews?.Title,
        source: res?.SourceNews?.Title,
        collaboratorId: res?.Collaborator?.Name,
        content: res?.Content,
      });
    } catch (err) {}
  };

  const calllApiGetDataMaster = () => {
    const filterAll = {
      currentPage: 1,
      pageSize: 9_999_999,
      direction: Direction.DESC,
      orderBy: DEFAULT_COLUMN_ORDER_BY,
    };

    const responseCategoryNews = newsApi.getNewsCategoryAll(filterAll);
    const responseFieldNews = newsApi.getNewsFieldAll(filterAll);
    const responseSourceNews = newsApi.getNewsSourceAll(filterAll);
    const responseCollaborators = newsApi.getNewsCollaboratorsAll(filterAll);
    Promise.all([
      responseCategoryNews,
      responseFieldNews,
      responseSourceNews,
      responseCollaborators,
    ]).then((values) => {
      setDataFilter({
        categoryNews: values[0]?.PagedData?.Results ?? [],
        fieldNews: values[1]?.PagedData?.Results ?? [],
        sourceNews: values[2]?.PagedData?.Results ?? [],
        collaborators: values[3]?.PagedData?.Results ?? [],
      });
      callApiGetDetailNews(idNews);
    });
  };

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const handleChangeAttachment = ({ fileList: newFileList }) => {
    setFileListAttachment(newFileList);
  };

  const uploadButton = (
    <Button icon={<UploadOutlined />}>Tải lên ảnh đại diện</Button>
  );

  const renderFieldNews = (
    <Select
      placeholder='Lĩnh vực'
      style={{ width: '100%' }}
      showSearch
      allowClear
    >
      {dataFilter?.fieldNews?.map((x) => (
        <Option value={x.Title} key={x.Id}>
          {x.Title}
        </Option>
      ))}
    </Select>
  );

  const renderSourceNews = (
    <Select
      placeholder='Nguồn tin'
      style={{ width: '100%' }}
      showSearch
      allowClear
    >
      {dataFilter?.sourceNews?.map((x) => (
        <Option value={x.Title} key={x.Id}>
          {x.Title}
        </Option>
      ))}
    </Select>
  );

  const renderCollaborators = (
    <Select
      placeholder='Tác giả'
      style={{ width: '100%' }}
      showSearch
      allowClear
    >
      {dataFilter?.collaborators?.map((x) => (
        <Option value={x.Name} key={x.Id}>
          {x.Name}
        </Option>
      ))}
    </Select>
  );

  const generateTree = (arrNode) => {
    return arrNode.map((x) => (
      <TreeNode
        value={x.CategoryNewsName}
        title={x.CategoryNewsName}
        key={x.Id}
      >
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
      dropdownStyle={{
        maxHeight: 400,
        overflow: 'auto',
      }}
      placeholder='Chọn loại tin tức'
      allowClear
      treeDefaultExpandAll
      // onChange={(res) => console.log(res)}
    >
      {generateTree(commonFunc.list_to_tree(dataFilter?.categoryNews ?? []))}
    </TreeSelect>
  );

  return (
    <div className='popup-update-news'>
      {newsDetail?.Id ? (
        <Modal
          open={true}
          title='Chỉnh sửa tin tức'
          okText='Cập nhật'
          cancelText='Thoát'
          onCancel={() => {
            onCancel();
          }}
          width={1300}
          centered
          onOk={() => {
            form
              .validateFields()
              .then((values) => {
                values.content = values.content?.editor?.getData();
                const date = values?.publishedDate?._d ?? new Date();
                const publishedDate =
                  datetimeHelper.formatDatetimeToDateSerer(date);
                const {
                  collaboratorId,
                  category,
                  title,
                  IsDocumentNews,
                  IsNewsHot,
                  IsNewsVideo,
                  IsDisplayTitle,
                  IsDisplayAvatar,
                  IsComment,
                  avatarTitle,
                  description,
                  field,
                  source,
                } = values;
                let bodyData = {
                  Title: title,
                  IsDocumentNews: IsDocumentNews,
                  IsHotNews: IsNewsHot,
                  IsVideoNews: IsNewsVideo,
                  IsShowTitle: IsDisplayTitle,
                  IsShowAvatar: IsDisplayAvatar,
                  IsShowComment: IsComment,
                  AvatarTitle: avatarTitle,
                  Description: description,
                  Content: newsDetail?.Content,
                  PublishedDate: publishedDate,
                };
                if (field) {
                  bodyData.FieldNewsId =
                    dataFilter?.fieldNews.find((x) => x.Title === field)?.Id ??
                    undefined;
                }
                if (source) {
                  bodyData.SourceNewsId =
                    dataFilter?.sourceNews.find((x) => x?.Title === source)
                      ?.Id ?? undefined;
                }
                if (category) {
                  bodyData.CategoryNewsId =
                    dataFilter?.categoryNews.find(
                      (x) => x?.CategoryNewsName === category
                    )?.Id ?? undefined;
                }
                if (collaboratorId) {
                  bodyData.CollaboratorId =
                    dataFilter?.collaborators.find(
                      (x) => x?.Name === collaboratorId
                    )?.Id ?? undefined;
                }

                let body = { JsonString: bodyData };

                if (fileList.length > 0 && !fileList?.[0]?.isFileFormServer) {
                  const file = fileList[0].originFileObj;
                  if (file.size > LIMIT_UP_LOAD_FILE) {
                    openNotification(
                      'File ảnh đã lớn hơn 2MB',
                      '',
                      NotificationType.ERROR
                    );
                    return;
                  }
                  body.Avatar = file;

                  delete bodyData?.Avatar;
                } else if (
                  fileList?.[0]?.isFileFormServer &&
                  fileList.length > 0
                ) {
                  bodyData = {
                    ...bodyData,
                    Avatar: newsDetail?.Avatar,
                  };
                }

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
                    FilePath: newsDetail?.FilePath,
                  };
                }

                body = { ...body, JsonString: bodyData };

                // form.resetFields();
                // setFileList([]);
                // setFileListAttachment([]);
                onUpdate(body);
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
              IsDocumentNews: false,
              IsNewsHot: false,
              IsNewsVideo: false,
              IsDisplayTitle: false,
              IsDisplayAvatar: false,
              IsComment: false,
            }}
          >
            <Form.Item label='Danh mục'>
              <Row gutter={8}>
                <Col span={5}>
                  <Form.Item style={{ marginBottom: 0 }} name='category'>
                    {renderCategoryNews}
                  </Form.Item>
                </Col>
                <Col span={13}>
                  <Form.Item
                    style={{ marginBottom: 0 }}
                    name='title'
                    label='Tiêu đề'
                    rules={[
                      {
                        required: true,
                        message: 'Nhập tiêu đề',
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                {/* <Col span={6}>
                  <Form.Item
                    name="publishedDate"
                    label="Ngày tạo"
                    style={{ marginBottom: 0 }}
                  >
                    <DatePicker
                      placeholder="Ngày tạo"
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </Col> */}
              </Row>
            </Form.Item>
            <Form.Item label='Tin nổi bật'>
              <Row gutter={8}>
                <Col span={4}>
                  <Form.Item
                    style={{ marginBottom: 0 }}
                    name='IsDocumentNews'
                    valuePropName='checked'
                  >
                    <Checkbox></Checkbox>
                  </Form.Item>
                </Col>
                {/* <Col span={4}>
              <Form.Item
                style={{ marginBottom: 0 }}
                name='IsNewsHot'
                valuePropName='checked'
                label={'Tin nổi bật'}
              >
                <Checkbox></Checkbox>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item
                style={{ marginBottom: 0 }}
                name='IsNewsVideo'
                valuePropName='checked'
                label={'Tin video'}
              >
                <Checkbox></Checkbox>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item
                style={{ marginBottom: 0 }}
                name='IsDisplayTitle'
                valuePropName='checked'
                label='Hiển thị tiêu đề'
              >
                <Checkbox></Checkbox>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item
                style={{ marginBottom: 0 }}
                name='IsDisplayAvatar'
                valuePropName='checked'
                label='Hình ảnh đại diện'
              >
                <Checkbox></Checkbox>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item
                style={{ marginBottom: 0 }}
                name='IsComment'
                valuePropName='checked'
                label='Bình luận'
              >
                <Checkbox></Checkbox>
              </Form.Item>
            </Col> */}
              </Row>
            </Form.Item>

            <Form.Item name='lb-avatar' label='Ảnh đại diện'>
              <Row gutter={8}>
                <Col span={8}>
                  <Upload
                    listType='picture'
                    maxCount={1}
                    fileList={fileList}
                    // onPreview={handlePreview}
                    onChange={handleChange}
                    accept='.jpg,.png,.jpeg'
                    customRequest={commonFunc.dummyRequest}
                  >
                    {fileList.length < 1 ? uploadButton : null}
                  </Upload>
                </Col>
                <Col span={16}>
                  <Form.Item
                    style={{ marginBottom: 0 }}
                    name='avatarTitle'
                    label='Tiêu đề ảnh'
                    rules={[
                      {
                        required: true,
                        message: 'Nhập tiêu đề ảnh',
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
            </Form.Item>

            <Form.Item
              name='description'
              label='Mô tả'
              style={{ marginBottom: 0 }}
            >
              <TextArea
                showCount
                maxLength={256}
                style={{
                  height: 80,
                }}
              />
            </Form.Item>
            <Form.Item name='content' label='Nội dung'>
              <CKEditor
                initData={newsDetail?.Content}
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
                  extraPlugins: 'justify,font,colorbutton,forms,image2',
                  removeButtons: 'Scayt,HiddenField,CopyFormatting,About',
                }}
              />
            </Form.Item>
            <Form.Item
              name='lb-avatar'
              label='Lĩnh vực'
              style={{ marginBottom: 0 }}
            >
              <Row gutter={16}>
                <Col span={6}>
                  <Form.Item name='field'>{renderFieldNews}</Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name='source' label='Nguồn tin'>
                    {renderSourceNews}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name='collaboratorId' label='Tác giả'>
                    {renderCollaborators}
                  </Form.Item>
                </Col>
              </Row>
            </Form.Item>
            <Form.Item name='lb-attachment' label='Tệp đính kèm'>
              <Row gutter={8}>
                <Col span={8}>
                  <Upload
                    listType='picture'
                    maxCount={1}
                    fileList={fileListAttachment}
                    onChange={handleChangeAttachment}
                    customRequest={commonFunc.dummyRequest}
                  >
                    {fileListAttachment.length < 1 ? (
                      <Button icon={<UploadOutlined />}>Tải lên Tệp</Button>
                    ) : null}
                  </Upload>
                </Col>
              </Row>
            </Form.Item>
          </Form>
        </Modal>
      ) : null}
    </div>
  );
};

PopupUpdateNews.propTypes = {};

export default PopupUpdateNews;
