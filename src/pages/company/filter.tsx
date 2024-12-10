import { callFetchCategory } from "@/config/api";
import { ICategory } from "@/types/backend";
import { ProFormText } from "@ant-design/pro-components";
import { Button, Checkbox, Col, Form, Row } from "antd";
import { GetProp } from "antd/lib";
import { useEffect, useState } from "react";

interface IProps {
    setFilter: (v: string) => void;
}
const FilterProduct = (props: IProps) => {
    const { setFilter } = props;
    const [data, setData] = useState<ICategory[]>();
    const [form] = Form.useForm();

    useEffect(() => {
        fetchCategory();
    }, [])

    const fetchCategory = async () => {
        const res = await callFetchCategory("");
        if (res.statusCode == 200) {
            setData(res?.data?.result);
        }
    }
    const handleApply = () => {
    };

    const onChange: GetProp<typeof Checkbox.Group, 'onChange'> = (checkedValues) => {
        console.log('checked = ', checkedValues);
    };

    const onFinish = (values: { min: string, max: string, category: string[] }) => {
        let { min, max, category } = values;
        if (!min) min = "0"
        if (!max) max = "1000000000"
        let filter = `&filter=price>=${min} and price<=${max}`;
        let tmp = "";
        if (category && category.length > 0) {
            category.forEach((i, index) => {
                if (index != 0)
                    tmp += ` or category.name='${i}'`
                else tmp += `category.name='${i}'`
            })
        }
        if (tmp != "") {
            filter += ` and (${tmp})`
        }
        console.log(filter)
        setFilter(filter)

    };

    const resetForm = () => {
        form.resetFields();
        setFilter("")
    }

    return (
        <div style={{ border: "1px solid #f2f2f2", padding: "20px", borderRadius: "10px" }}>
            <Form
                name="filterForm"
                onFinish={onFinish}
                layout="vertical"
                form={form}
            >
                <Form.Item
                    name="category"
                    label="Category"
                >
                    <Checkbox.Group style={{ width: '100%' }} onChange={onChange}>
                        <Row>
                            {data && data.map(i =>
                                <Col span={24}>
                                    <Checkbox value={i.name}>{i.name}</Checkbox>
                                </Col>
                            )}
                        </Row>
                    </Checkbox.Group>
                </Form.Item>
                <Row gutter={16}>
                    <Col xl={24} md={24} xs={24}>
                        <ProFormText
                            label="From"
                            name="min"
                            placeholder="From"
                        />
                    </Col>
                    <Col xl={24} md={12} xs={24}>
                        <ProFormText
                            label="To"
                            name="max"
                            placeholder="To"
                        />
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Find
                            </Button>
                        </Form.Item>
                    </Col>
                    <Col span={12}><Form.Item>
                        <Button type="default" onClick={() => resetForm()}>
                            Clear
                        </Button>
                    </Form.Item></Col>
                </Row>
            </Form>
        </div>
    );
}
export default FilterProduct;