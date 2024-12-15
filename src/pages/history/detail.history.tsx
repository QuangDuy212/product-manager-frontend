import { callFetchOrderById } from "@/config/api";
import { convertSlug } from "@/config/utils";
import { IOrder, IOrderDetail } from "@/types/backend";
import { ProFormText } from "@ant-design/pro-components";
import { Button, Col, Divider, Empty, Form, Image, Input, InputNumber, Radio, Row } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from 'styles/client.module.scss';

const DetailHistory = () => {
    let location = useLocation();
    let params = new URLSearchParams(location.search);
    const id = params?.get("id");
    const navigate = useNavigate();

    //STATE: 
    const [data, setData] = useState<IOrder>();

    useEffect(() => {
        fetchOrder();
    }, [])
    const fetchOrder = async () => {
        const res = await callFetchOrderById(id!);
        if (res.statusCode == 200) {
            setData(res.data);
        }
    }
    const handleClickName = (i: IOrderDetail) => {
        const name = convertSlug(i?.product?.name ?? "");
        navigate(`/product/${name}?id=${i?.product?._id}`)
    }
    return (
        <>
            <div className={styles["container"]} style={{ marginTop: 100, marginBottom: 200 }}>
                <Row gutter={[20, 20]}>
                    <Col xl={14} md={24} sm={24} xs={24}>
                        <div style={{
                            display: "flex", justifyContent: "space-between", alignItems: "center",
                            border: "1px solid rgba(5, 5, 5, 0.06)", borderRadius: "10px", padding: "0 10px",
                            marginTop: "10px"
                        }}>
                            <div style={{ width: "70px", height: "40px", borderRadius: "10px", overflow: "hidden", display: "flex", alignItems: "center" }} >
                                Hình ảnh
                            </div>
                            <div style={{ width: "40%" }}>Tên sản phẩm</div>
                            <div style={{ width: "20%", display: "flex", justifyContent: "center", alignItems: "center" }}>Giá</div>
                            <div style={{ width: "10%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                Số lượng
                            </div>
                        </div>
                        {
                            data && data?.orderDetails && data?.orderDetails?.length > 0
                                ?
                                data?.orderDetails?.map(i =>
                                    <div style={{
                                        display: "flex", justifyContent: "space-between", alignItems: "center",
                                        border: "1px solid rgba(5, 5, 5, 0.06)", borderRadius: "10px", padding: "0 10px",
                                        marginTop: "10px"
                                    }}>
                                        {/* <Checkbox checked={checkedList.some(x => x._id === i._id)} onChange={(v) => handleCheckChange(v.target.checked, { _id: i._id, quantity: i.quantity, price: i.price })} /> */}
                                        <div style={{ width: "70px", height: "70px", borderRadius: "10px", overflow: "hidden" }} >
                                            <Image src={i?.product?.thumbnail} style={{ objectFit: "cover", }} height={70} width={70} />
                                        </div>
                                        <div style={{ width: "40%", cursor: "pointer" }} onClick={() => handleClickName(i)}>{i.product?.name}</div>
                                        <div style={{ width: "20%", display: "flex", justifyContent: "center", alignItems: "center", color: "rgb(245, 114, 36)" }}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(i.product?.price - (i.product?.discount! ?? 0))}</div>
                                        <div style={{ width: "10%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                            <InputNumber value={i.quantity} disabled />
                                        </div>
                                    </div>
                                )
                                :
                                <div className={styles["empty"]}>
                                    <Empty description="Không có sản phẩm nào" />
                                </div>
                        }
                    </Col>

                    <Col xl={10} md={24} sm={24} xs={24}>
                        <label>Người nhận</label>
                        <Input style={{ marginBottom: "10px" }} value={data?.reciverName} disabled />
                        <label >Số điện thoại</label>
                        <Input style={{ marginBottom: "10px" }} value={data?.reciverPhone} disabled />
                        <label>Địa chỉ</label>
                        <Input style={{ marginBottom: "10px" }} value={data?.reciverAddress} disabled />
                        <label>Trạng thái</label>
                        <Input style={{ marginBottom: "10px" }} value={data?.status} disabled />
                        <label>Tổng tiền</label>
                        <Input style={{ marginBottom: "10px" }} value={data?.totalPrice} disabled />

                        <Button type="primary" onClick={() => navigate("/history")}> Quay lại</Button>
                    </Col>
                </Row>
            </div>

        </>
    )
}
export default DetailHistory;