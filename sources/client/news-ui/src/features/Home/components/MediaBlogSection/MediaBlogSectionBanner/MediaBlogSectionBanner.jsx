import classNames from "classnames/bind";
import commonRender from "common/commonRender";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useNavigate } from "react-router-dom";
import styles from "./MediaBlogSectionBanner.module.scss";
import PropTypes from "prop-types";
import useWindowDimensions from "customHooks/useWindowDimensions";
import imageHelper from "helpers/imageHelper";
const cx = classNames.bind(styles);

MediaBlogSectionBanner.propTypes = {
  AlbumImages: PropTypes.array,
};

MediaBlogSectionBanner.defaultProps = {};

function MediaBlogSectionBanner(props) {
  const { AlbumImages } = props;

  const { height, width } = useWindowDimensions();
  const navigate = useNavigate();

  console.log("width", width);

  // const Images = [
  //     {
  //         AlbumID: 1,
  //         Name: 'Yên Bái - Điểm đến của các nhà đầu tư',
  //         ImageUrl: 'https://yenbai.gov.vn/noidung/hinhanhvideo/Lists/HinhAnh/Attachments/261/khoicongnhamayongthepHOASEN.JPG',
  //     },
  //     {
  //         AlbumID: 2,
  //         Name: 'Khởi sắc nông thôn mới Yên Bái',
  //         ImageUrl: 'https://yenbai.gov.vn/noidung/hinhanhvideo/Lists/HinhAnh/Attachments/271/DSC_0810.JPG',
  //     },
  //     {
  //         AlbumID: 3,
  //         Name: 'Một số hình ảnh của Tổng Bí thư, Chủ tịch nước Nguyễn Phú Trọng tại tỉnh Yên Bái',
  //         ImageUrl: 'https://yenbai.gov.vn/noidung/hinhanhvideo/Lists/HinhAnh/Attachments/284/1.jpg',
  //     },
  //     {
  //         AlbumID: 4,
  //         Name: 'Một số hình ảnh của Tổng Bí thư, Chủ tịch nước Nguyễn Phú Trọng tại tỉnh Yên Bái',
  //         ImageUrl: 'https://yenbai.gov.vn/noidung/hinhanhvideo/Lists/HinhAnh/Attachments/289/6.jpg',
  //     },
  //     {
  //         AlbumID: 5,
  //         Name: 'Các lễ hội truyền thống',
  //         ImageUrl: 'https://yenbai.gov.vn/noidung/hinhanhvideo/Lists/HinhAnh/Attachments/146/_khaimac%20DL%20ve%20coi%20nguon.jpg',
  //     },
  // ];

  function handleOnClickImage(albumID) {
    navigate(commonRender.renderLinkPhotos(albumID));
  }

  return (
    <div className={cx("wrapper")}>
      <Carousel
        showStatus={false}
        showThumbs={false}
        autoPlay={true}
        interval={2000}
        infiniteLoop={true}
      >
        {Array.isArray(AlbumImages) &&
          AlbumImages.map((image) => {
            var urlImage = image.ImagePath
              ? image.ImagePath.split(";;")[0]
              : "";
            urlImage = imageHelper.getLinkImageUrl(urlImage);

            return (
              <div
                key={image.Id}
                onClick={() => {
                  handleOnClickImage(image.Id);
                }}
                style={{ cursor: "pointer" }}
              >
                <LazyLoadImage
                  effect="blur"
                  src={urlImage}
                  alt={urlImage}
                  height={width > 767 ? 440 : 200}
                  width={width > 767 ? 1000 : width}
                />
              </div>
            );
          })}

        {/* <div>
                    <LazyLoadImage effect='blur' src={Images.DEMO_MEDIA_1} alt='' />
                </div>
                <div>
                    <LazyLoadImage effect='blur' src={Images.DEMO_MEDIA_1} alt='' />
                </div>
                <div>
                    <LazyLoadImage effect='blur' src={Images.DEMO_MEDIA_1} alt='' />
                </div>
                <div>
                    <LazyLoadImage effect='blur' src={Images.DEMO_MEDIA_1} alt='' />
                </div>
                <div>
                    <LazyLoadImage effect='blur' src={Images.DEMO_MEDIA_1} alt='' />
                </div> */}
      </Carousel>
    </div>
  );
}

export default MediaBlogSectionBanner;
