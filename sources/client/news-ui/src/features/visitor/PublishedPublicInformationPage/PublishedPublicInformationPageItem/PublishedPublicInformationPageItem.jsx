import React from 'react';
import PropTypes from 'prop-types';
import styles from './PublishedPublicInformationPageItem.module.scss';
import classNames from 'classnames/bind';
import { Col, Row } from 'antd';
import datetimeHelper from 'helpers/datetimeHelper';
import { Link } from 'react-router-dom';
import commonFunc from 'common/commonFunc';
import commonRender from 'common/commonRender';

const cx = classNames.bind(styles);

PublishedPublicInformationPageItem.propTypes = {
    data: PropTypes.object,
    isFirst: PropTypes.bool,
};

PublishedPublicInformationPageItem.defaultProps = {
    data: null,
    isFirst: false,
};

function PublishedPublicInformationPageItem(props) {
    const { data, isFirst } = props;

    return (
        <div className={isFirst ? cx('wrapper', 'first') : cx('wrapper')}>
            <Row gutter={4}>
                {isFirst === false && (
                    <Col flex='4px'>
                        <div className={cx('icon')}></div>
                    </Col>
                )}
                <Col flex='1'>
                    <div className={cx('title')}>
                        <Link to={commonRender.renderLinkPublishedPublicInformationDetailPage(data.Id)}>{data.Title}</Link>
                    </div>

                    <div className={cx('time')}>
                        <span>{datetimeHelper.formatDateToDateVN(data.LastModifiedDate)}</span>
                    </div>
                </Col>
            </Row>
        </div>
    );
}

export default PublishedPublicInformationPageItem;
