import { callDeleteACartDetail } from "@/config/api";
import { ICart, ICartDetail } from "@/types/backend";
import { DeleteOutlined } from "@ant-design/icons";
import { Image, InputNumber, message } from "antd";
interface IProps {
    cartDetail: ICartDetail
    data: { _id: string | undefined; quantity: number | undefined }[] | undefined;
    setData: (v: any) => any;
}
const CartProductOrder = (props: IProps) => {
    const { cartDetail, data, setData } = props;


    const handleRemoveCartDetail = async (id: string) => {
        const res = await callDeleteACartDetail(id);
        if (res.statusCode == 200) {
            message.success("Đã xóa 1 sản phẩm trong cart");
        }
    }

    const onChange = (value: any) => {
        const current = data?.filter(i => i._id != cartDetail._id);
        const newData = {
            _id: cartDetail._id,
            quantity: value,
        }
        current?.push(newData);
        setData(current);
        console.log(">>> check data: ", data);
    }
    return (
        <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            border: "1px solid rgba(5, 5, 5, 0.06)", borderRadius: "10px", padding: "0 10px",
            marginTop: "10px"
        }}>
            <div style={{ width: "70px", height: "70px", borderRadius: "10px", overflow: "hidden" }} >
                <Image src={cartDetail.product?.thumbnail} style={{ objectFit: "cover", }} height={70} width={70} />
            </div>
            <div style={{ width: "40%" }}>{cartDetail.product?.name}</div>
            <div style={{ width: "20%", display: "flex", justifyContent: "center", alignItems: "center" }}>{cartDetail.product?.price} đ</div>
            <div style={{ width: "10%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <InputNumber min={1} max={cartDetail?.product?.quantity} defaultValue={cartDetail.quantity} onPressEnter={onChange} />
            </div>
            <span
                style={{ cursor: "pointer", margin: "0 10px", width: "10%", display: "flex", justifyContent: "center", alignItems: "center" }}
                onClick={() => handleRemoveCartDetail(cartDetail._id!)}
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
}
export default CartProductOrder;