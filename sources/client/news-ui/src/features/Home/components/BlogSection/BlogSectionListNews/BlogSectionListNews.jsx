import classNames from 'classnames/bind';
import routes from 'config/configRoutes';
import { Link } from 'react-router-dom';
import styles from './BlogSectionListNews.module.scss';
import BlogSectionListNewsItem from './BlogSectionListNewsItem/BlogSectionListNewsItem';
import PropTypes from 'prop-types';
import { Skeleton } from 'antd';
import Marquee from 'react-easy-marquee';

const cx = classNames.bind(styles);

BlogSectionListNews.propTypes = {
    isLoading: PropTypes.bool,
    DocumentHots: PropTypes.array,
};

BlogSectionListNews.defaultProps = {
    isLoading: true,
};

function BlogSectionListNews(props) {
    const { isLoading, DocumentHots } = props;

    return (
        <div className={cx('wrapper')}>
            <div className={cx('title')}>
                <Link to={routes.publishedDocumentList}>
                    <h3 style={{ margin: 0 }}>VĂN BẢN CHỈ ĐẠO ĐIỀU HÀNH</h3>
                </Link>
            </div>
            <div className={cx('items')}>
                <Skeleton loading={isLoading} active>
                    {Array.isArray(DocumentHots) && (
                        // <Marquee duration={5000} height='100%' width='100%' axis='Y' pauseOnHover={true} reverse={true}>
                        <Marquee duration={DocumentHots.length * 5000} height='100%' width='100%' axis='Y' pauseOnHover={true} reverse={true}>
                            {DocumentHots.map((item, index) => {
                                return (
                                    <div key={index}>
                                        <BlogSectionListNewsItem DocumentData={item} />
                                    </div>
                                );
                            })}
                        </Marquee>
                    )}
                </Skeleton>
            </div>
        </div>
    );
}

export default BlogSectionListNews;
