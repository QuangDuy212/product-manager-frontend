import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { ProFormText } from "@ant-design/pro-components";
import { Button, Checkbox, Col, Divider, Empty, Form, Image, Input, InputNumber, message, Radio, Row } from "antd";
import TextArea from "antd/es/input/TextArea";
import { Content } from "antd/es/layout/layout";
import { useEffect, useState } from "react";
import { ImSpinner8 } from "react-icons/im";
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import styles from 'styles/client.module.scss';
import CartProductOrder from "./card.product.order";
import { DeleteOutlined } from "@ant-design/icons";
import { callAddAProductToCart, callCeateOrder, callChangeQuantityInCart, callDeleteACartDetail, callFetchCart } from "@/config/api";
import { fetchCart } from "@/redux/slice/cartSlide";
import { useNavigate } from "react-router-dom";
import { ICart, ICartDetail } from "@/types/backend";
import ModalPay from "./modal.pay";

interface IData {
    _id: string;
    quantity: number;
    price: number;
}

const ConfirmOrder = () => {
    const CheckboxGroup = Checkbox.Group;

    // REDUX: 
    const user = useAppSelector(state => state.account.user);
    const detail = useAppSelector(state => state.pay.detail);
    //PROPS:

    //LIBRARY:
    const [form] = Form.useForm();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    //STATE: 
    const [isSubmit, setIsSubmit] = useState(false);
    const [data, setData] = useState<ICart>();
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [checkedList, setCheckedList] = useState<IData[]>([]);
    const [checkedAll, setCheckedAll] = useState<boolean>(false);
    const [openModal, setOpenModal] = useState<boolean>(false);

    useEffect(() => {
        fetchData();
        initTotalPrice()
    }, [])

    useEffect(() => {
        initTotalPrice()
        setCheckedAll(checkedList.length == data?.cartDetails?.length && checkedList.length != 0)
    }, [checkedList])

    const initTotalPrice = () => {
        let total = 0;
        checkedList?.forEach(i => {
            total += ((i.price!) * (i.quantity!));
        })
        setTotalPrice(total);
    }


    const fetchData = async () => {
        const cart = await callFetchCart();
        setData(cart.data);
    }

    const handleRemoveCartDetail = async (id: string) => {
        setCheckedList(i => i.filter(x => x._id != id));
        const res = await callDeleteACartDetail(id);
        if (res.statusCode == 200) {
            dispatch(fetchCart());
            message.success("Đã xóa 1 sản phẩm trong cart");
            fetchData();
            setCheckedList([]);
            setCheckedAll(false);
        }
    }


    const onChangeCheckAll = (value: any) => {
        if (value.target.checked) {
            const d = data?.cartDetails?.map(i => {
                return {
                    _id: i._id!,
                    quantity: i.quantity!,
                    price: i.price!
                }
            })
            setCheckedAll(true);
            setCheckedList(d ?? [])
        } else {
            setCheckedAll(false);
            setCheckedList([])
        }
    }

    const handleCheckChange = (checked: boolean, item: IData) => {
        setCheckedList(prev =>
            checked ? [...prev, item] : prev.filter(x => x._id !== item._id)
        );
    };

    const onChangeInputNumber = async (value: any, data: ICartDetail) => {
        const dv = { _id: data?._id!, quantity: value!, price: data.price! }
        setCheckedList(i => [...i.filter(x => x._id != data?._id), dv])
        if (value != null) {
            const d = { productId: data.product?._id ?? "", quantity: value }
            const res = await callChangeQuantityInCart(d);
            if (res.statusCode == 200) {
                dispatch(fetchCart());
                fetchData();

            }
        }
    }

    const handlePay = () => {
        if (totalPrice > 0) {
            setOpenModal(true);
        } else message.error("Bạn chưa chọn sản phẩm nào")
    }

    return (
        <>
            <div className={styles["container"]} style={{ marginTop: 100, marginBottom: 200 }}>
                <Row gutter={[20, 20]}>
                    <Col xl={18} md={24} sm={24} xs={24}>
                        <div style={{
                            display: "flex", justifyContent: "space-between", alignItems: "center",
                            border: "1px solid rgba(5, 5, 5, 0.06)", borderRadius: "10px", padding: "0 10px",
                            marginTop: "10px"
                        }}>
                            <Checkbox checked={checkedAll} onChange={(v) => { onChangeCheckAll(v) }} />
                            <div style={{ width: "70px", height: "40px", borderRadius: "10px", overflow: "hidden", display: "flex", alignItems: "center" }} >
                                Hình ảnh
                            </div>
                            <div style={{ width: "40%" }}>Tên sản phẩm</div>
                            <div style={{ width: "20%", display: "flex", justifyContent: "center", alignItems: "center" }}>Giá</div>
                            <div style={{ width: "10%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                {/* <InputNumber min={1} max={i?.product?.quantity} defaultValue={i.quantity} /> */}
                                Số lượng
                            </div>
                            <span
                                style={{ cursor: "pointer", margin: "0 10px", width: "10%", display: "flex", justifyContent: "center", alignItems: "center" }}

                            >
                                Hành động
                            </span>
                        </div>

                        {
                            data && data?.cartDetails && data?.cartDetails?.length > 0
                                ?
                                data?.cartDetails?.map(i =>
                                    <div style={{
                                        display: "flex", justifyContent: "space-between", alignItems: "center",
                                        border: "1px solid rgba(5, 5, 5, 0.06)", borderRadius: "10px", padding: "0 10px",
                                        marginTop: "10px"
                                    }}>
                                        <Checkbox checked={checkedList.some(x => x._id === i._id)} onChange={(v) => handleCheckChange(v.target.checked, { _id: i._id, quantity: i.quantity, price: i.price })} />
                                        <div style={{ width: "70px", height: "70px", borderRadius: "10px", overflow: "hidden" }} >
                                            <Image src={i?.product?.thumbnail} style={{ objectFit: "cover", }} height={70} width={70} />
                                        </div>
                                        <div style={{ width: "40%" }}>{i.product?.name}</div>
                                        <div style={{ width: "20%", display: "flex", justifyContent: "center", alignItems: "center", color: "rgb(245, 114, 36)" }}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(i.product?.price - (i.product?.discount! ?? 0))}</div>
                                        <div style={{ width: "10%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                            <InputNumber min={1} max={i?.product?.quantity} defaultValue={i.quantity} onChange={(v) => onChangeInputNumber(v, i)} />
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
                    <Col xl={6} md={24} sm={24} xs={24}>
                        <div style={{ borderRadius: "10px", marginTop: "10px", border: "1px solid rgba(5, 5, 5, 0.06)", padding: "20px" }}>
                            <div>Thanh toán</div>

                            <Divider />
                            <div style={{ display: "flex", justifyContent: "space-between" }}>Tổng: <div>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice)}</div></div>
                            <Divider />
                            <div>

                                <Button type="primary" style={{ width: "100%" }}
                                    onClick={() => { handlePay() }}
                                >Thanh toán</Button>
                            </div>
                        </div>
                    </Col>
                </Row>
                <ModalPay
                    openModal={openModal}
                    setOpenModal={setOpenModal}
                    checkedList={checkedList}
                    total={totalPrice}
                    fetchData={fetchData}
                    setTotal={setTotalPrice}
                />
            </div>
        </>
    )
}

export default ConfirmOrder;