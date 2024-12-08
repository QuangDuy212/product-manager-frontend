import { callFetchCategoryById, callFetchProductByCategory } from "@/config/api";
import { convertSlug } from "@/config/utils";
import { ICategory, IProduct } from "@/types/backend";
import { Card, Col, Divider, Empty, Pagination, Row, Spin } from "antd";
import { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { Link } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import styles from 'styles/client.module.scss';

const CategoryDetailPage = () => {
    const [showPagination, setShowPagination] = useState<boolean>(true);
    const [categoryDetail, setCategoryDetail] = useState<ICategory | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [displayProduct, setDisplayProduct] = useState<IProduct[] | null>(null);

    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(4);
    const [total, setTotal] = useState(0);
    const [filter, setFilter] = useState("");
    const [sortQuery, setSortQuery] = useState("sort=createdAt,desc");
    const navigate = useNavigate();

    let location = useLocation();
    let params = new URLSearchParams(location.search);
    const id = params?.get("id"); // job id

    useEffect(() => {
        const init = async () => {
            if (id) {
                setIsLoading(true)
                const res = await callFetchCategoryById(id);
                if (res?.data) {
                    setCategoryDetail(res.data)
                }
                const response = await callFetchProductByCategory(id);
                if (response?.data) {
                    setDisplayProduct(response.data.result);
                }
                setIsLoading(false)
            }
        }
        init();
    }, [id]);

    console.log(">>> check cate", displayProduct)
    const handleOnchangePage = (pagination: { current: number, pageSize: number }) => {
        if (pagination && pagination.current !== current) {
            setCurrent(pagination.current)
        }
        if (pagination && pagination.pageSize !== pageSize) {
            setPageSize(pagination.pageSize)
            setCurrent(1);
        }
    }

    const handleViewDetailJob = (item: IProduct) => {
        if (item.name) {
            const slug = convertSlug(item.name);
            navigate(`/product/${slug}?id=${item._id}`)
        }
    }
    return (
        <>
            <div className={styles["container"]} style={{ marginTop: 20 }}>
                <Row gutter={[20, 20]}>
                    <Col span={24}>
                        <div className={`${styles["company-section"]}`}>
                            <div className={styles["company-content"]}>
                                <Spin spinning={isLoading} tip="Loading...">
                                    <Row gutter={[20, 20]}>
                                        <Col span={24}>
                                            <div className={isMobile ? styles["dflex-mobile"] : styles["dflex-pc"]}>
                                                <span className={styles["title"]} style={{ fontSize: "27px" }}>{categoryDetail?.name}</span>
                                                {!showPagination &&
                                                    <Link to="product">Xem tất cả</Link>
                                                }
                                            </div>
                                        </Col>

                                        {displayProduct?.map(item => {
                                            return (
                                                <Col span={24} md={6} key={item._id}>
                                                    <Card
                                                        onClick={() => handleViewDetailJob(item)}
                                                        style={{ height: 370 }}
                                                        hoverable
                                                        cover={
                                                            <div className={styles["card-customize"]} >
                                                                <img
                                                                    style={{ maxWidth: "200px" }}
                                                                    alt="example"
                                                                    src={item.thumbnail}
                                                                />
                                                            </div>
                                                        }
                                                    >
                                                        <Divider />
                                                        <h3 style={{ textAlign: "center" }}>{item.name}</h3>
                                                        {
                                                            item.discount > 0
                                                                ?
                                                                <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                                                    <span style={{
                                                                        color: "#d70018",
                                                                        fontWeight: 600,
                                                                        fontSize: "16px"
                                                                    }}>{item.price - item.discount} đ</span>
                                                                    <span style={{
                                                                        marginLeft: "10px",
                                                                        textDecoration: "line-through",
                                                                        fontWeight: 600,
                                                                        fontSize: "16px",
                                                                        color: "#707070"
                                                                    }}>{item.price} đ</span>
                                                                </div>
                                                                :
                                                                <div
                                                                    style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                                                    <span style={{
                                                                        marginLeft: "10px",
                                                                        fontWeight: 600,
                                                                        fontSize: "16px",
                                                                    }}>{item.price} đ</span>
                                                                </div>
                                                        }
                                                    </Card>
                                                </Col>
                                            )
                                        })}

                                        {(!displayProduct || displayProduct && displayProduct.length === 0)
                                            && !isLoading &&
                                            <div className={styles["empty"]} style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }}>
                                                <Empty description="Không có dữ liệu" />
                                            </div>
                                        }
                                    </Row>
                                    {showPagination && <>
                                        <div style={{ marginTop: 30 }}></div>
                                        <Row style={{ display: "flex", justifyContent: "center" }}>
                                            <Pagination
                                                current={current}
                                                total={total}
                                                pageSize={pageSize}
                                                responsive
                                                onChange={(p: number, s: number) => handleOnchangePage({ current: p, pageSize: s })}
                                            />
                                        </Row>
                                    </>}
                                </Spin>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>

        </>
    )
}

export default CategoryDetailPage;