import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styles from './PublishedLawDissemination.module.scss';
import classNames from 'classnames/bind';
import publishedNewsApi from 'apis/published/publishedNewsApi';
import commonRender, { commonRenderTable } from 'common/commonRender';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import ScrollToTop from 'components/ScrollToTop/ScrollToTop';
import { Pagination, Skeleton } from 'antd';
import stringHelper from 'helpers/stringHelper';
import PublishedNewsListCategoryPageItem from '../PublishedNewsFieldListPage/PublishedNewsListCategoryPageItem/PublishedNewsListCategoryPageItem';
import config from 'config/config';
import { DEFAULT_COLUMN_FILTER } from 'common/constant';
import { DEFAULT_COLUMN_ORDER_BY } from 'common/constant';
import { Direction } from 'common/enum';

const cx = classNames.bind(styles);

PublishedLawDissemination.propTypes = {};

function PublishedLawDissemination(props) {
  const [loading, setLoading] = useState(true);

  const [dataPageFullPage, setDataPageFullPage] = useState();
  const dataPage = useRef(null);
  const dataTotal = useRef(1);

  const [pagingIndex, setPagingIndex] = useState(1);

  useEffect(() => {
    const fetchHome = async () => {
      try {
        const params = {
          direction: Direction.DESC,
          orderBy: DEFAULT_COLUMN_ORDER_BY,
          status: 1,
          pageSize: 6,
          currentPage: pagingIndex,
          categoryNewsName: DEFAULT_COLUMN_FILTER,
        };
        const response =
          await publishedNewsApi.getInternationalLawDissemination(params);
        setDataPageFullPage(response);
        dataPage.current = response?.PagedData?.Results?.[0]?.CategoryNews;
        dataTotal.current = response?.NewsPosts.RowCount;
      } catch (error) {
        console.log('Failed to fetch list: ', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHome();
  }, [pagingIndex]);

  function handleOnChangeIndexPaging(params) {
    setPagingIndex(params);
  }

  return (
    <div className={cx('wrapper')}>
      <ScrollToTop />
      <Skeleton loading={loading} active>
        <>
          {dataPage.current && (
            <>
              <div
                key={dataPage.current?.CategoryId}
                className={cx('category-container')}
              >
                <div className={cx('title-container')}>
                  <Link
                    to={config.routes.publishedLawDissemination}
                    className={cx('title')}
                  >
                    Phổ biến pháp luật
                  </Link>
                  <span className={cx('right')}></span>
                </div>
                <div
                  style={{ border: '1px solid #0066b3', marginLeft: 8 }}
                ></div>

                {Array.isArray(dataPageFullPage?.PagedData?.Results) &&
                  dataPageFullPage.PagedData.Results.map((dataItem, index) => {
                    return (
                      <div key={index}>
                        <PublishedNewsListCategoryPageItem
                          data={dataItem}
                          isFirst={true}
                        />
                        <div className={cx('divider')}></div>
                      </div>
                    );
                  })}
                <Pagination
                  className={cx('paging')}
                  defaultCurrent={pagingIndex}
                  total={dataTotal.current}
                  showTotal={() =>
                    commonRenderTable.showTableTotalPagination(
                      dataTotal.current ?? 0
                    )
                  }
                  onChange={handleOnChangeIndexPaging}
                />
              </div>
            </>
          )}
        </>
      </Skeleton>
    </div>
  );
}

export default PublishedLawDissemination;
