import { callFetchProductByCategory } from "@/config/api";
import { convertSlug, TextAbstract } from "@/config/utils";
import { ICategory, IProduct } from "@/types/backend";
import { Col, Divider, Empty, Row } from "antd";
import { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import styles from 'styles/client.module.scss';

interface IProps {
    id: string | undefined;
    name: string;
}
const ProductByCategory = (props: IProps) => {
    const { id, name } = props;
    const [products, setProducts] = useState<IProduct[]>();
    const [linkName, setLinkName] = useState<String>("");
    const navigate = useNavigate();
    useEffect(() => {
        fetchProductByCategory();
        handleConverLink();
    }, [])

    const fetchProductByCategory = async () => {
        const query = 'page=1&size=6';
        if (id) {
            const res = await callFetchProductByCategory(id, query);
            if (res?.statusCode == 200) {
                setProducts(res.data?.result)
            }
        }
    }

    const handleViewDetailJob = (item: IProduct) => {
        if (item.name && item.quantity !== 0) {
            const slug = convertSlug(item.name);
            navigate(`/product/${slug}?id=${item._id}`)
        }
    }
    const handleConverLink = () => {
        const slug = convertSlug(name);
        setLinkName(`/category/${slug}?id=${id}`)
    }

    return (
        <>{products && products.length > 0 &&
            <Row gutter={[20, 20]}>
                <Col span={24}>
                    <div className={isMobile ? styles["dflex-mobile"] : styles["dflex-pc"]}>
                        <span className={styles["title"]} style={{ fontSize: "27px" }}>{name}</span>

                        <Link to={`${linkName}`}>Xem tất cả</Link>

                    </div>
                </Col>
                {products && products.map(item => (
                    <Col xl={4} md={12} xs={24} key={item._id}>
                        <div className='product-card'
                            style={{ cursor: "pointer", overflow: "hidden", border: "1px solid #f2f2f2", borderRadius: "4px", position: "relative" }}
                            onClick={() => handleViewDetailJob(item)}
                        >
                            {item.quantity == 0 &&
                                <div style={{
                                    position: "absolute", width: "100%", height: "100%",
                                    backgroundColor: "rgba(204, 204, 204,0.4)",
                                    display: "flex", justifyContent: "center", alignItems: "center"
                                }}>
                                    <div style={{
                                        backgroundColor: "#fff", padding: "6px"
                                    }}>Hết hàng</div>
                                </div>}
                            <div style={{ height: "188px" }}>
                                <img
                                    style={{ width: "100%", height: "100%", objectFit: "contain" }}
                                    alt="example"
                                    src={item.thumbnail}
                                />
                            </div>
                            <div style={{ padding: "10px" }}>
                                <div style={{ fontSize: "14px", fontWeight: 400, height: "50px" }}>
                                    {TextAbstract(item?.name ?? "", 45)}
                                </div>
                                <div style={{ fontSize: "18px", marginTop: "10px", color: "#f57224" }}>
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price ?? 0)}
                                </div>
                            </div>
                        </div>
                    </Col>
                ))}
            </Row>
        }
            {products && products.length > 0 &&
                <Divider />}
        </>
    )
}

export default ProductByCategory;