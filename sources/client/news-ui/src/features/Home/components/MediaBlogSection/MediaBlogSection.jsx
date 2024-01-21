import classNames from "classnames/bind";
import routes from "config/configRoutes";
import Images from "../../../../common/images";
import styles from "./MediaBlogSection.module.scss";
import MediaBlogSectionBanner from "./MediaBlogSectionBanner/MediaBlogSectionBanner";
import MediaBlogSectionButton from "./MediaBlogSectionButton/MediaBlogSectionButton";
import PropTypes from "prop-types";
import { Col, Row, Skeleton } from "antd";

const cx = classNames.bind(styles);

MediaBlogSection.propTypes = {
  AlbumImages: PropTypes.array,
  isLoading: PropTypes.bool,
};

MediaBlogSection.defaultProps = {
  isLoading: false,
};

function MediaBlogSection(props) {
  const { isLoading, AlbumImages } = props;

  return (
    <Row gutter={8}>
      <Col span={24} gutter={8}>
        <Row className={cx("navbar")}>
          <Col md={12}>
            <div className={cx("navbar-left")}>
              <MediaBlogSectionButton
                href={"/"}
                size="large"
                label="MULTIMEDIA"
                imageName={Images.MULTIMEDIA}
              />
            </div>
          </Col>
          <Col md={12}>
            <Row justify="end">
              <Col span={24} className={cx("navbar-right")}>
                <MediaBlogSectionButton
                  href={routes.publishedVideos}
                  size="small"
                  label="Video"
                  imageName={Images.VIDEO}
                />
                <MediaBlogSectionButton
                  href={routes.publishedRadios}
                  size="small"
                  label="Radio News"
                  imageName={Images.RADIO}
                />
                <MediaBlogSectionButton
                  href={"/"}
                  size="small"
                  label="Infographics"
                  imageName={Images.INFOGRAPHICS}
                />
                <MediaBlogSectionButton
                  href={routes.publishedPhotos}
                  size="small"
                  label="Photos"
                  imageName={Images.PHOTO}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </Col>
      <Col span={24} className={cx("carousel")}>
        {isLoading ? (
          <Skeleton.Image
            loading={isLoading}
            style={{ width: "998px", height: 300 }}
            active
          ></Skeleton.Image>
        ) : (
          <>
            <MediaBlogSectionBanner AlbumImages={AlbumImages} />
          </>
        )}
      </Col>
    </Row>
  );
}

export default MediaBlogSection;
