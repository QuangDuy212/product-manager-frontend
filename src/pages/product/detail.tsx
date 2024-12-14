
import { callAddAProductToCart, callFetchProductById } from "@/config/api";
import { IProduct } from "@/types/backend";
import { useEffect, useRef, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import ImageGallery from "react-image-gallery";
import { original } from "@reduxjs/toolkit";
import './detail.scss'
import { Button, Col, InputNumber, message, Rate, Row } from "antd";
import { FaCartPlus } from "react-icons/fa";
import styles from 'styles/client.module.scss';
import { useDispatch } from "react-redux";
import { fetchCart } from "@/redux/slice/cartSlide";
import { useAppDispatch } from "@/redux/hooks";
import { addProduct } from "@/redux/slice/paySlide";


const ClientDetailProduct = () => {
    const [productDetail, setProductDetail] = useState<IProduct>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [imageProducts, setImageProducts] = useState<string[] | undefined>([]);
    const [isOpenModalGallery, setIsOpenModalGallery] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentQuantity, setCurrentQuantity] = useState(1);
    const refGallery = useRef(null);
    let location = useLocation();
    let params = new URLSearchParams(location.search);
    const id = params?.get("id");
    const navigate = useNavigate();
    const dispatch = useAppDispatch();


    useEffect(() => {
        const init = async () => {
            if (id) {
                setIsLoading(true)
                const res = await callFetchProductById(id);
                if (res?.data) {
                    setProductDetail(res.data);
                    let images = res?.data?.sliders;
                    images?.push(res?.data.thumbnail);
                    setImageProducts(images);
                }
                setIsLoading(false)
            }
        }
        init();
    }, [id]);

    useEffect(() => {
    }, [])


    const handleOnClickImage = () => {
        setIsOpenModalGallery(true);
        setCurrentIndex(refGallery?.current?.getCurrentIndex() ?? 0);
    }

    const onChange = (value) => {
        setCurrentQuantity(value);
    };


    const handleAddToCart = async (quantity: number, product: IProduct | undefined) => {
        if (product?._id) {
            const data = {
                quantity: quantity,
                productId: product._id,
            }
            const res = await callAddAProductToCart(data);
            if (res.statusCode == 200) {
                message.success("Thêm sản phẩm vào giỏ hàng thành công");
                dispatch(fetchCart());
            }

        }
    }

    const handleBuyNow = async (quantity: number, product: IProduct | undefined) => {
        if (product?._id) {
            const data = {
                quantity: quantity,
                productId: product._id,
            }
            const res = await callAddAProductToCart(data);
            if (res.statusCode == 200) {
                message.success("Thêm sản phẩm vào giỏ hàng thành công");
                dispatch(fetchCart());
            }
            navigate("/order");
        }
    }
    const settings = {
        customPaging: function (i: string) {
            return (
                <a>
                    <img src={`${i}`} />
                </a>
            );
        },
        dots: true,
        dotsClass: "slick-dots slick-thumb",
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    };

    const image = imageProducts?.map(i => {
        return {
            original: i,
            thumbnail: i
        }
    })

    return (
        <>
            <div className={styles["container"]} style={{ marginTop: 20 }}>
                <div className='container'>
                    <div className='content'>
                        <Row gutter={[20, 20]}>
                            <Col xl={10} md={24} sm={24} xs={24}>
                                <ImageGallery
                                    ref={refGallery}
                                    items={image}
                                    showFullscreenButton={false}
                                    showNav={false}
                                    showPlayButton={false}
                                    slideOnThumbnailOver={true}
                                    onClick={() => handleOnClickImage()}
                                />
                            </Col>
                            <Col xl={14} md={24} sm={24} xs={24}>
                                <div className='viewdetail__info'>
                                    <div className='viewdetail__info--name'>{productDetail?.name}</div>
                                    <div className='viewdetail__info--author'>Thể loại: {productDetail?.category?.name}</div>
                                    <div className='viewdetail__info--author'>Miêu tả: {productDetail?.shortDes}</div>
                                    <div className='viewdetail__info--rate'><Rate disabled defaultValue={5} /> Còn {productDetail?.quantity} sản phẩm</div>
                                    <div className='viewdetail__info--price' style={{ color: "#1677ff" }}>
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(productDetail?.price ?? 0)}
                                    </div>
                                    <div className='viewdetail__info--transport'>
                                        <span className='text1'>Vận chuyển </span>
                                        <span className='text2'>
                                            <span>Miễn phí vận chuyển</span>
                                        </span>
                                    </div>
                                    <div className='viewdetail__info--quantity'>
                                        <span className='text1'>Số lượng</span>

                                        <InputNumber
                                            min={1} max={productDetail?.quantity}
                                            defaultValue={1}
                                            onChange={onChange}
                                        />
                                    </div>
                                    <div className='viewdetail__info--btn'>
                                        <Row gutter={[20, 20]}>
                                            <Col xl={14} md={14} sm={24} xs={24}>
                                                <div style={{ display: "flex", justifyContent: "center", alignContent: "center" }}>
                                                    <Button
                                                        style={{
                                                            display: "flex",
                                                            justifyContent: "center",
                                                            alignItems: "center",
                                                            minWidth: "200px",
                                                            height: "48px",
                                                            boxShadow: "0 1px 1px 0 rgba(0, 0, 0, .03)",
                                                            outline: 0,
                                                            overflow: "visible",
                                                            position: "relative",
                                                        }}
                                                        onClick={() => handleAddToCart(currentQuantity, productDetail)}
                                                    >
                                                        <FaCartPlus style={{ margin: "0 5px 0 0", fontSize: "20px" }} />
                                                        Thêm vào giỏ hàng
                                                    </Button>
                                                </div>
                                            </Col>
                                            <Col xl={10} md={10} sm={24} xs={24}>
                                                <div style={{ display: "flex", justifyContent: "center", alignContent: "center" }}>
                                                    <Button
                                                        type="primary"
                                                        style={{
                                                            minWidth: "200px",
                                                            height: "48px",
                                                            outline: 0,
                                                            overflow: "visible",
                                                            position: "relative",
                                                        }}
                                                        onClick={() => handleBuyNow(currentQuantity, productDetail)}
                                                    >Mua ngay</Button>
                                                </div>
                                            </Col>
                                        </Row>


                                    </div>

                                </div>
                            </Col>
                        </Row>
                    </div>
                </div >
            </div>
        </>
    )
}

export default ClientDetailProduct;