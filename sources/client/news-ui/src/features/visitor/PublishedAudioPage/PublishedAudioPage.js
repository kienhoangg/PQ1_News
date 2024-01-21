import React, { useEffect, useState } from "react";
import "./publishedAudioPage.scss";
import IconMP3 from "../../../assets/icons/mp3.png";
import { Pagination, Select } from "antd";
import axiosClient from "apis/axiosClient";
import imageHelper from "helpers/imageHelper";
import { useRef } from "react";
import { Option } from "antd/lib/mentions";

const PublishedAudioPage = () => {
  const elSourceRef = useRef();
  const elAudioRef = useRef();
  const isFirstRender = useRef(true);

  const [listRadioCategory, setListRadioCategory] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [categoryId, setCategoryId] = useState(null);
  const [listRadio, setListRadio] = useState({
    data: [],
    total: 0,
  });

  useEffect(() => {
    callApiGetListCategoryRadio();
  }, []);

  useEffect(() => {
    if (categoryId || categoryId === 0) callApiGetListRadio();
  }, [categoryId, currentPage]);

  const callApiGetListRadio = async () => {
    try {
      const res = await axiosClient.post("home/radios/filter", {
        status: 1,
        pageSize: 10,
        currentPage: currentPage,
        radioCategoryId: categoryId,
        direction: -1,
        orderBy: "CreatedDate",
        direction2ndColumn: -1,
        orderBy2ndColumn: "Order",
      });

      setListRadio({
        data: res?.PagedData?.Results || [],
        total: res?.PagedData?.RowCount,
      });
    } catch (err) {}
  };

  const callApiGetListCategoryRadio = async () => {
    try {
      const res = await axiosClient.post("home/radiocategories/filter", {
        status: 1,
        pageSize: 9999,
        currentPage: 1,
        direction: 1,
        orderBy: "CreatedDate",
        direction2ndColumn: -1,
        orderBy2ndColumn: "Order",
      });

      if (isFirstRender.current) {
        setCategoryId(res?.PagedData?.Results?.[0]?.Id);
        isFirstRender.current = false;
      }
      setListRadioCategory(res?.PagedData?.Results);
    } catch (err) {}
  };

  return (
    <div className="published-audio-page">
      <div className="published-audio-page__top">
        <div className="published-audio-page__top__title">
          <span>Thư viện radio</span>
        </div>
        <div className="published-audio-page__top__wrap-audio">
          <audio controls autoPlay ref={elAudioRef}>
            <source type="audio/mpeg" ref={elSourceRef} />
          </audio>
        </div>
      </div>
      <Select
        value={categoryId}
        placeholder="Chọn danh mục"
        style={{ width: "200px", marginTop: 20 }}
        allowClear={true}
        showSearch
        onChange={(id) => {
          setCategoryId(id);
          setCurrentPage(1);
        }}
      >
        {listRadioCategory?.map((x) => (
          <Option value={x.Id} key={x.Id}>
            {x.Title}
          </Option>
        ))}
      </Select>
      <div className="published-audio-page__mid">
        {listRadio?.data?.map((item) => {
          return (
            <div
              className="published-audio-page__mid__item"
              onClick={() => {
                elSourceRef.current.src = imageHelper.getLinkImageUrl(
                  item?.FileAttachment
                );
                setTimeout(() => {
                  elAudioRef.current?.load();
                  elAudioRef.current?.play();
                }, 500);
              }}
            >
              <div className="published-audio-page__mid__item__wrap-icon">
                <img src={IconMP3} />
              </div>
              <div className="published-audio-page__mid__item__wrap-title">
                <span>{item?.Title}</span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="published-audio-page__bottom">
        <Pagination
          total={listRadio?.total}
          current={currentPage}
          showSizeChanger={false}
          pageSize={1}
          onChange={(page) => {
            setCurrentPage(page);
          }}
        />
      </div>
    </div>
  );
};

export default PublishedAudioPage;
