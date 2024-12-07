import { ModalForm, ProForm, ProFormDigit, ProFormSelect, ProFormSwitch, ProFormText } from "@ant-design/pro-components";
import { Col, Form, Row, Select, message, notification } from "antd";
import { isMobile } from 'react-device-detect';
import { useState, useEffect } from "react";
import { callCreateUser, callFetchRole, callUpdateOrder, callUpdateUser } from "@/config/api";
import { IOrder, IUser } from "@/types/backend";

interface IProps {
    openModal: boolean;
    setOpenModal: (v: boolean) => void;
    dataInit?: IOrder | null;
    setDataInit: (v: any) => void;
    reloadTable: () => void;
}

export interface ICompanySelect {
    label: string;
    value: string;
    key?: string;
}

const ModalOrder = (props: IProps) => {
    const { openModal, setOpenModal, reloadTable, dataInit, setDataInit } = props;
    const [roles, setRoles] = useState<ICompanySelect[]>([]);

    const [form] = Form.useForm();

    useEffect(() => {
        if (dataInit?._id && dataInit?.status) {
            setRoles([{
                label: dataInit?.status,
                value: dataInit?.status,
                key: dataInit?.status
            }])
        }
    }, [dataInit]);

    useEffect(() => {
    }, [])

    const options = [
        {
            label: "PENDING",
            value: "PENDING",
            key: "PENDING"
        },
        {
            label: "SUCCESS",
            value: "SUCCESS",
            key: "SUCCESS"
        }
    ]

    const submitUser = async (valuesForm: any) => {
        const { status } = valuesForm;
        if (dataInit?._id) {
            //update
            const data = {
                _id: dataInit._id,
                status
            }

            const res = await callUpdateOrder(data._id, data);
            if (res.data) {
                message.success("Cập nhật order thành công");
                handleReset();
                reloadTable();
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message
                });
            }
        }
    }

    const handleReset = async () => {
        form.resetFields();
        setDataInit(null);
        setRoles([]);
        setOpenModal(false);
    }

    return (
        <>
            <ModalForm
                title={<>{dataInit?._id ? "Cập nhật User" : "Tạo mới User"}</>}
                open={openModal}
                modalProps={{
                    onCancel: () => { handleReset() },
                    afterClose: () => handleReset(),
                    destroyOnClose: true,
                    width: isMobile ? "100%" : 900,
                    keyboard: false,
                    maskClosable: false,
                    okText: <>{dataInit?._id ? "Cập nhật" : "Tạo mới"}</>,
                    cancelText: "Hủy"
                }}
                scrollToFirstError={true}
                preserve={false}
                form={form}
                onFinish={submitUser}
                initialValues={dataInit?._id ? dataInit : {}}
            >
                <Row gutter={16}>
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProFormText
                            label="ID"
                            name="_id"
                            placeholder="Nhập ID"
                            disabled
                        />
                    </Col>
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProFormText
                            label="Reciver Name"
                            name="reciverName"
                            disabled
                        />
                    </Col>
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProFormText
                            label="Reciver Address"
                            name="reciverAddress"
                            disabled
                        />
                    </Col>
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProFormText
                            label="Total price"
                            name="totalPrice"
                            disabled
                        />
                    </Col>
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProForm.Item
                            name="status"
                            label="Status"
                            rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}

                        >
                            <Select
                                allowClear
                                showSearch
                                defaultValue={roles}
                                value={roles}
                                placeholder="Chọn status"
                                options={options}
                                onChange={(newValue: any) => {
                                    setRoles(newValue as ICompanySelect[]);
                                }}
                                style={{ width: '100%' }}
                            />
                        </ProForm.Item>
                    </Col>
                </Row>
            </ModalForm >
        </>
    )
}

export default ModalOrder;





