import classNames from 'classnames/bind';
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './BlogSectionShortNews.module.scss';
import PropTypes from 'prop-types';
import commonRender from 'common/commonRender';
import imageHelper from 'helpers/imageHelper';

const cx = classNames.bind(styles);

BlogSectionShortNews.propTypes = {
    data: PropTypes.object,
};

function BlogSectionShortNews(props) {
    const { data } = props;
    const { Id, Title, Avatar, AvatarTitle, Description } = data;

    // const data = {
    //     link: '/document/123456789',
    //     title: 'Thông tin chỉ đạo điều hành nổi bật của UBND tỉnh trong tuần (từ 12 - 18/9)',
    //     image: 'https://yenbai.gov.vn/noidung/tintuc/PublishingImages/Hien-Trang/hoi%20nghi/2309202022_1.jpg',
    //     content: 'CTTĐT - Sáng 23/9, tại Trụ sở Chính phủ, Thủ tướng Phạm Minh Chính chủ trì Diễn đàn kinh tế hợp tác, hợp tác xã năm 2022 do Bộ Kế hoạch và Đầu tư phối hợp với.....',
    // };

    return (
        <div className={cx('wrapper')}>
            <Link to={commonRender.renderLinkNewsDetail(Id)} underline='none' color='inherit'>
                <h3 style={{ fontSize: 14 }}>{Title}</h3>
            </Link>
            <img src={imageHelper.getLinkImageUrl(Avatar)} alt={AvatarTitle} width={'100%'} style={{maxHeight: 300}} />
            <div className={cx('content')}>{Description?.slice(0, 200)}...</div>
        </div>
    );
}

export default BlogSectionShortNews;
