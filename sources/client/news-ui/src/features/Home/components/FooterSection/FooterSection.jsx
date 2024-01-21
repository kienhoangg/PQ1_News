import React from 'react';
import PropTypes from 'prop-types';
import styles from './FooterSection.module.scss';
import classNames from 'classnames/bind';
import { Col, Row, Skeleton } from 'antd';
import { HomeOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import Images from 'common/images';

const cx = classNames.bind(styles);

FooterSection.propTypes = {
    visitorOnline: PropTypes.number,
    isLoading: PropTypes.bool,
};

FooterSection.defaultProps = {
    visitorOnline: 0,
    isLoading: true,
};

function FooterSection(props) {
    const { isLoading, visitorOnline } = props;

    return (
        <div className={cx('wrapper')}>
            <Row gutter={64}>
                <Col md={12} sm={24}>
                    <div className={cx('title')}>CƠ QUAN CHỦ QUẢN: Ủy ban nhân dẫn xã Đông Cuông</div>
                    <div className={cx('content-item')}>Giấy phép thiết lập Trang thông tin điện tử số 18/GP-TTĐT do Cục phát thanh, truyền hình và thông tin điên tử cấp ngày 15/03/20216.</div>
                    <div className={cx('content-item')}>Chịu trách nhiệm chính: </div>
                    <div className={cx('content-item')}>Bản quyền thuộc Trung tâm Thông tin.</div>
                    <div className={cx('content-item')}>(Ghi rõ nguồn "https://dongcuong.vanyen.yenbai.gov.vn" khi phát hành lại thông tin từ website này)</div>
                </Col>
                <Col md={12} sm={24}>
                    <div className={cx('title')}>Liện hệ</div>
                    <div className={cx('content-item')}>
                        <PhoneOutlined />
                        <div className={cx('content-item-detail')}>
                            <div>024.3556.3461</div>
                            <div>024.3556.3461</div>
                        </div>
                    </div>
                    <div className={cx('content-item')}>
                        <MailOutlined />
                        <div className={cx('content-item-detail')}>
                            <div>bientapvien@dongcuong.vanyen.yenbai.gov.vn</div>
                        </div>
                    </div>
                    <div className={cx('content-item')}>
                        <HomeOutlined />
                        <div className={cx('content-item-detail')}>
                            <div>Ban biên tập công TTĐT</div>
                        </div>
                    </div>
                </Col>
                <Col span={12}></Col>
            </Row>

            <div className={cx('social-network')}>
                <Link to={'/'}>
                    <img style={{ width: 32, marginRight: 4 }} src={Images.iconFB} alt='' />
                </Link>
                <Link to={'/'}>
                    <img style={{ width: 32, marginRight: 4 }} src={Images.iconT} alt='' />
                </Link>
                <Link to={'/'}>
                    <img style={{ width: 32, marginRight: 4 }} src={Images.iconG} alt='' />
                </Link>
                <Link to={'/'}>
                    <img style={{ width: 32, marginRight: 4 }} src={Images.iconIn} alt='' />
                </Link>
            </div>
            <div className={cx('visitor-access')}>
                <Skeleton loading={visitorOnline <= 0} active>
                    <div className={cx('visitor-item')}>
                        <span className={cx('visitor-item-label')}>NGƯỜI ONLINE</span>
                        <span className={cx('visitor-item-value')}>{visitorOnline}</span>
                    </div>
                </Skeleton>
            </div>
        </div>
    );
}

export default FooterSection;
