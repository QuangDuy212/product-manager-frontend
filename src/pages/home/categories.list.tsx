import { convertSlug } from "@/config/utils";
import { ICategory } from "@/types/backend";
import { Col, Divider, Row } from "antd";
import { isMobile } from "react-device-detect";
import { Link, Navigate, useNavigate } from "react-router-dom";
import styles from 'styles/client.module.scss';

interface IProps {
    data: ICategory[];
}
const Categories = (props: IProps) => {
    const { data } = props;
    const navigate = useNavigate();

    const handleViewDetailJob = (item: ICategory) => {
        if (item.name) {
            const slug = convertSlug(item.name);
            navigate(`/category/${slug}?id=${item._id}`)
        }
    }
    return (
        <>
            {data && data.length > 0 &&
                <Row gutter={[2, 2]}>
                    <Col span={24}>
                        <div className={isMobile ? styles["dflex-mobile"] : styles["dflex-pc"]}>
                            <span className={styles["title"]} style={{ fontSize: "27px" }}>Categoires</span>

                            <Link to={`/category`}>Xem tất cả</Link>

                        </div>
                    </Col>
                    {data && data.map(item => (
                        <Col span={12} md={4} key={item._id}>
                            <div className='product-card'
                                style={{ overflow: "hidden", border: "1px solid #f2f2f2", borderRadius: "4px" }}
                                onClick={() => handleViewDetailJob(item)}
                            >
                                <div style={{ padding: "10px" }}>
                                    <div style={{ fontSize: "14px", fontWeight: 400 }}>
                                        {item?.name}
                                    </div>
                                </div>
                            </div>
                        </Col>
                    ))}
                </Row>
            }
        </>
    )
}
export default Categories;