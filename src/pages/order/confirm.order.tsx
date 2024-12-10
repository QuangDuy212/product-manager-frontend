import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { ProFormText } from "@ant-design/pro-components";
import { Button, Col, Divider, Empty, Form, Image, Input, InputNumber, message, Radio, Row } from "antd";
import TextArea from "antd/es/input/TextArea";
import { Content } from "antd/es/layout/layout";
import { useEffect, useState } from "react";
import { ImSpinner8 } from "react-icons/im";
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import styles from 'styles/client.module.scss';
import CartProductOrder from "./card.product.order";
import { DeleteOutlined } from "@ant-design/icons";
import { callCeateOrder, callDeleteACartDetail, callFetchCart } from "@/config/api";
import { fetchCart } from "@/redux/slice/cartSlide";
import { useNavigate } from "react-router-dom";
import { ICart } from "@/types/backend";

interface IData {
    _id: string | undefined;
    quantity: number | undefined;
}

const ConfirmOrder = () => {

    // REDUX: 
    const user = useAppSelector(state => state.account.user);



    //PROPS:

    //LIBRARY:
    const [form] = Form.useForm();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    //STATE: 
    const [isSubmit, setIsSubmit] = useState(false);
    const [data, setData] = useState<ICart>();

    useEffect(() => {
        fetchData();
    }, [])

    const fetchData = async () => {
        const cart = await callFetchCart();
        setData(cart.data);
    }

    const onFinish = async (values) => {
        const vip = ['reciverPhone', 'reciverAddress', 'method', 'reciverName',];
        const { reciverPhone, reciverAddress, method, reciverName } = values;
        const detailOrder1 = Object.entries(values).map(([key, value]) => {
            if (!vip.includes(key)) {
                const [part1, part2] = key.split("+");
                return {
                    quantity: value,
                    _id: part1,
                    price: Number(part2)
                }
            }
        });
        const final = detailOrder1.filter(i => i != null);
        let totalPrice = 0;
        detailOrder1.forEach(i => {
            if (i?.quantity && i?.price) totalPrice += (i.quantity * i.price);
        })
        const data = {
            reciverName: reciverName,
            reciverAddress: reciverAddress,
            reciverPhone: reciverPhone,
            totalPrice: totalPrice,
            userId: user._id,
            status: "PENDING",
            detail: final
        }

        const res = await callCeateOrder(data);
        if (res.statusCode == 201) {
            dispatch(fetchCart());
            message.success("Thanh toán thành công!");
        } else {
            message.error(res.message);
        }
        setIsSubmit(false);
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const handleRemoveCartDetail = async (id: string) => {
        const res = await callDeleteACartDetail(id);
        if (res.statusCode == 200) {
            dispatch(fetchCart());
            message.success("Đã xóa 1 sản phẩm trong cart");
            fetchData();
        }
    }

    return (
        <>
            <div className={styles["container"]} style={{ marginTop: 20 }}>
                <Form
                    name="basic"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    style={{ width: "100%" }}
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                    form={form}
                >
                    <Row gutter={[20, 20]}>
                        <Col xl={14} md={24} sm={24} xs={24}>
                            {
                                data?.cartDetails?.length > 0
                                    ?
                                    data?.cartDetails?.map(i =>
                                        <div style={{
                                            display: "flex", justifyContent: "space-between", alignItems: "center",
                                            border: "1px solid rgba(5, 5, 5, 0.06)", borderRadius: "10px", padding: "0 10px",
                                            marginTop: "10px"
                                        }}>
                                            <div style={{ width: "70px", height: "70px", borderRadius: "10px", overflow: "hidden" }} >
                                                <Image src={i?.product?.thumbnail} style={{ objectFit: "cover", }} height={70} width={70} />
                                            </div>
                                            <div style={{ width: "40%" }}>{i.product?.name}</div>
                                            <div style={{ width: "20%", display: "flex", justifyContent: "center", alignItems: "center" }}>{i.product?.price} đ</div>
                                            <div style={{ width: "10%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                                <Form.Item
                                                    name={`${i?.product?._id ? i.product._id : ""}+${i.price}`}
                                                    style={{ display: "flex", justifyContent: "center", alignItems: "center", margin: 0 }}
                                                    rules={[
                                                        { required: true, message: 'Vui lòng không bỏ trống' },
                                                    ]}
                                                >
                                                    <InputNumber min={1} max={i?.product?.quantity} value={i.quantity} />
                                                </Form.Item>
                                            </div>
                                            <span
                                                style={{ cursor: "pointer", margin: "0 10px", width: "10%", display: "flex", justifyContent: "center", alignItems: "center" }}
                                                onClick={() => handleRemoveCartDetail(i._id!)}
                                            >
                                                <DeleteOutlined
                                                    style={{
                                                        fontSize: 20,
                                                        color: '#ff4d4f',
                                                    }}
                                                />
                                            </span>
                                        </div>
                                    )
                                    :
                                    <div className={styles["empty"]}>
                                        <Empty description="Không có sản phẩm nào" />
                                    </div>
                            }
                        </Col>
                        <Col xl={10} md={24} sm={24} xs={24}>
                            <div className="confirm" >

                                <ProFormText
                                    label="Người nhận"
                                    name="reciverName"
                                    rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
                                    placeholder="Nhập người nhận"
                                />

                                <ProFormText
                                    label="Nhập số điện thoại"
                                    name="reciverPhone"
                                    rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
                                    placeholder="Nhập số điện thoại"
                                />

                                <Form.Item
                                    label="Địa chỉ"
                                    labelCol={{ span: 24 }}
                                    name="reciverAddress"
                                    rules={[{ required: true, message: 'Không để trống địa chỉ!' }]}
                                >
                                    <TextArea rows={4} />
                                </Form.Item>

                                <Form.Item
                                    label="Phương thức thanh toán"
                                    labelCol={{ span: 24 }}
                                    valuePropName="checked"
                                    name="method"
                                    rules={[{ required: true, message: 'Không để trống phương thức!' }]}
                                >
                                    <Radio >Thanh toán khi nhận hàng</Radio>
                                </Form.Item>

                                <Divider />
                                <div className='confirm__price'>
                                    <span className='text1'>Tổng: </span>
                                    <span className='text2'>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(1000)}</span>
                                </div>
                                <Divider />
                                <Button
                                    type="primary"
                                    onClick={() => form.submit()}
                                    disabled={isSubmit}
                                >
                                    {isSubmit && <span className='spin'><ImSpinner8 /></span>}Đặt hàng
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </Form>

            </div>
        </>
    )
}

export default ConfirmOrder;