import { Button, Col, Form, Input, Row, Select, notification } from 'antd';
import { EnvironmentOutlined, MonitorOutlined } from '@ant-design/icons';
import { LOCATION_LIST } from '@/config/utils';
import { ProForm, ProFormText } from '@ant-design/pro-components';
import { useEffect, useState } from 'react';
import { callFetchAllSkill } from '@/config/api';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

interface IProps {
    query: string;
    setQuery: (v: string) => void;
}

const SearchClient = (props: IProps) => {

    const { query, setQuery } = props;
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const [searchParams, setSearchParams] = useSearchParams();


    const onFinish = async (values: any) => {
        const { search } = values;
        setQuery(search);
        console.log(">>> check search: ", search)
        if (!search) {
            notification.error({
                message: 'Có lỗi xảy ra',
                description: "Vui lòng chọn tiêu chí để search"
            });
            return;
        }
    }

    return (
        <ProForm
            form={form}
            onFinish={onFinish}
            submitter={
                {
                    render: () => <></>
                }
            }
        >
            <Row gutter={[20, 20]}>
                <Col span={24}><h2>Nhà cung cấp sản phẩm Arius</h2></Col>
                <Col span={24} md={20}>
                    <ProForm.Item
                        name="search"
                    >
                        <Input
                            placeholder="Tìm kiếm sản phẩm"
                        />
                    </ProForm.Item>
                </Col>
                <Col span={12} md={4}>
                    <Button type='primary' onClick={() => form.submit()}>Search</Button>
                </Col>
            </Row>
        </ProForm>
    )
}
export default SearchClient;