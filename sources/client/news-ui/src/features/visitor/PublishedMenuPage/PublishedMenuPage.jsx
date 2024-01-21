import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styles from './PublishedMenuPage.module.scss';
import classNames from 'classnames/bind';
import { Col, Row, Skeleton } from 'antd';
import homeApi from 'apis/published/homeApi';
import { Link } from 'react-router-dom';
import { LinkOutlined, RightOutlined } from '@ant-design/icons';

const cx = classNames.bind(styles);

PublishedMenuPage.propTypes = {};

PublishedMenuPage.defaultProps = {};

function PublishedMenuPage(props) {
    const [dataPage, setDataPage] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHome = async () => {
            try {
                const params = {};
                const response = await homeApi.getMenuPageData(params);
                setDataPage(response);
            } catch (error) {
                console.log('Failed to fetch list: ', error);
            } finally {
                setLoading(false);
            }
        };
        fetchHome();
    }, []);

    return (
        <div className={cx('wrapper')}>
            <Skeleton loading={loading} active>
                {Array.isArray(dataPage) &&
                    dataPage.map((menuData, index) => {
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
            </Skeleton>
        </div>
    );
}

export default PublishedMenuPage;
