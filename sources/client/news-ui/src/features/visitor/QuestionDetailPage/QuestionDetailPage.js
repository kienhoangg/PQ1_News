import axiosClient from "apis/axiosClient";
import React, { useEffect, useRef, useState } from "react";
import "./questionDetailPage.scss";
import IconDot1 from "../../../assets/icons/icon-dot-1.png";
import ScrollToTop from "components/ScrollToTop/ScrollToTop";
import moment from "moment";
import { useParams } from "react-router-dom";
import imageHelper from "helpers/imageHelper";

/**
 * Màn hình chi tiết hỏi đáp
 * @auhtor TDBA (11/10/2022)
 */
function QuestionDetailPage() {
  const { id } = useParams();
  const [questionDetail, setQuestionDetail] = useState();

  const [dataQuestionMaster, setDataQuestionMaster] = useState({
    NewQuestions: [],
    MostViewQuestions: [],
  });

  /**
   * Thực hiện callAPI lấy dữ dữ liệu thể loại câu hỏi
   * @author TDBA (16/10/2022)
   */
  useEffect(() => {
    callApiGetQuestionMaster();
    callApiGetQuestionDetail(id);
  }, []);

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
    } catch (err) {}
  };

  /**
   * CallApi lấy chi tiết câu hỏi
   * @author TDBA (19/10/2022)
   */
  const callApiGetQuestionDetail = async (id) => {
    try {
      const res = await axiosClient.get("/home/questions/" + id);

      setQuestionDetail(res);
    } catch (err) {}
  };

  return (
    <div className="question-detail-page">
      <ScrollToTop />
      <div className="question-detail-page__left">
        <div className="question-detail-page__left__group">
          <div className="question-detail-page__left__group__title">
            <b>CÂU HỎI MỚI</b>
          </div>
          <div className="question-detail-page__left__group__list">
            {dataQuestionMaster?.NewQuestions?.map((item) => (
              <div
                className="question-detail-page__left__group__list__item"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  window.open(
                    window.location.origin + "/questions/" + item?.Id,
                    "_blank"
                  );
                }}
              >
                <div className="question-detail-page__left__group__list__item__image">
                  <img src={IconDot1} />
                </div>
                <div className="question-detail-page__left__group__list__item__content">
                  {item?.Title}
                </div>
              </div>
            ))}
          </div>
          <div className="question-detail-page__left__group__title">
            <b>HỎI ĐÁP XEM NHIỀU</b>
          </div>
          <div className="question-detail-page__left__group__list">
            {dataQuestionMaster?.MostViewQuestions?.map((item) => (
              <div
                className="question-detail-page__left__group__list__item"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  window.open(
                    window.location.origin + "/questions/" + item?.Id,
                    "_blank"
                  );
                }}
              >
                <div className="question-detail-page__left__group__list__item__image">
                  <img src={IconDot1} />
                </div>
                <div className="question-detail-page__left__group__list__item__content">
                  {item?.Title}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="question-detail-page__right">
        <div className="question-detail-page__right__header">
          <div className="question-detail-page__right__header__tag">
            <a href="/">Chi tiết hỏi đáp</a>
            <div></div>
          </div>
        </div>
        <div className="question-detail-page__right__body">
          <div
            style={{
              marginTop: 10,
            }}
          >
            <b
              style={{
                color: "red",
                fontSize: 15,
              }}
            >
              Câu hỏi
            </b>
          </div>

          <span
            style={{
              marginTop: 10,
              fontSize: 12,
            }}
            dangerouslySetInnerHTML={{
              __html: questionDetail?.QuestionContent,
            }}
          ></span>

          <div style={{ marginTop: 10 }}>
            <b>Người hỏi: </b>
            <i>Công dân {questionDetail?.AskedPersonName}&nbsp;/&nbsp; </i>
            <b>Địa chỉ: </b>
            <i>{questionDetail?.Address}&nbsp; /&nbsp; </i>
            <b>Ngày hỏi: </b>
            <i>
              {questionDetail?.CreatedDate
                ? moment(questionDetail?.CreatedDate).format("DD/MM/YYYY")
                : null}
            </i>
          </div>

          <div
            style={{
              marginTop: 10,
              fontSize: 15,
            }}
          >
            <b
              style={{
                color: "red",
              }}
            >
              Câu trả lời:
            </b>
          </div>

          <div
            style={{ marginTop: 10 }}
            dangerouslySetInnerHTML={{
              __html: questionDetail?.AnswerContent,
            }}
          ></div>

          <div style={{ marginTop: 10 }}>
            <b>
              <span
                style={{
                  textDecoration: "none",
                  color: "green",
                }}
              >
                Tệp đính kèm
              </span>
              {": "}
              <a href={imageHelper.getLinkImageUrl(questionDetail?.FilePath)}>
                {imageHelper.getNameFile(questionDetail?.FilePath)}
              </a>
            </b>
          </div>

          <div style={{ marginTop: 10, marginBottom: 10 }}>
            <b>Ngày trả lời: </b>{" "}
            <i>
              {questionDetail?.AnswerDate
                ? moment(questionDetail?.AnswerDate).format("DD/MM/YYYY")
                : null}
            </i>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuestionDetailPage;
