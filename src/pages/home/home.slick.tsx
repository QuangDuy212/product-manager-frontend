
import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
const HomeSlick = () => {

    function CustomSlide(props: any) {
        const { url, ...otherProps } = props;
        return (
            <div {...otherProps} style={{ width: "100%", height: "400px", backgroundColor: "#000" }}>
                <img src={url} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
            </div>
        );
    }
    const settings = {
        dots: true,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        speed: 200,
        autoplaySpeed: 2000,
        cssEase: "linear"
    };
    return (
        <div className="slider-container" style={{ height: "100%" }}>
            <div className="slider-container">
                <Slider {...settings}>
                    <CustomSlide url={'./../../../public/img/advest1.webp'} />
                    <CustomSlide url={'./../../../public/img/advest4.jpg'} />
                    <CustomSlide url={'./../../../public/img/advest5.jpg'} />
                    <CustomSlide url={'./../../../public/img/advest6.jpg'} />
                    <CustomSlide url={'./../../../public/img/advest1.webp'} />
                    <CustomSlide url={'./../../../public/img/advest1.webp'} />
                </Slider>
            </div>
        </div>
    )
}
export default HomeSlick;