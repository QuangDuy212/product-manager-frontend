import { Breadcrumb, Col, Divider, Empty, Pagination, Row } from 'antd';
import styles from 'styles/client.module.scss';
import CompanyCard from '@/components/client/card/company.card';
import SearchClient from '@/components/client/search.client';
import { useEffect, useState } from 'react';
import FilterProduct from './filter';
import { isMobile } from 'react-device-detect';
import { IProduct } from '@/types/backend';
import { useNavigate } from 'react-router-dom';
import { convertSlug, TextAbstract } from '@/config/utils';
import { callFetchProduct, callSearchProduct } from '@/config/api';
import { useAppSelector } from '@/redux/hooks';

const ClientCompanyPage = (props: any) => {

    const [displayProduct, setDisplayProduct] = useState<IProduct[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [total, setTotal] = useState(0);
    const [filter, setFilter] = useState("");
    const [sortQuery, setSortQuery] = useState("sort=createdAt,desc");
    const navigate = useNavigate();

    //redux:
    const query = useAppSelector(state => state.search.query);


    useEffect(() => {
        if (query)
            fetchProduct(query, "search");
    }, [query])

    useEffect(() => {
        if (filter || filter == "")
            fetchProduct(filter, "filter");
    }, [filter])

    useEffect(() => {
        fetchProduct("", "normal");
    }, [current, pageSize, sortQuery]);

    const fetchProduct = async (value: string, type: string) => {
        setIsLoading(true)
        let queryLocal = query ? `query=${query}&page=${current}&size=${pageSize}` : `page=${current}&size=${pageSize}`;
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
        } else if (type == "filter") {
            let query1 = `page=${current}&size=${pageSize}${filter}`
            const res = await callFetchProduct(query1);
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
        <div className={styles["container"]} style={{ marginTop: 100, marginBottom: 100 }}>
            <Breadcrumb
                items={[
                    {
                        title: <a href="/">Home</a>,
                    },
                    {
                        title: 'Product',
                    },
                ]}
            />
            <Row gutter={[20, 20]}>
                <Col span={24}>
                    <div className={isMobile ? styles["dflex-mobile"] : styles["dflex-pc"]}>
                        <span className={styles["title"]} style={{ fontSize: "27px" }}>Tất cả sản phẩm</span>

                    </div>
                </Col>
                <Col xl={4} md={6} xs={24}>
                    <FilterProduct setFilter={setFilter}
                    />
                </Col>
                <Col xl={20} md={18} xs={24}>
                    <Row gutter={[20, 20]}>
                        {displayProduct?.map(item => {
                            return (
                                <Col md={4} xl={6} xs={12} key={item._id}>
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
                                                {TextAbstract(item?.name ?? '', 45)}
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
                            <div className={styles["empty"]} style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                                <Empty description="Không có dữ liệu" />
                            </div>
                        }
                    </Row>
                    {true && <>
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
                </Col>
            </Row>
        </div>
    )
}

export default ClientCompanyPage;