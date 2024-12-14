import { callCeateOrder } from "@/config/api";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchCart } from "@/redux/slice/cartSlide";
import { ModalForm, ProFormText } from "@ant-design/pro-components";
import { Button, Divider, Form, message, notification, Radio } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { ImSpinner8 } from "react-icons/im";
import { useNavigate } from "react-router-dom";
interface IProps {
    openModal: boolean;
    setOpenModal: (v: boolean) => void;
    checkedList: IData[];
    total: number;
    setTotal: any;
    fetchData: any;
}

interface IData {
    _id: string;
    quantity: number;
    price: number;
}
const ModalPay = (props: IProps) => {
    const { openModal, setOpenModal, total, checkedList, fetchData, setTotal } = props;
    const [form] = Form.useForm();
    const [isSubmit, setIsSubmit] = useState<boolean>(false);
    const user = useAppSelector(state => state.account.user);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleReset = async () => {
        form.resetFields();
        setOpenModal(false);
    }

    const submit = async (value: any) => {
        const { reciverName, reciverAddress, reciverPhone } = value;
        const detail = checkedList.map(i => {
            return {
                _id: i._id,
                quantity: i.quantity
            }
        })
        const data = {
            totalPrice: total,
            reciverName: reciverName,
            reciverAddress: reciverAddress,
            reciverPhone: reciverPhone,
            status: "PENDING",
            userId: user._id,
            detail: detail
        }
        const res = await callCeateOrder(data)
        if (res.statusCode == 201) {
            message.success("Thanh toán thành công");
            handleReset();
            fetchData();
            dispatch(fetchCart())
            navigate("/")
        } else {
            notification.error({
                message: 'Có lỗi xảy ra',
                description: res.message
            });
        }
    }
    return (
        <ModalForm
            title={"Xác nhận mua hàng"}
            open={openModal}
            modalProps={{
                onCancel: () => { handleReset() },
                afterClose: () => handleReset(),
                destroyOnClose: true,
                width: isMobile ? "100%" : 900,
                keyboard: false,
                maskClosable: false,
                okText: <>Thanh toán</>,
                cancelText: "Hủy"
            }}
            scrollToFirstError={true}
            preserve={false}
            form={form}
            onFinish={submit}
        >
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
                <span className='text2'>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total)}</span>
            </div>
            <Divider />
        </ModalForm>
    )
}
export default ModalPay;