
import styles from 'styles/client.module.scss';
import SearchClient from '@/components/client/search.client';
import JobCard from '@/components/client/card/category.card';
import { Divider, Button, Col, Form, Row, Select, notification, Spin, Card, Empty, Pagination } from 'antd';
import { EnvironmentOutlined, MonitorOutlined } from '@ant-design/icons';
import { convertSlug, LOCATION_LIST } from '@/config/utils';
import { ProForm } from '@ant-design/pro-components';
import { useEffect, useState } from 'react';
import { callFetchAllSkill, callFetchProduct, callSearchProduct } from '@/config/api';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { IProduct } from '@/types/backend';
import { isMobile } from 'react-device-detect';
import { Link } from 'react-router-dom';
import CategoryCard from '@/components/client/card/category.card';
import CompanyCard from '@/components/client/card/company.card';

const HomePage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [form] = Form.useForm();

    const [searchParams, setSearchParams] = useSearchParams();


    const [displayProduct, setDisplayProduct] = useState<IProduct[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(4);
    const [total, setTotal] = useState(0);
    const [filter, setFilter] = useState("");
    const [sortQuery, setSortQuery] = useState("sort=createdAt,desc");
    const [showPagination, setShowPagination] = useState<boolean>(false);
    const [query, setQuery] = useState<string>("");


    useEffect(() => {
        fetchProduct(query, "search");
    }, [query])

    useEffect(() => {
        fetchProduct("", "normal");
    }, [current, pageSize, filter, sortQuery]);

    const fetchProduct = async (value: string, type: string) => {
        setIsLoading(true)
        if (type == "search") {
            let queryLocal = `page=${current}&size=${pageSize}`;
            const res = await callFetchProduct(queryLocal);
            if (res && res.data) {
                setDisplayProduct(res.data.result);
                setTotal(res.data.meta.total)
            }
        } else {
            let queryLocal = `query=${query}&page=${current}&size=${pageSize}`;
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
        <div className={`${styles["container"]} ${styles["home-section"]}`}>
            <div className="search-content" style={{ marginTop: 20 }}>
                <SearchClient
                    query={query}
                    setQuery={setQuery}
                />
            </div>
            <Divider />
            <CompanyCard
                query={query}
                setQuery={setQuery}
            />
            <div style={{ margin: 50 }}></div>
            <Divider />
            <CategoryCard />
        </div>
    )
}

export default HomePage;