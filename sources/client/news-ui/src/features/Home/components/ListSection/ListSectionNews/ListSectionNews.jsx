import classNames from 'classnames/bind';
import imageHelper from 'helpers/imageHelper';
import stringHelper from 'helpers/stringHelper';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styles from './ListSectionNews.module.scss';

const cx = classNames.bind(styles);

ListSectionNews.propTypes = {
    title: PropTypes.string,
    href: PropTypes.string,
    avatar: PropTypes.string,
};

ListSectionNews.defaultProps = {};

function ListSectionNews(props) {
    let { title, href, avatar } = props;
    if (title?.length > 100) {
        title = title?.slice(0, 100) + '...';
    }
    return (
        <Link className={cx('wrapper')} to={href}>
            {stringHelper.isNullOrEmpty(avatar) && <img src={imageHelper.getLinkImageUrl(avatar)} alt='img' />}
            <div className={cx('title-text')}>
                {title} <span className={cx('new-item')}>Mới</span>
            </div>
        </Link>
    );
}

export default ListSectionNews;
