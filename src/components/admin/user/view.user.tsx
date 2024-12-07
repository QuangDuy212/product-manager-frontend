import { IUser } from "@/types/backend";
import { Badge, Descriptions, Drawer } from "antd";
import dayjs from 'dayjs';

interface IProps {
    onClose: (v: boolean) => void;
    open: boolean;
    dataInit: IUser | null;
    setDataInit: (v: any) => void;
}
const ViewDetailUser = (props: IProps) => {
    const { onClose, open, dataInit, setDataInit } = props;

    return (
        <>
            <Drawer
                title="Thông Tin User"
                placement="right"
                onClose={() => { onClose(false); setDataInit(null) }}
                open={open}
                width={"40vw"}
                maskClosable={false}
            >
                <Descriptions title="" bordered column={2} layout="vertical">
                    <Descriptions.Item label="Tên hiển thị">{dataInit?.name}</Descriptions.Item>
                    <Descriptions.Item label="Username">{dataInit?.username}</Descriptions.Item>

                    <Descriptions.Item label="Address" >{dataInit?.address}</Descriptions.Item>

                    <Descriptions.Item label="Vai trò" >
                        <Badge status="processing" text={<>{dataInit?.role?.name}</>} />
                    </Descriptions.Item>

                    <Descriptions.Item label="Created At">{dataInit && dataInit.createdAt ? dayjs(dataInit.createdAt).format('DD-MM-YYYY HH:mm:ss') : ""}</Descriptions.Item>
                    <Descriptions.Item label="Updated At">{dataInit && dataInit.updatedAt ? dayjs(dataInit.updatedAt).format('DD-MM-YYYY HH:mm:ss') : ""}</Descriptions.Item>
                    <Descriptions.Item label="Created By">{dataInit && dataInit.createdBy ? dataInit.createdBy : ""}</Descriptions.Item>
                    <Descriptions.Item label="Updated By">{dataInit && dataInit.updatedAt ? dataInit.updatedBy : ""}</Descriptions.Item>

                </Descriptions>
            </Drawer>
        </>
    )
}

export default ViewDetailUser;