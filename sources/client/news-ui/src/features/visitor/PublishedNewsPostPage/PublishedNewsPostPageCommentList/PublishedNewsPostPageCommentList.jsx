import React from 'react';
import PropTypes from 'prop-types';
import styles from './PublishedNewsPostPageCommentList.module.scss';
import classNames from 'classnames/bind';
import { Col, Pagination, Row } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import datetimeHelper from 'helpers/datetimeHelper';
import { commonRenderTable } from 'common/commonRender';

const cx = classNames.bind(styles);

PublishedNewsPostPageCommentList.propTypes = {
    total: PropTypes.number,
    data: PropTypes.array,
    pagingIndex: PropTypes.array,
    onChangeIndexPaging: PropTypes.func,
};

PublishedNewsPostPageCommentList.defaultProps = {
    total: 0,
    pagingIndex: 0,
    data: [],
    onChangeIndexPaging: () => {},
};

function PublishedNewsPostPageCommentList(props) {
    const { data, total, onChangeIndexPaging, pagingIndex } = props;

    console.log('dataaaa', props);

    function handleOnChangeIndexPaging(index) {
        if (onChangeIndexPaging) onChangeIndexPaging(index);
    }

    return (
        <div className={cx('wrapper')}>
            {Array.isArray(data) &&
                data.map((item, index) => {
                    return (
                        <Row gutter={0} key={index} className={cx('item')}>
                            <Col flex='60px' className={cx('item-left')}>
                                <FontAwesomeIcon icon={faUserCircle} style={{ fontSize: '50px', color: '#16b900' }} />
                            </Col>
                            <Col flex='1' className={cx('item-right')}>
                                <Row gutter={0}>
                                    <Col span={24} style={{ marginBottom: 4 }}>
                                        <span className={cx('user-name')}>{item.Username}</span>
                                        <span className={cx('time')}>
                                            <span> - </span>
                                            {datetimeHelper.formatDatetimeToDateVN(item.LastModifiedDate)}
                                        </span>
                                    </Col>
                                    <Col span={24}>{item.Content}</Col>
                                </Row>
                            </Col>
                        </Row>
                    );
                })}
            {total > data.length && (
                <Pagination
                    className={cx('paging')}
                    defaultCurrent={pagingIndex}
                    total={total}
                    // showTotal={() => commonRenderTable.showTableTotalPagination(total ?? 0)}
                    onChange={handleOnChangeIndexPaging}
                    pageSizeOptions={[]}
                    showSizeChanger={false}
                />
            )}
        </div>
    );
}

export default PublishedNewsPostPageCommentList;
