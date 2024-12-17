import Slider from "react-slick";


const AvestoneSlick = () => {
    function CustomSlide(props: any) {
        const { url, ...otherProps } = props;
        return (
            <div {...otherProps} style={{ width: "100%", height: "195px", backgroundColor: "#000", borderRadius: "10px", overflow: "hidden" }}>
                <img src={url} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
        );
    }
    const settings = {
        dots: false,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        speed: 500,
        autoplaySpeed: 2500,
        cssEase: "linear",
        nextArrow: <></>,
        prevArrow: <></>,
    };
    return (
        <div className="slider-container" style={{ height: "100%" }}>
            <div className="slider-container">
                <Slider {...settings}>
                    <CustomSlide url={'./../../../public/img/rolex/rolex1.jpg'} />
                    <CustomSlide url={'./../../../public/img/rolex/rolex2.jpg'} />
                    <CustomSlide url={'./../../../public/img/rolex/rolex3.jpg'} />
                </Slider>
            </div>
        </div>
    )
}
export default AvestoneSlick;