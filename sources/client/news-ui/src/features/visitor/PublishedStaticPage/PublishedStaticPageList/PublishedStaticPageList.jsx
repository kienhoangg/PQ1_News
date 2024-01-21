import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styles from './PublishedStaticPageList.module.scss';
import classNames from 'classnames/bind';
import { Col, Row, Skeleton } from 'antd';
import homeApi from 'apis/published/homeApi';
import { Link } from 'react-router-dom';
import { LinkOutlined, RightOutlined } from '@ant-design/icons';

const cx = classNames.bind(styles);

PublishedStaticPageList.propTypes = {
    dataList: PropTypes.array,
};

PublishedStaticPageList.defaultProps = {
    dataList: null,
};

const datafakeMenuPageData = [
    {
        Title: 'Tỉnh ủy đông cuông',
        Items: [
            {
                Title: 'Thường trực tỉnh ủy',
                Url: 'https://yenbai.gov.vn/Pages/Thuong-truc-Tinh-uy.aspx',
            },
            {
                Title: 'Ban thường vụ Tỉnh ủy',
                Url: 'https://yenbai.gov.vn/Pages/Thuong-truc-Tinh-uy.aspx',
            },
            {
                Title: 'Ban Chấp hành Đảng bộ tỉnh',
                Url: 'https://yenbai.gov.vn/Pages/Thuong-truc-Tinh-uy.aspx',
            },
            {
                Title: 'Ban Tổ chức Tỉnh ủy',
                Url: 'https://yenbai.gov.vn/Pages/Thuong-truc-Tinh-uy.aspx',
            },
            {
                Title: 'Ban Tuyên giáo Tỉnh ủy',
                Url: 'https://yenbai.gov.vn/Pages/Thuong-truc-Tinh-uy.aspx',
            },
        ],
    },
    {
        Title: 'CÁC BAN ĐẢNG',
        Items: [
            {
                Title: 'Thường trực tỉnh ủy',
                Url: 'https://yenbai.gov.vn/Pages/Thuong-truc-Tinh-uy.aspx',
            },
            {
                Title: 'Ban thường vụ Tỉnh ủy',
                Url: 'https://yenbai.gov.vn/Pages/Thuong-truc-Tinh-uy.aspx',
            },
            {
                Title: 'Ban Chấp hành Đảng bộ tỉnh',
                Url: 'https://yenbai.gov.vn/Pages/Thuong-truc-Tinh-uy.aspx',
            },
            {
                Title: 'Ban Tổ chức Tỉnh ủy',
                Url: 'https://yenbai.gov.vn/Pages/Thuong-truc-Tinh-uy.aspx',
            },
            {
                Title: 'Ban Tuyên giáo Tỉnh ủy',
                Url: 'https://yenbai.gov.vn/Pages/Thuong-truc-Tinh-uy.aspx',
            },
        ],
    },
];

function PublishedStaticPageList(props) {
    const { dataList } = props;
    // const dataList = datafakeMenuPageData;

    return (
        <div className={cx('wrapper')}>
            {Array.isArray(dataList) &&
                dataList.map((menuData, index) => {
                    return (
                        <div key={index}>
                            <Row className={cx('container')} gutter={[16, 16]}>
                                <Col span={24}>
                                    <div className={cx('title-container')}>
                                        <h2 className={cx('title')}>{menuData?.Title}</h2>
                                    </div>
                                    <div className={cx('divider-main')}></div>
                                </Col>

                                {Array.isArray(menuData?.Items) &&
                                    menuData.Items.map((item, index) => {
                                        return (
                                            <Col key={index} className={cx('menu-item-container')} span={12}>
                                                <a className={cx('menu-item')} href={item.Url}>
                                                    <LinkOutlined /> {item.Title}
                                                </a>
                                                <div className={cx('divider-item')}></div>
                                            </Col>
                                        );
                                    })}
                            </Row>
                        </div>
                    );
                })}
        </div>
    );
}

export default PublishedStaticPageList;
