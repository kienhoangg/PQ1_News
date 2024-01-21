import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import "./libVideoListPage.scss";
import { Pagination, Select } from "antd";
import axiosClient from "apis/axiosClient";
import $ from "jquery";
import imageHelper from "helpers/imageHelper";

LibVideoListPage.propTypes = {};

/**
 * Hiển thị danh sách video
 * @param {*} props
 * @author TDBA (16/10/2022)
 */
function LibVideoListPage(props) {
  const videoIdBefore = useRef(null);
  const elVideoMainRef = useRef();
  const isFirstRender = useRef(true);
  const [listVideo, setListVideo] = useState({
    totalInDB: 0,
    data: [],
  });
  const [libVideoSelected, setLibVideoSelected] = useState(null);
  const [listLibVideo, setListLibVideo] = useState([]);
  const [dataPaging, setDataPaging] = useState(1); // State lưu dữ liệu paging
  const [videoDetail, setVideoDetail] = useState({}); // Chi tiết video
  const [loading, setLoading] = useState(true);

  const contentVideo = useRef("");

  useEffect(() => {
    callApiGetListLibVideo();
  }, []);

  useEffect(() => {
    if (libVideoSelected || libVideoSelected === 0) {
      callApiGetVideoByCategoryVideo(libVideoSelected);
    }
  }, [libVideoSelected, dataPaging]);

  /**
   * Gọi API lấy chi danh sách album
   * @author TDBA (16/10/2022)
   */
  const callApiGetVideoDetail = async (id) => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await axiosClient.get("/home/videos/" + id);
      setVideoDetail(res);

      let contentVideoRes = "";

      if (res?.FileAttachment) {
        contentVideoRes = `<video width="100%" height="100%" controls autoplay>
            <source
              src="${imageHelper.getLinkImageUrl(res?.FileAttachment)})
          }"
              type="video/mp4"
            />
          </video>`;
      } else {
        contentVideoRes = res?.LinkVideo;
      }

      if (res.Id != contentVideo.current) {
        addScriptVideo(contentVideoRes);
      }

      contentVideo.current = res.Id;
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  /**
   * Gọi API lấy danh sách danh mục video
   * @author TDBA (22/10/2022)
   */
  const callApiGetListLibVideo = async () => {
    try {
      const body = {
        pageSize: 99999,
        currentPage: 1,
        direction: -1,
        orderBy: "LastModifiedDate",
        direction2ndColumn: -1,
        orderBy2ndColumn: "Order",
        status: 1,
      };

      const res = await axiosClient.post("/home/videocategories/filter", body);

      setListLibVideo(
        res?.PagedData?.Results?.map((item) => ({
          value: item?.Id,
          label: item?.Title,
        }))
      );

      setLibVideoSelected(res?.PagedData?.Results?.[0]?.Id);
    } catch (err) {}
  };

  /**
   * Gọi API lấy danh sách video theo danh mục
   * @author TDBA (23/10/2022)
   */
  const callApiGetVideoByCategoryVideo = async (id) => {
    try {
      const body = {
        pageSize: 8,
        currentPage: dataPaging,
        direction: -1,
        orderBy: "CreatedDate",
        videoCategoryId: id,
        status: 1,
      };

      const res = await axiosClient.post("/home/videos/filter", body);
      setListVideo({
        data: res?.PagedData?.Results,
        totalInDB: res?.PagedData?.RowCount,
      });

      if (isFirstRender.current) {
        const videoID =
          new URLSearchParams(window.location.search).get("videoid") ||
          res?.PagedData?.Results?.[0]?.Id;

        callApiGetVideoDetail(videoID);
        videoIdBefore.current = videoID;

        isFirstRender.current = false;
      }
    } catch (err) {}
  };

  /**
   * Thêm script video
   * @author TDBA (22/10/2022)
   */
  const addScriptVideo = (scriptVideo) => {
    if (!scriptVideo) return;

    const resetScripVideo = () => {
      if (
        $(".lib-video-list-page__bottom__wrap-video-main").length > 0 &&
        scriptVideo
      ) {
        $(".lib-video-list-page__bottom__wrap-video-main").empty();
        $(".lib-video-list-page__bottom__wrap-video-main")?.append(scriptVideo);
      }
      // console.log("Video render DOM", $(".lib-video-list-page__bottom__wrap-video-main"), scriptVideo)
    };

    // resetScripVideo();
    setTimeout(() => {
      resetScripVideo();
    }, 300);
  };

  return (
    <div className="lib-video-list-page">
      <div className="lib-video-list-page__top">
        <div className="lib-video-list-page__top__title">
          <span>Thư viện video</span>
        </div>
      </div>
      <div className="lib-video-list-page__bottom">
        <div
          className="lib-video-list-page__bottom__wrap-video-main"
          ref={elVideoMainRef}
        >
          {/* {videoIdBefore.current === videoDetail?.Id ? (
            <div>Link video</div>
          ) : (
            (() => {
              videoIdBefore.current = videoDetail?.Id;
              return videoDetail?.FileAttachment
                ? addScriptVideo(`<video width="100%" height="100%" controls autoplay>
            <source
              src="${videoDetail?.FileAttachment?.indexOf("https://") === 0 ||
                    videoDetail?.FileAttachment?.indexOf("http://") === 0
                    ? videoDetail?.FileAttachment
                    : window.location.origin +
                    (videoDetail?.FileAttachment?.indexOf("/") === 0
                      ? videoDetail?.FileAttachment
                      : "/" + videoDetail?.FileAttachment)
                  }"
              type="video/mp4"
            />
          </video>`)
                : addScriptVideo(videoDetail?.LinkVideo);
            })()
          )} */}
        </div>
        <div className="lib-video-list-page__bottom__select-lib">
          <Select
            options={listLibVideo}
            placeholder="--- Chọn danh mục video ---"
            onChange={(val) => {
              setLibVideoSelected(val);
            }}
          />
        </div>
        <div className="lib-video-list-page__bottom__list-video">
          {[...listVideo?.data]?.map((item) => (
            <div
              className="lib-video-list-page__bottom__list-video__item"
              onClick={() => callApiGetVideoDetail(item?.Id)}
            >
              <div className="lib-video-list-page__bottom__list-video__item__avatar">
                {" "}
                <img
                  alt=""
                  src={imageHelper.getLinkImageUrl(item?.Avatar)}
                />{" "}
              </div>
              <div className="lib-video-list-page__bottom__list-video__item__title">
                <span>{item?.Title}</span>
              </div>
            </div>
          ))}
        </div>
        <div className={"lib-video-list-page__bottom__pagination"}>
          <Pagination
            total={listVideo?.totalInDB}
            showSizeChanger={false}
            defaultPageSize={20}
            current={dataPaging}
            onChange={(page) => setDataPaging(page)}
          />
        </div>
      </div>
    </div>
  );
}

export default LibVideoListPage;
