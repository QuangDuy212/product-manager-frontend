import { IOrder, IUser } from "@/types/backend";
import { Badge, Descriptions, Drawer, Image } from "antd";
import dayjs from 'dayjs';

interface IProps {
    onClose: (v: boolean) => void;
    open: boolean;
    dataInit: IOrder | null;
    setDataInit: (v: any) => void;
}
const ViewOrder = (props: IProps) => {
    const { onClose, open, dataInit, setDataInit } = props;

    return (
        <>
            <Drawer
                title="Thông Tin Order"
                placement="right"
                onClose={() => { onClose(false); setDataInit(null) }}
                open={open}
                width={"60vw"}
                maskClosable={false}
            >
                <Descriptions title="" bordered column={2} layout="vertical">
                    <Descriptions.Item label="ID" span={24}>{dataInit?._id}</Descriptions.Item>
                    <Descriptions.Item label="Reciver Name">{dataInit?.reciverName}</Descriptions.Item>

                    <Descriptions.Item label="Reciver address" >{dataInit?.reciverAddress}</Descriptions.Item>

                    <Descriptions.Item label="Reciver Phone" >{dataInit?.reciverPhone}</Descriptions.Item>
                    <Descriptions.Item label="User" >{dataInit?.user?.username}</Descriptions.Item>
                    <Descriptions.Item label="Detail" span={24} >
                        {dataInit?.orderDetails?.map(i => {
                            return <div style={{
                                display: "flex", justifyContent: "space-between",
                                alignItems: "center", padding: "10px", borderRadius: "10px", border: "1px solid #ccc"
                            }}>
                                <Image src={i.product?.thumbnail} width={50} />
                                <span>{i.product?.name}</span>
                                <span>{i.product?.price} đ</span>
                                <span>{i.quantity} cái</span>
                            </div>
                        })}
                    </Descriptions.Item>
                    <Descriptions.Item label="Total" span={24}>{dataInit?.totalPrice} đ</Descriptions.Item>

                    <Descriptions.Item label="Created At">{dataInit && dataInit.createdAt ? dayjs(dataInit.createdAt).format('DD-MM-YYYY HH:mm:ss') : ""}</Descriptions.Item>
                    <Descriptions.Item label="Updated At">{dataInit && dataInit.updatedAt ? dayjs(dataInit.updatedAt).format('DD-MM-YYYY HH:mm:ss') : ""}</Descriptions.Item>
                    <Descriptions.Item label="Created By">{dataInit && dataInit.createdBy ? dataInit.createdBy : ""}</Descriptions.Item>
                    <Descriptions.Item label="Updated By">{dataInit && dataInit.updatedAt ? dataInit.updatedBy : ""}</Descriptions.Item>

                </Descriptions>
            </Drawer>
        </>
    )
}

export default ViewOrder;