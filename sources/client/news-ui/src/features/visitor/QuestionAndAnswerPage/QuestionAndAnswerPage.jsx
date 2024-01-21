import { Pagination, Select, Table } from "antd";
import React, { useEffect, useRef, useState } from "react";
import "./questionAndAnswerPage.scss";
import IconDot1 from "../../../assets/icons/icon-dot-1.png";
import { openNotification } from "helpers/notification";
import { NotificationType } from "common/enum";
import axiosClient from "apis/axiosClient";
import moment from "moment";
import ScrollToTop from "components/ScrollToTop/ScrollToTop";

/**
 * Màn hình hỏi đáp
 * @auhtor TDBA (11/10/2022)
 */
function QuestionAndAnswerPage() {
  const DATA_FORM_DEFAULT = {
    fullName: "", // Họ và tên
    phoneNumber: "", // Số điện thoại
    address: "", // Địa chỉ
    email: "", // Email
    field: "", // Lĩnh vực
    title: "", // Tiêu đề
    content: "", // Nội dung
    fileUpload: "", // File cập nhật
  };

  const [dataQuestionMaster, setDataQuestionMaster] = useState({
    NewQuestions: [],
    MostViewQuestions: [],
  });

  const [dataForm, setDataForm] = useState(DATA_FORM_DEFAULT); // Dữ liệu form
  const [inputFile, setInputFile] = useState(new Date());
  const [questionCategories, setQuestionCategories] = useState([]); // Dữ liệu Lĩnh vực câu hỏi
  const [dataQuestionTable, setDataQuestionTable] = useState([]); // Dữ liệu câu hỏi
  const [pageCurrent, setPageCurrent] = useState(1); // Vị trí của trang hiện tại
  const [totalPage, setTotalPage] = useState(0);
  const [warningInput, setWarningInput] = useState({
    fullName: false,
    phoneNumber: false,
    title: false,
    content: false,
  });

  const [fileName, setFileName] = useState("");

  const elInputFile = useRef();
  const formDataRef = useRef(new FormData());
  const elInputRef = useRef([]);

  /**
   * Column của bảng
   * @author TDBA (09/10/2022)
   */
  const COLUMN = [
    {
      title: "STT",
      dataIndex: "INDEX_NUMBER",
      key: "INDEX_NUMBER",
      width: "5%",
    },
    {
      title: "Câu hỏi",
      dataIndex: "QUESTION",
      key: "QUESTION",
    },
    {
      title: "Người hỏi",
      dataIndex: "QUESTIONER",
      key: "QUESTIONER",
      width: "16%",
    },
    {
      title: "Ngày trả lời",
      dataIndex: "RESPONDENT",
      key: "RESPONDENT",
      width: "20%",
    },
    {
      title: "Đơn vị trả lời",
      dataIndex: "ANSWERING_UNIT",
      key: "ANSWERING_UNIT",
      width: "20%",
    },
  ];

  /**
   * Thực hiện callAPI lấy dữ dữ liệu thể loại câu hỏi
   * @author TDBA (16/10/2022)
   */
  useEffect(() => {
    // callApiGetQuestionCategories();
    callApiGetQuestionMaster();
  }, []);

  /**
   * Lấy dữ liệu cho bảng câu hỏi
   * @author TDBA (16/10/2022)
   */
  useEffect(() => {
    callApiGetDataQuestionTable();
  }, [pageCurrent]);

  const LIMIT_UP_LOAD_FILE = 2_097_152; //2mb

  /**
   * THực hiện hành động khi chọn file
   * @author TDBA (16/10/2022)
   */
  const handleChoseFile = (event) => {
    setInputFile(new Date());
    if (event?.target?.files?.[0]) {
      formDataRef.current = new FormData();
      formDataRef.current?.delete("FileAttachment");
      formDataRef.current?.append("FileAttachment", event?.target?.files?.[0]);
      setFileName(event?.target?.files?.[0]?.name);
      if (event?.target?.files?.[0]?.size > LIMIT_UP_LOAD_FILE) {
        openNotification("File ảnh đã lớn hơn 2MB", "", NotificationType.ERROR);
      }
    }
  };

  /**
   * Thực hiện callAPI lấy dữ liệu lĩnh vực câu hỏi
   * @author TDBA (16/10/2022)
   */
  const callApiGetQuestionCategories = async () => {
    try {
      const res = await axiosClient.post("home/questioncategories/filter", {
        pageSize: 1000,
        currentPage: 1,
        direction: -1,
        orderBy: "CreatedDate",
        QuestionStatus: 3,
      });

      setQuestionCategories(
        res?.PagedData?.Results?.map((item) => ({
          value: item?.Id,
          label: item?.Title,
        }))
      );
    } catch (err) {}
  };

  const PAGE_SIZE = 10;

  /**
   * CallAPI lấy dữ liệu câu hỏi
   * @author TDBA (16/10/2022)
   */
  const callApiGetDataQuestionTable = async () => {
    try {
      const res = await axiosClient.post("/home/question/filter", {
        pageSize: PAGE_SIZE,
        currentPage: pageCurrent,
        direction: -1,
        orderBy: "LastModifiedDate",
        direction2ndColumn: -1,
        orderBy2ndColumn: "Order",
        status: 1,
      });

      setDataQuestionTable(res?.PagedData?.Results);
      setTotalPage(res?.PagedData?.RowCount);
    } catch (err) {}
  };

  /**
   * Thực hiện gọi api tạo câu hỏi
   * @author TDBA (16/10/2022)
   */
  const callApiCreateQuestion = async () => {
    try {
      const body = {
        ...(dataForm?.fullName || dataForm?.fullName === 0
          ? { AskedPersonName: dataForm?.fullName }
          : {}),
        ...(dataForm?.address || dataForm?.address === 0
          ? { Address: dataForm?.address }
          : {}),
        ...(dataForm?.phoneNumber || dataForm?.phoneNumber === 0
          ? { Phone: dataForm?.phoneNumber }
          : {}),
        ...(dataForm?.email || dataForm?.email === 0
          ? { Email: dataForm?.email }
          : {}),
        ...(dataForm?.title || dataForm?.title === 0
          ? { Title: dataForm?.title }
          : {}),
        ...(dataForm?.field || dataForm?.field === 0
          ? { QuestionCategoryId: dataForm?.field }
          : {}),
        ...(dataForm?.content || dataForm?.content === 0
          ? { QuestionContent: dataForm?.content }
          : {}),
      };

      formDataRef.current?.delete("JsonString");
      formDataRef.current?.append("JsonString", JSON.stringify(body));
      const res = await axiosClient.post(
        "home/questions",
        formDataRef.current,
        {
          headers: {
            Prefer: "code=200, example=200GetReturn2Record",
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setDataForm(DATA_FORM_DEFAULT);
      elInputRef.current?.map((item) => (item.value = ""));
      formDataRef.current = new FormData();
      setFileName("");
      setWarningInput({
        fullName: false,
        phoneNumber: false,
        title: false,
        content: false,
      });

      openNotification("Gửi câu hỏi thành công", "", NotificationType.SUCCESS);
    } catch (err) {
      openNotification("Gửi câu hỏi thất bại", "", NotificationType.ERROR);
    }
  };

  /**
   * Validate dữ liệu trước khi gửi
   * @author TDBA (16/10/2022)
   */
  const onValidateDate = () => {
    if (
      dataForm?.fullName &&
      dataForm?.phoneNumber &&
      dataForm?.title &&
      dataForm?.content
    ) {
      callApiCreateQuestion();
    } else {
      setWarningInput({
        fullName: dataForm?.fullName ? false : true,
        phoneNumber: dataForm?.phoneNumber ? false : true,
        title: dataForm?.title ? false : true,
        content: dataForm?.content ? false : true,
      });
    }
  };

  /**
   * CallAPI lấy dữ liệu question mới và nhiều lượt xem
   * @author TDBA (16/10/2022)
   */
  const callApiGetQuestionMaster = async () => {
    try {
      const res = await axiosClient.get("/home/question");

      setDataQuestionMaster({
        NewQuestions: res?.NewQuestions,
        MostViewQuestions: res?.MostViewQuestions,
      });

      setQuestionCategories(
        res?.QuestionCategories?.map((item) => ({
          value: item?.Id,
          label: item?.Title,
        }))
      );

      callApiGetDataQuestionTable();
    } catch (err) {}
  };

  /**
   * Thực hiện convert lại dữ liệu cho bảng
   * @param {*} dataRaw Dữ liệu thô
   * @author TDBA (09/10/2022)
   */
  const convertDataTable = (dataRaw) => {
    return dataRaw?.map((item, index) => {
      return {
        ...item,
        key: index,
        INDEX_NUMBER: index + 1,
        QUESTION: item?.Title,
        QUESTIONER: item?.AskedPersonName,
        RESPONDENT: moment(item?.CreatedDate).format("DD/MM/YYYY"),
        ANSWERING_UNIT: item?.AnswerPersonName,
      };
    });
  };

  return (
    <div className="question-and-answer-page">
      <ScrollToTop />
      <div className="question-and-answer-page__left">
        <div className="question-and-answer-page__left__group">
          <div className="question-and-answer-page__left__group__title">
            <b>CÂU HỎI MỚI</b>
          </div>
          <div className="question-and-answer-page__left__group__list">
            {dataQuestionMaster?.NewQuestions?.map((item) => (
              <div
                className="question-and-answer-page__left__group__list__item"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  window.open(
                    window.location.origin + "/questions/" + item?.Id,
                    "_blank"
                  );
                }}
              >
                <div className="question-and-answer-page__left__group__list__item__image">
                  <img src={IconDot1} />
                </div>
                <div className="question-and-answer-page__left__group__list__item__content">
                  {item?.Title}
                </div>
              </div>
            ))}
          </div>
          <div className="question-and-answer-page__left__group__title">
            <b>HỎI ĐÁP XEM NHIỀU</b>
          </div>
          <div className="question-and-answer-page__left__group__list">
            {dataQuestionMaster?.MostViewQuestions?.map((item) => (
              <div
                className="question-and-answer-page__left__group__list__item"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  window.open(
                    window.location.origin + "/questions/" + item?.Id,
                    "_blank"
                  );
                }}
              >
                <div className="question-and-answer-page__left__group__list__item__image">
                  <img src={IconDot1} />
                </div>
                <div className="question-and-answer-page__left__group__list__item__content">
                  {item?.Title}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="question-and-answer-page__right">
        <div className="question-and-answer-page__right__header">
          <div className="question-and-answer-page__right__header__title">
            <span
              style={{
                color: "red",
              }}
            >
              *&nbsp;
            </span>
            Thông tin cá nhân của bạn sẽ được bảo vệ theo quy định của Thông tư
            <b>&nbsp;số: 25/2010/TT-BTTTT</b>
          </div>

          <div className="question-and-answer-page__right__header__tag">
            <a href="/">Gửi câu hỏi</a>
            <div></div>
          </div>
        </div>
        <div className="question-and-answer-page__right__body">
          <div className="question-and-answer-page__right__body__top">
            <div className="question-and-answer-page__right__body__top__item">
              <div className="question-and-answer-page__right__body__top__item__label">
                <b>Họ và tên </b>
                <span
                  style={{
                    color: "red",
                  }}
                >
                  &nbsp;*
                </span>
              </div>
              <div className="question-and-answer-page__right__body__top__item__input">
                <input
                  ref={(ref) => (elInputRef.current[0] = ref)}
                  onChange={(event) => {
                    const val = event?.target?.value;
                    setDataForm({
                      ...dataForm,
                      fullName: val,
                    });
                    if (!val) {
                      setWarningInput({
                        ...warningInput,
                        fullName: true,
                      });
                    } else {
                      setWarningInput({
                        ...warningInput,
                        fullName: false,
                      });
                    }
                  }}
                />
                {warningInput?.fullName ? (
                  <b className="question-and-answer-page__right__body__top__item__input__warning">
                    Vui lòng nhập họ tên người hỏi
                  </b>
                ) : null}
              </div>
            </div>

            <div className="question-and-answer-page__right__body__top__item">
              <div className="question-and-answer-page__right__body__top__item__label">
                <b>Địa chỉ </b>
              </div>
              <div className="question-and-answer-page__right__body__top__item__input">
                <input
                  ref={(ref) => (elInputRef.current[1] = ref)}
                  onChange={(event) =>
                    setDataForm({ ...dataForm, address: event?.target?.value })
                  }
                />
              </div>
            </div>

            <div className="question-and-answer-page__right__body__top__item">
              <div className="question-and-answer-page__right__body__top__item__label">
                <b>Điện thoại </b>
                <span
                  style={{
                    color: "red",
                  }}
                >
                  &nbsp;*
                </span>
              </div>
              <div className="question-and-answer-page__right__body__top__item__input">
                <input
                  ref={(ref) => (elInputRef.current[2] = ref)}
                  onChange={(event) => {
                    const val = event?.target?.value;
                    setDataForm({
                      ...dataForm,
                      phoneNumber: val,
                    });
                    if (!val) {
                      setWarningInput({
                        ...warningInput,
                        phoneNumber: true,
                      });
                    } else {
                      setWarningInput({
                        ...warningInput,
                        phoneNumber: false,
                      });
                    }
                  }}
                />
                {warningInput?.phoneNumber ? (
                  <b className="question-and-answer-page__right__body__top__item__input__warning">
                    Vui lòng nhập số điện thoại
                  </b>
                ) : null}
              </div>
            </div>

            <div className="question-and-answer-page__right__body__top__item">
              <div className="question-and-answer-page__right__body__top__item__label">
                <b>Email </b>
              </div>
              <div className="question-and-answer-page__right__body__top__item__input">
                <input
                  ref={(ref) => (elInputRef.current[3] = ref)}
                  onChange={(event) =>
                    setDataForm({
                      ...dataForm,
                      email: event?.target?.value,
                    })
                  }
                />
              </div>
            </div>
          </div>
          <div className="question-and-answer-page__right__body__mid">
            <div className="question-and-answer-page__right__body__mid__row">
              <div className="question-and-answer-page__right__body__mid__row__label">
                <b>Lĩnh vực</b>
              </div>
              <div className="question-and-answer-page__right__body__mid__row__input">
                <Select
                  value={dataForm?.field}
                  options={questionCategories}
                  onChange={(id) => {
                    setDataForm({ ...dataForm, field: id || null });
                  }}
                  allowClear
                />
              </div>
            </div>
            <div className="question-and-answer-page__right__body__mid__row">
              <div className="question-and-answer-page__right__body__mid__row__label">
                <b>Tiêu đề</b>{" "}
                <span
                  style={{
                    color: "red",
                  }}
                >
                  &nbsp;*
                </span>
              </div>
              <div className="question-and-answer-page__right__body__mid__row__input">
                <input
                  ref={(ref) => (elInputRef.current[4] = ref)}
                  onChange={(event) => {
                    const val = event?.target?.value;
                    setDataForm({
                      ...dataForm,
                      title: val,
                    });
                    if (!val) {
                      setWarningInput({
                        ...warningInput,
                        title: true,
                      });
                    } else {
                      setWarningInput({
                        ...warningInput,
                        title: false,
                      });
                    }
                  }}
                />
                {warningInput?.title ? (
                  <b className="question-and-answer-page__right__body__mid__row__input__warning">
                    Vui lòng nhập tiêu đề
                  </b>
                ) : null}
              </div>
            </div>
            <div className="question-and-answer-page__right__body__mid__row">
              <div className="question-and-answer-page__right__body__mid__row__label">
                <b>Nội dung</b>{" "}
                <span
                  style={{
                    color: "red",
                  }}
                >
                  &nbsp;*
                </span>
              </div>
              <div className="question-and-answer-page__right__body__mid__row__input">
                <textarea
                  ref={(ref) => (elInputRef.current[5] = ref)}
                  onChange={(event) => {
                    const val = event?.target?.value;
                    setDataForm({
                      ...dataForm,
                      content: val,
                    });
                    if (!val) {
                      setWarningInput({
                        ...warningInput,
                        content: true,
                      });
                    } else {
                      setWarningInput({
                        ...warningInput,
                        content: false,
                      });
                    }
                  }}
                />
                {warningInput?.content ? (
                  <b className="question-and-answer-page__right__body__mid__row__input__warning">
                    Vui lòng nhập nội dung
                  </b>
                ) : null}
              </div>
            </div>
            <div className="question-and-answer-page__right__body__mid__row">
              <div className="question-and-answer-page__right__body__mid__row__label">
                <b>Đính kèm</b>
              </div>
              <div className="question-and-answer-page__right__body__mid__row__input">
                <button onClick={() => elInputFile.current?.click()}>
                  Tải lên
                </button>
                {fileName ? (
                  <div className="question-and-answer-page__right__body__mid__row__input__cancel-upload-file">
                    <button
                      onClick={() => {
                        setFileName("");
                        formDataRef.current?.delete("FileAttachment");
                      }}
                    >
                      Huỷ
                    </button>
                    <span>{fileName}</span>
                  </div>
                ) : null}

                <input
                  type="file"
                  ref={elInputFile}
                  key={inputFile}
                  onChange={handleChoseFile}
                  style={{
                    display: "none",
                  }}
                />
              </div>
            </div>
          </div>
          <div className="question-and-answer-page__right__body__bottom">
            <button onClick={() => onValidateDate()}>Gửi câu hỏi</button>
            <button
              onClick={() => {
                setDataForm(DATA_FORM_DEFAULT);
                elInputRef.current?.map((item) => (item.value = ""));
                formDataRef.current = new FormData();
                setWarningInput({
                  fullName: false,
                  phoneNumber: false,
                  title: false,
                  content: false,
                });
                setFileName("");
              }}
            >
              Nhập lại
            </button>
          </div>
        </div>
        <div className="question-and-answer-page__right__footer">
          <div className="question-and-answer-page__right__footer__table">
            <Table
              columns={COLUMN}
              dataSource={convertDataTable(dataQuestionTable)}
              pagination={false}
              onRow={(item) => ({
                onClick: () =>
                  window.open(
                    window.location.origin + "/questions/" + item?.Id,
                    "_blank"
                  ),
              })}
            />
          </div>
          <div
            className={"question-and-answer-page__right__footer__pagination"}
          >
            <Pagination
              defaultCurrent={1}
              total={totalPage}
              pageSize={PAGE_SIZE}
              showSizeChanger={false}
              current={pageCurrent}
              onChange={(page) => setPageCurrent(page)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuestionAndAnswerPage;
