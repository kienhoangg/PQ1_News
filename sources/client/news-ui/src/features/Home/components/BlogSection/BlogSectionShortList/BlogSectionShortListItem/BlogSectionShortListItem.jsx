import classNames from 'classnames/bind';
import commonRender from 'common/commonRender';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styles from './BlogSectionShortListItem.module.scss';
const cx = classNames.bind(styles);

BlogSectionShortListItem.propTypes = {
    className: PropTypes.string,
    onHover: PropTypes.func,
    data: PropTypes.object,
};

BlogSectionShortListItem.defaultProps = {
    className: '',
    data: undefined,
};

function BlogSectionShortListItem(props) {
    const { className, data, onHover } = props;
    const { Id, Title, Avatar, AvatarTitle, Description } = data;

    // const data = {
    //     href: '/document/123456789',
    //     label: 'Thúc đẩy chuyển đổi số phục vụ cho học tập suốt đời sau đại dịch COVID-19',
    // };

    return (
        <Link
            onMouseEnter={() => {
                if (onHover) onHover({ ...data, isEnter: true });
            }}
            onMouseLeave={() => {
                if (onHover) onHover({ ...data, isEnter: false });
            }}
            className={cx('wrapper') + ` ${className}`}
            underline='none'
            to={commonRender.renderLinkNewsDetail(Id)}
            color='inherit'
        >
            <div className={cx('news-hot-icon')}></div>
            <div className={cx('content')}>{Title}</div>
        </Link>
    );
}

export default BlogSectionShortListItem;
