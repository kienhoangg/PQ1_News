import React, { useEffect, useRef, useState } from "react";
import Caroucel from "./Caroucel";
import "./albumImageDetailPage.scss";
import IconArrowRight from "../../../assets/icons/arrow-point-to-right.png";
import IconAlbum from "../../../assets/icons/album-background.png";
import { Pagination } from "antd";
import ScrollToTop from "components/ScrollToTop/ScrollToTop";
import axiosClient from "apis/axiosClient";
import { useLocation } from "react-router-dom";
import IconClose from "../../../assets/icons/close.png";
import { envDomainBackend } from "common/enviroments";
import imageHelper from "helpers/imageHelper";

export default function AlbumImageDetailPage() {
  const isFirstRender = useRef(true);
  const setTimeoutRef = useRef();
  const [urlImageSelected, setUrlImageSelected] = useState();

  const [albumDetail, setAlbumDetail] = useState([]);
  const [indexImageCaroucel, setIndexImageCaroucel] = useState(0);
  const [paging, setPaging] = useState(1);

  const [totalInDB, setTotalInDB] = useState(0); // Tổng bản ghi trên DB
  const [listAlbum, setListAlbum] = useState([]); // Danh sách album

  const PAGE_SIZE = 4;

  /**
   * Gọi API mỗi khi thay đổi paging
   * @author TDBA (16/10/2022)
   */
  useEffect(() => {
    callApiGetListAlbum();
  }, [paging]);

  /**
   * Xét event tự động next ảnh
   * @author TDBA (18/10/2022)
   */
  useEffect(() => {
    albumDetail?.images?.length && setEventAutoNextImage();
  }, [albumDetail?.images, indexImageCaroucel]);

  /**
   * Thêm event tự động next ảnh
   * @author TDBA (17/10/2022)
   */
  const setEventAutoNextImage = () => {
    clearInterval(setTimeoutRef.current);

    setTimeoutRef.current = setTimeout(() => {
      handleNextRightCaroucel();
    }, 2000);
  };

  /**
   * Gọi API lấy chi danh sách album
   * @author TDBA (16/10/2022)
   */
  const callApiGetListAlbum = async () => {
    try {
      const res = await axiosClient.post("/home/photocategories/filter", {
        pageSize: PAGE_SIZE,
        currentPage: paging,
        direction: -1,
        orderBy: "LastModifiedDate",
        direction2ndColumn: -1,
        orderBy2ndColumn: "Order",
      });

      if (isFirstRender.current) {
        getDetailAlbum(
          new URLSearchParams(window.location.search).get("albumid") ||
            res?.PagedData?.Results?.[0]?.Id
        );
        if (isFirstRender.current) isFirstRender.current = false;
      }

      setListAlbum(res?.PagedData?.Results);
      setTotalInDB(res?.PagedData?.RowCount);
    } catch (error) {}
  };

  /**
   * Gọi API lấy chi tiết hình ảnh
   * @author TDBA (16/10/2022)
   */
  const getDetailAlbum = async (idAlbum) => {
    try {
      const res = await axiosClient.get("/home/photocategories/" + idAlbum);

      const images = [];
      res?.Photos?.map((item) => {
        const arrayUrl = item?.ImagePath?.split(";;")?.map((val) => {
          const url = imageHelper.getLinkImageUrl(val);

          return {
            url: url,
            title: item?.Title,
          };
        });

        images.push(...arrayUrl);
      });

      setAlbumDetail({
        title: res?.Title,
        images: images,
      });

      setIndexImageCaroucel(0);
    } catch (error) {}
  };

  /**
   * Thực hiện khi click next trái
   * @author TDBA (15/10/2022)
   */
  const handleNextLeftCaroucel = () => {
    if (indexImageCaroucel > 0) {
      setIndexImageCaroucel(indexImageCaroucel - 1);
    } else {
      setIndexImageCaroucel(albumDetail?.images?.length - 1);
    }
  };

  /**
   * Thực hiện khi click next trái
   * @author TDBA (15/10/2022)
   */
  const handleNextRightCaroucel = () => {
    if (indexImageCaroucel < albumDetail?.images?.length - 1) {
      setIndexImageCaroucel(indexImageCaroucel + 1);
    } else {
      setIndexImageCaroucel(0);
    }
  };

  return (
    <div className="album-image-detail-page">
      <ScrollToTop />
      {urlImageSelected ? (
        <div className="album-image-detail-page__popup-preview">
          <div className="album-image-detail-page__popup-preview__wrap">
            <div className="album-image-detail-page__popup-preview__wrap__header">
              <span>{urlImageSelected?.title}</span>
              <div onClick={() => setUrlImageSelected()}>
                <img src={IconClose} />
              </div>
            </div>
            <div className="album-image-detail-page__popup-preview__wrap__body">
              <div>
                <img src={urlImageSelected?.url} />
              </div>
            </div>
            <div className="album-image-detail-page__popup-preview__wrap__fotter">
              <button onClick={() => setUrlImageSelected()}>Thoát</button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="album-image-detail-page__top">
        <div className="album-image-detail-page__top__title">
          <b>{albumDetail?.title || "Album ảnh"}</b>
        </div>
        <div className="album-image-detail-page__top__wrap-caroucel">
          <Caroucel
            data={albumDetail?.images}
            indexItem={indexImageCaroucel}
            onClickImage={(item) => setUrlImageSelected(item)}
          />
          <div className="album-image-detail-page__top__wrap-caroucel__mini">
            <Caroucel
              data={albumDetail?.images}
              indexItem={indexImageCaroucel}
              marginLeftItem={5}
            />
          </div>
          <div
            className="album-image-detail-page__top__wrap-caroucel__button-next-left"
            onClick={() => {
              handleNextLeftCaroucel();
            }}
          >
            <img src={IconArrowRight} />
          </div>
          <div
            className="album-image-detail-page__top__wrap-caroucel__button-next-right"
            onClick={() => {
              handleNextRightCaroucel();
              clearInterval(setTimeoutRef.current);
            }}
          >
            <img src={IconArrowRight} />
          </div>
        </div>
      </div>
      <div className="album-image-detail-page__bottom">
        <div className="album-image-detail-page__bottom__title">
          <div></div>
          <b>Danh sách Album</b>
        </div>
        <div className="album-image-detail-page__bottom__list-album">
          {listAlbum?.map((item) => (
            <div
              className="album-image-detail-page__bottom__list-album__item"
              onClick={() => getDetailAlbum(item?.Id)}
            >
              <div>
                <img src={imageHelper.getLinkImageUrl(item?.Avatar)} />
              </div>
            </div>
          ))}
        </div>
        <div className="album-image-detail-page__bottom__pagination">
          <Pagination
            defaultCurrent={1}
            current={paging}
            onChange={(page) => setPaging(page)}
            total={totalInDB}
            pageSize={PAGE_SIZE}
            showSizeChanger={false}
          />
        </div>
      </div>
    </div>
  );
}
