import React from 'react';
import PropTypes from 'prop-types';
import styles from './ListSection.module.scss';
import classNames from 'classnames/bind';
import { Col, Divider, Row, Skeleton } from 'antd';
import ListSectionButton from './ListSectionButton/ListSectionButton';
import Images from 'common/images';
import { SearchOutlined } from '@ant-design/icons';
import ListSectionDocument from './ListSectionDocument/ListSectionDocument';
import { Link, UNSAFE_DataRouterStateContext } from 'react-router-dom';
import ListSectionNews from './ListSectionNews/ListSectionNews';
import commonRender from 'common/commonRender';
import routes from 'config/configRoutes';

const cx = classNames.bind(styles);

ListSection.propTypes = {
    dataNews: PropTypes.object,
    dataDocuments: PropTypes.array,
    isLoading: PropTypes.bool,
};

ListSection.defaultProps = {
    dataNews: {},
    dataDocuments: null,
    isLoading: true,
};

const LIST_BUTON = [
    {
        Href: routes.publishedInternationalTreaties,
        Label: 'ĐIỀU ƯỚC QUỐC TẾ',
        Image: Images.LIST_BUTTON_ITEM,
    },
    {
        Href: routes.publishedLawDissemination,
        Label: 'PHỔ BIẾN PHÁP LUẬT',
        Image: Images.LIST_BUTTON_ITEM,
    },
    {
        Href: routes.publishedSuggestionBox,
        Label: 'HÒM THƯ GÓP Ý',
        Image: Images.LIST_BUTTON_ITEM,
    },
    {
        Href: routes.publishedEvaluatePage,
        Label: 'ĐÁNH GIÁ SỰ PHỤC VỤ CỦA CƠ QUAN HÀNH CHÍNH NHÀ NƯỚC',
        Image: Images.LIST_BUTTON_ITEM,
    },
    {
        Href: routes.publishedPublicInformation,
        Label: 'THÔNG TIN CÔNG KHAI',
        Image: Images.LIST_BUTTON_ITEM,
    },
    {
        Href: '/',
        Label: 'THÔNG TIN CẦN BIẾT',
        Image: Images.LIST_BUTTON_ITEM,
    },
    {
        Href: routes.publishedQuestions,
        Label: 'Hỏi đáp',
        Image: Images.LIST_BUTTON_ITEM,
    },
];

function ListSection(props) {
    const { isLoading, dataNews, dataDocuments } = props;
    const { CategoryNews, Data: items } = dataNews;
    if (Array.isArray(items) && items.length > 1) {
        for (let i = 1; i < items.length; i++) {
            items[i].Avatar = '';
        }
    }
    return (
        <Row gutter={16} className={cx('wrapper')}>
            <Col md={8} sm={24}>
                {LIST_BUTON.map((item) => {
                    return <ListSectionButton href={item.Href} imageName={item.Image} key={item.Label} label={item.Label} />;
                })}
            </Col>
            <Col md={8} sm={24}>
                <div className={cx('list-document')}>
                    <Row gutter={0} className={cx('list-card')}>
                        <Col span={12}>Thông tin chung</Col>
                        <Col span={12}>
                            <Link className={cx('search-right')} to={routes.publishedDocumentList}>
                                <span style={{ fontSize: 13, marginRight: 4 }}>Tìm kiếm văn bản</span>
                                <SearchOutlined color='#fff' />
                            </Link>
                        </Col>
                    </Row>
                    <div className={cx('list-document-content')}>
                        <Skeleton loading={isLoading} active>
                            <>
                                {Array.isArray(dataDocuments) &&
                                    dataDocuments.map((item) => {
                                        return (
                                            <ListSectionDocument
                                                title={item.Code}
                                                date={item.PublishedDate}
                                                key={item.Code}
                                                description={item.Name}
                                                href={commonRender.renderLinkDocumentDetail(item.Id)}
                                            />
                                        );
                                    })}
                            </>
                        </Skeleton>
                    </div>
                </div>
            </Col>
            <Col md={8} sm={24}>
                <div className={cx('list-news')}>
                    <Row gutter={0} className={cx('list-card')} justify='space-between'>
                        <Col span={24}>
                            <Link to={commonRender.renderLinkNewsCategoryDetail(CategoryNews?.Id)}>{CategoryNews?.CategoryNewsName}</Link>
                        </Col>
                    </Row>
                    <div className={cx('list-document-content')}>
                        {/* <div className={cx('title-news')}>
                            <div className={cx('divider')}></div>
                            <Link to={commonRender.renderLinkNewsCategoryDetail(CategoryNews?.Id)}>{CategoryNews?.CategoryNewsName}</Link>
                        </div> */}
                        <Skeleton loading={isLoading} active>
                            <>
                                {Array.isArray(items) &&
                                    items.map((item) => {
                                        return <ListSectionNews title={item.Title} key={item.Id} avatar={item.Avatar} href={commonRender.renderLinkNewsDetail(item.Id)} />;
                                    })}
                            </>
                        </Skeleton>
                    </div>
                </div>
            </Col>
        </Row>
    );
}

export default ListSection;
