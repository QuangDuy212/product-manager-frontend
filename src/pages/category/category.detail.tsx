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
    const [pageSize, setPageSize] = useState(20);
    const [total, setTotal] = useState(0);
    const [filter, setFilter] = useState("");
    const [sortQuery, setSortQuery] = useState("sort=createdAt,desc");
    const [query, setQuery] = useState<string>("");
    const navigate = useNavigate();

    let location = useLocation();
    let params = new URLSearchParams(location.search);
    const id = params?.get("id");

    useEffect(() => {
        fetchProductByCategory()
    }, [query])

    const fetchProductByCategory = async () => {
        if (id) {
            setIsLoading(true)
            const resvip = await callFetchCategoryById(id);
            if (resvip?.data) {
                setCategoryDetail(resvip.data)
            }
            const res = await callFetchProductByCategory(id, query);
            if (res?.statusCode == 200) {
                setDisplayProduct(res.data?.result)
            }
            setIsLoading(false)
        }
    }

    const handleOnchangePage = (pagination: { current: number, pageSize: number }) => {
        if (pagination && pagination.current !== current) {
            setCurrent(pagination.current)
            setQuery(`page=${pagination.current}&size=${pageSize}`)
        }
        if (pagination && pagination.pageSize !== pageSize) {
            setPageSize(pagination.pageSize)
            setCurrent(1);
            setQuery(`page=${1}&size=${pagination.pageSize}`)
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
            <div className={styles["container"]} style={{ marginTop: 100, marginBottom: 100 }}>
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
                                                <Col span={12} md={4} key={item._id}>
                                                    <div className='product-card'
                                                        style={{ overflow: "hidden", border: "1px solid #f2f2f2", borderRadius: "4px" }}
                                                        onClick={() => handleViewDetailJob(item)}
                                                    >
                                                        <div style={{ height: "150px", objectFit: "cover" }}>
                                                            <img
                                                                style={{ width: "100%", height: "100%" }}
                                                                alt="example"
                                                                src={item.thumbnail}
                                                            />
                                                        </div>
                                                        <div style={{ padding: "10px" }}>
                                                            <div style={{ fontSize: "14px", fontWeight: 400 }}>
                                                                {item?.name}
                                                            </div>
                                                            <div style={{ fontSize: "18px", marginTop: "10px", color: "#f57224" }}>
                                                                {item?.price} đ
                                                            </div>
                                                        </div>
                                                    </div>
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