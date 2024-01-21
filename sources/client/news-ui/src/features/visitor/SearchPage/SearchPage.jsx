import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './SearchPage.module.scss';
import classNames from 'classnames/bind';
import { useSearchParams } from 'react-router-dom';
import { Button, Divider, Form, Input, Pagination } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import SearchPageItem from '../components/SearchPageItem/SearchPageItem';
import { commonRenderTable } from 'common/commonRender';

const cx = classNames.bind(styles);

SearchPage.propTypes = {};

SearchPage.defaultProps = {};

var dataFake = {
    avatar: 'https://yenbai.gov.vn/noidung/tintuc/PublishingImages/Hien-Trang/hoi%20nghi/khaimachn0102022.jpg',
    title: 'Bồi dưỡng kỹ năng hoạt động cho Chủ tịch HĐND, Phó Chủ tịch HĐND cấp xã',
    date: '2022-09-30T13:54:50.005Z',
    description:
        'CTTĐT - Sáng 4/10, Thường trực HĐND tỉnh Yên Bái tổ chức bồi dưỡng kỹ năng hoạt động cho Chủ tịch HĐND, Phó Chủ tịch HĐND cấp xã thuộc thành phố Yên Bái và các huyện: Trấn Yên, Yên Bình năm 2022.',
    href: 'http://localhost:3000/document/123456789',
};

const LIST_ITEM = [];
for (let index = 0; index < 5; index++) {
    LIST_ITEM.push(dataFake);
}
// avatar: PropTypes.string,
// title: PropTypes.string,
// date: PropTypes.string,
// description: PropTypes.string,
// href: PropTypes.string,

function SearchPage(props) {
    const [searchParams, setSearchParams] = useSearchParams();
    var textSearch = searchParams.get('text');

    useEffect(() => {}, []);

    return (
        <div className={cx('wrapper')}>
            <Form
                name='customized_form_controls'
                layout='inline'
                style={{
                    padding: '16px',
                }}
                // onFinish={onFinish}
                initialValues={{
                    'text-search': textSearch ?? '',
                }}
            >
                <Form.Item name='text-search' label='Từ khóa tìm kiếm' style={{ width: 'calc(100% / 2)' }}>
                    <Input placeholder='Nhập từ khóa tìm kiếm' />
                </Form.Item>
                <Form.Item>
                    <Button type='default' htmlType='submit' icon={<SearchOutlined />}>
                        Tìm kiếm
                    </Button>
                </Form.Item>
            </Form>
            <Divider style={{ margin: 0 }}></Divider>
            <div className={cx('search-content')}>
                {LIST_ITEM.map((item) => {
                    return <SearchPageItem avatar={item.avatar} date={item.date} description={item.description} href={item.href} key={Date.now()} title={item.title} />;
                })}
            </div>
            <div className={cx('pagination')}>
                <Pagination defaultCurrent={0} total={500} showTotal={() => commonRenderTable.showTableTotalPagination(500)} />
            </div>
        </div>
    );
}

export default SearchPage;
