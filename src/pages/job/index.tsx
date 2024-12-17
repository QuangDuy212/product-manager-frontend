import SearchClient from '@/components/client/search.client';
import { Breadcrumb, Col, Divider, Row } from 'antd';
import styles from 'styles/client.module.scss';
import JobCard from '@/components/client/card/category.card';
import { useNavigate } from 'react-router-dom';

const ClientJobPage = (props: any) => {
    const navigate = useNavigate();
    return (
        <div className={styles["container"]} style={{ marginTop: 100 }}>
            <Breadcrumb
                items={[
                    {
                        title: <div onClick={() => navigate("/")}>Trang chủ</div>,
                    },
                    {
                        title: 'Thể loại',
                    },
                ]}
            />
            <Row gutter={[20, 20]}>
                <Col span={24}>
                    <JobCard
                        showPagination={true}
                    />
                </Col>
            </Row>
        </div>
    )
}

export default ClientJobPage;