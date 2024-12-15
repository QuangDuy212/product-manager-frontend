
import { callFetchProduct, callSearchProduct } from '@/config/api';
import { convertSlug, TextAbstract } from '@/config/utils';
import { ICompany, IProduct } from '@/types/backend';
import { Card, Col, Divider, Empty, Pagination, Row, Spin } from 'antd';
import { useState, useEffect } from 'react';
import { isMobile } from 'react-device-detect';
import { Link, useNavigate } from 'react-router-dom';
import styles from 'styles/client.module.scss';
import './company.card.scss'

interface IProps {
    showPagination?: boolean;
    query: string;
    setQuery: (v: string) => void;
}

const CompanyCard = (props: IProps) => {
    const { showPagination = false, query, setQuery } = props;

    const [displayProduct, setDisplayProduct] = useState<IProduct[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(100);
    const [total, setTotal] = useState(0);
    const [filter, setFilter] = useState("");
    const [sortQuery, setSortQuery] = useState("sort=createdAt,desc");
    const navigate = useNavigate();

    useEffect(() => {
        if (query)
            fetchProduct(query, "search");
    }, [query])

    useEffect(() => {
        fetchProduct("", "normal");
    }, [current, pageSize, filter, sortQuery]);

    const fetchProduct = async (value: string, type: string) => {
        setIsLoading(true)
        let queryLocal = query ? `query=${query}page=${current}&size=${pageSize}` : `page=${current}&size=${pageSize}`;
        if (type == "normal") {
            const res = await callFetchProduct(queryLocal);
            if (res && res.data) {
                setDisplayProduct(res.data.result);
                setTotal(res.data.meta.total)
            }
        } else if (type == "search") {
            const res = await callSearchProduct(queryLocal);
            if (res && res.data) {
                setDisplayProduct(res.data.result);
                setTotal(res.data.meta.total)
            }
        }
        setIsLoading(false)
    }


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
        <div className={`${styles["company-section"]}`}>
            <div className={styles["company-content"]}>
                <Spin spinning={isLoading} tip="Loading...">
                    <Row gutter={[20, 20]}>
                        <Col span={24}>
                            <div className={isMobile ? styles["dflex-mobile"] : styles["dflex-pc"]}>
                                <span className={styles["title"]} style={{ fontSize: "27px" }}>Tất cả sản phẩm</span>
                                {!showPagination &&
                                    <Link to="product">Xem tất cả</Link>
                                }
                            </div>
                        </Col>

                        {displayProduct?.map(item => {
                            return (
                                <Col xl={4} md={12} xs={24} key={item._id}>
                                    <div className='product-card'
                                        style={{ overflow: "hidden", border: "1px solid #f2f2f2", borderRadius: "4px" }}
                                        onClick={() => handleViewDetailJob(item)}
                                    >
                                        <div style={{ height: "188px" }}>
                                            <img
                                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                                alt="example"
                                                src={item.thumbnail}
                                            />
                                        </div>
                                        <div style={{ padding: "10px" }}>
                                            <div style={{ fontSize: "14px", fontWeight: 400, height: "42px" }}>
                                                {TextAbstract(item?.name ?? "", 50)}
                                            </div>
                                            <div style={{ fontSize: "18px", marginTop: "10px", color: "#f57224" }}>
                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price ?? 0)}
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            )
                        })}

                        {(!displayProduct || displayProduct && displayProduct.length === 0)
                            && !isLoading &&
                            <div className={styles["empty"]}>
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
    )
}

export default CompanyCard;