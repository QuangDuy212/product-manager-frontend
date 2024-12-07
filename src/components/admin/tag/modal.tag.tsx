import { ModalForm, ProForm, ProFormDigit, ProFormSelect, ProFormSwitch, ProFormText } from "@ant-design/pro-components";
import { Col, Form, Row, Select, message, notification } from "antd";
import { isMobile } from 'react-device-detect';
import { useState, useEffect } from "react";
import { callCreateCategory, callCreateTag, callFetchRole, callUpdateCategory, callUpdateTag } from "@/config/api";
import { ICategory, ITag } from "@/types/backend";

interface IProps {
    openModal: boolean;
    setOpenModal: (v: boolean) => void;
    dataInit?: ITag | null;
    setDataInit: (v: any) => void;
    reloadTable: () => void;
}

const ModalTag = (props: IProps) => {
    const { openModal, setOpenModal, reloadTable, dataInit, setDataInit } = props;
    const [form] = Form.useForm();

    useEffect(() => {
    }, [dataInit]);

    useEffect(() => {
    }, [])

    const submitUser = async (valuesForm: any) => {
        const { name, description } = valuesForm;
        if (dataInit?._id) {
            //update
            const data = {
                name, description
            }

            const res = await callUpdateTag(dataInit?._id, data);
            if (res.data) {
                message.success("Cập nhật tag thành công");
                handleReset();
                reloadTable();
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message
                });
            }
        } else {
            //create
            const data = {
                name, description
            }
            const res = await callCreateTag(data);
            if (res.data) {
                message.success("Thêm mới tag thành công");
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
        setOpenModal(false);
    }

    return (
        <>
            <ModalForm
                title={<>{dataInit?.name ? "Cập nhật Tag" : "Tạo mới Tag"}</>}
                open={openModal}
                modalProps={{
                    onCancel: () => { handleReset() },
                    afterClose: () => handleReset(),
                    destroyOnClose: true,
                    width: isMobile ? "100%" : 900,
                    keyboard: false,
                    maskClosable: false,
                    okText: <>{dataInit?.name ? "Cập nhật" : "Tạo mới"}</>,
                    cancelText: "Hủy"
                }}
                scrollToFirstError={true}
                preserve={false}
                form={form}
                onFinish={submitUser}
                initialValues={dataInit?.name ? dataInit : {}}
            >
                <Row gutter={16}>
                    <Col xs={24}>
                        <ProFormText
                            label="Tên hiển thị"
                            name="name"
                            rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
                            placeholder="Nhập tên hiển thị"
                        />
                    </Col>

                    <Col xs={24}>
                        <ProFormText
                            label="Miêu tả"
                            name="description"
                            rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
                            placeholder="Nhập miêu tả"
                        />
                    </Col>
                </Row>
            </ModalForm >
        </>
    )
}

export default ModalTag;





