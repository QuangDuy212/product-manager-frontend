import { Col, Divider, Row } from 'antd';
import styles from 'styles/client.module.scss';
import CompanyCard from '@/components/client/card/company.card';
import SearchClient from '@/components/client/search.client';
import { useState } from 'react';

const ClientCompanyPage = (props: any) => {
    const [query, setQuery] = useState<string>("");

    return (
        <div className={styles["container"]} style={{ marginTop: 20 }}>
            <Row gutter={[20, 20]}>
                <Col span={24}>
                    <SearchClient
                        query={query}
                        setQuery={setQuery}
                    />
                </Col>
                <Divider />
                <Col span={24}>
                    <CompanyCard
                        query={query}
                        setQuery={setQuery}
                        showPagination={true}
                    />
                </Col>
            </Row>
        </div>
    )
}

export default ClientCompanyPage;