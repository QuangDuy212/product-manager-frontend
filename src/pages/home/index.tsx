
import styles from 'styles/client.module.scss';
import SearchClient from '@/components/client/search.client';
import JobCard from '@/components/client/card/category.card';
import { Divider, Button, Col, Form, Row, Select, notification, Spin, Card, Empty, Pagination } from 'antd';
import { EnvironmentOutlined, MonitorOutlined } from '@ant-design/icons';
import { convertSlug, LOCATION_LIST } from '@/config/utils';
import { ProForm } from '@ant-design/pro-components';
import { useEffect, useState } from 'react';
import { callFetchAllSkill, callFetchCategory, callFetchProduct, callSearchProduct } from '@/config/api';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { ICategory, IProduct } from '@/types/backend';
import { isMobile } from 'react-device-detect';
import { Link } from 'react-router-dom';
import CategoryCard from '@/components/client/card/category.card';
import CompanyCard from '@/components/client/card/company.card';
import Slider from 'react-slick';
import HomeSlick from './home.slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ProductByCategory from './product.by.category';
import Categories from './categories.list';
import AvestoneSlick from './avestone.slick';
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
    const [categories, setCategories] = useState<ICategory[]>();

    useEffect(() => {
        fetchCategory()
    }, [])

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

    const fetchCategory = async () => {
        const page = 1;
        const size = 4;
        const res = await callFetchCategory(`page=${page}&size=${size}`);
        if (res.statusCode == 200) {
            setCategories(res.data?.result);
        }
    }


    return (
        <div className={`${styles["container"]} ${styles["home-section"]}`} style={{ marginTop: "80px" }}>
            <div >
                <Row gutter={[12, 12]}>
                    <Col xl={18} md={0} xs={0}>
                        <HomeSlick />
                    </Col>

                    <Col xl={6} md={0} xs={0}>

                        <div style={{ width: "100%", height: "195px", backgroundColor: "#000", borderRadius: "10px" }}>
                            <AvestoneSlick />
                        </div>

                        <div style={{ width: "100%", height: "195px", backgroundColor: "#000", marginTop: "10px", borderRadius: "10px" }}>
                            <img src='./../../../public/img/advest8.jpg' style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                        </div>
                    </Col>

                </Row>
            </div>
            <Divider />
            <CompanyCard
                query={query}
                setQuery={setQuery}
            />
            <div style={{ margin: 50 }}></div>
            <Divider />
            <Categories data={categories ?? []} />
            <Divider />
            {/* <CategoryCard /> */}
            {categories && categories.map(i => <ProductByCategory id={i._id} name={i?.name ? i.name : ""} />)}
        </div>
    )
}

export default HomePage;