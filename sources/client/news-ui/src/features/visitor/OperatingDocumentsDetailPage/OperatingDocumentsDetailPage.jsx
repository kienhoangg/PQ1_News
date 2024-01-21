import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import "./operatingDocumentsDetailPage.scss";
import IconDot from "../../../assets/icons/Icon-dot.png";
import { Link, useLocation, useParams } from "react-router-dom";
import IconPDF from "../../../assets/icons/icon-pdf.png";
import axiosClient from "apis/axiosClient";
import moment from "moment";
import ScrollToTop from "components/ScrollToTop/ScrollToTop";
import { envDomainBackend } from "common/enviroments";
import { Skeleton } from "antd";

OperatingDocumentsDetailPage.propTypes = {};

OperatingDocumentsDetailPage.defaultProps = {};

/**
 * Màn hình hiển thị chi tiết văn bản
 * @param {*} props
 * @author TDBA (09/10/2022)
 */
function OperatingDocumentsDetailPage(props) {
  const [loading, setLoading] = useState(true);
  const [loadingFilter, setLoadingFilter] = useState(true);
  const location = useLocation();
  const { id } = useParams();

  const elListItemRunningRef = useRef(""); // Ref tham chiếu tới phần tử chưa danh sách item
  const scrollTo = useRef(0); // Lưu vị trí scroll
  const setIntervalRef = useRef(null); // Lưu tham chiếu tới setinterval để clear

  const [documentDetail, setDocumentDetail] = useState({}); // Chi tiết tài liệu
  const [listDocuments, setListDocuments] = useState([]); // Danh sách văn bản

  /**
   * Thêm dự kiện tự động scroll
   * @author TDBA (09/10/2022)
   */
  useEffect(() => {
    clearInterval(setIntervalRef.current);
    setEventAutoScroll();
  }, []);

  /**
   * Tạo event tự động scroll
   * @author TDBA (09/10/2022)
   */
  const setEventAutoScroll = () => {
    setIntervalRef.current = setInterval(() => {
      elListItemRunningRef.current?.scrollTo(0, scrollTo.current);
      ++scrollTo.current;
    }, 100);
  };

  useEffect(() => {
    callApiGetDetailDocument();
    callApiGetDocumentByFilter();
  }, []);

  /**
   * Lấy chi tiết văn bản theo id
   * @author TDBA (15/10/2022)
   */
  const callApiGetDetailDocument = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get("/home/documents/" + id);
      setDocumentDetail(res);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const PAGE_SIZE = 20;

  /**
   * Thực hiện gọi API lấy danh sách văn bản
   * @author TDBA (15/10/2022)
   */
  const callApiGetDocumentByFilter = async () => {
    setLoadingFilter(true);
    try {
      let body = {
        pageSize: PAGE_SIZE,
        currentPage: 1,
        direction: -1,
        orderBy: "CreatedDate",
      };

      const res = await axiosClient.post("/home/documents/filter", body);
      setListDocuments(res?.PagedData?.Results || []);
    } catch (error) {
    } finally {
      setLoadingFilter(false);
    }
  };

  return (
    <div className="operating-documents-detail-page">
      <ScrollToTop />
      <div className="operating-documents-detail-page__left">
        <div className="operating-documents-detail-page__left__header">
          <div
            className={"operating-documents-detail-page__left__header__content"}
          >
            <span>{"Văn bản điều hành"}</span>
          </div>
        </div>

        <div className="operating-documents-detail-page__left__body">
          <div className="operating-documents-detail-page__left__body__table">
            <div className="operating-documents-detail-page__left__body__table__title">
              {documentDetail?.Name}
            </div>
            <Skeleton loading={loading} active>
              <table className="operating-documents-detail-page__left__body__table__content">
                <tbody>
                  <tr>
                    <td>Số ký hiệu</td>
                    <td>{documentDetail?.Code}</td>
                  </tr>
                  <tr>
                    <td>Nội dung</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>Loại văn bản</td>
                    <td>{documentDetail?.DocumentType?.Title}</td>
                  </tr>
                  <tr>
                    <td>Cơ quan ban hành</td>
                    <td>{documentDetail?.DocumentDepartment?.Title}</td>
                  </tr>
                  <tr>
                    <td>Lĩnh vực</td>
                    <td>{documentDetail?.DocumentField?.Title}</td>
                  </tr>
                  <tr>
                    <td>Người ký</td>
                    <td>{documentDetail?.DocumentSignPerson?.Title}</td>
                  </tr>
                  <tr>
                    <td>Ngày ban hành</td>
                    <td>
                      {moment(documentDetail?.PublishedDate).format(
                        "DD/MM/YYYY"
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td>Tệp đính kèm</td>
                    <td>
                      <a
                        className={
                          "operating-documents-detail-page__left__body__table__content__icon-pdf"
                        }
                        href={envDomainBackend + "/" + documentDetail?.FilePath}
                        target="_blank"
                      >
                        <img
                          style={{
                            width: 20,
                            height: 20,
                          }}
                          src={IconPDF}
                          alt=""
                        />
                        {
                          documentDetail?.FilePath?.split("/")?.[
                            documentDetail?.FilePath?.split("/").length - 1
                          ]
                        }
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </Skeleton>
          </div>

          <div className="operating-documents-detail-page__left__body__list-document">
            <div className="operating-documents-detail-page__left__body__list-document__title">
              Các văn bản khác
            </div>
            <div className="operating-documents-detail-page__left__body__list-document__wrap-list">
              {listDocuments?.map((item) => (
                <div className="operating-documents-detail-page__left__body__list-document__wrap-list__row">
                  <div className="operating-documents-detail-page__left__body__list-document__wrap-list__row__dot">
                    <img src={IconDot} />
                  </div>
                  <div className="operating-documents-detail-page__left__body__list-document__wrap-list__row__title">
                    <a href={"/documents/" + item?.Id} target="_blank">
                      {item?.Name}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="operating-documents-detail-page__left__body__view-all-document">
            <Link to={"/documents"}>Xem toàn bộ văn bản tại đây {">>"}</Link>
          </div>
        </div>
      </div>
      <div className="operating-documents-detail-page__right">
        <div className={"operating-documents-detail-page__right__row"}>
          <a href="/">
            <span>{"Văn bản chỉ đạo điều hành"}</span>
          </a>
          <div
            className={
              "operating-documents-detail-page__right__row__list-item-running"
            }
            ref={elListItemRunningRef}
            onMouseEnter={() => clearInterval(setIntervalRef.current)}
            onMouseLeave={() => setEventAutoScroll()}
          >
            <Skeleton loading={loadingFilter} active>
              {listDocuments?.map((item) => (
                <div
                  className={
                    "operating-documents-detail-page__right__row__list-item-running__item"
                  }
                >
                  <a
                    href={`/documents/${item?.Id}`}
                    target="_blank"
                    className={
                      "operating-documents-detail-page__right__row__list-item-running__item__href"
                    }
                  >
                    <span
                      className={
                        "operating-documents-detail-page__right__row__list-item-running__item__href__dot"
                      }
                    ></span>
                    <span>{item?.Name}</span>
                  </a>
                </div>
              ))}
            </Skeleton>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OperatingDocumentsDetailPage;
