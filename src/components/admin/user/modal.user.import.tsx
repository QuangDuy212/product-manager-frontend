import { ModalForm, ProFormText } from "@ant-design/pro-components";
import { Button, Col, Form, Row } from "antd";
import { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { InboxOutlined, UploadOutlined } from '@ant-design/icons';
import type { GetProp, UploadFile, UploadProps } from 'antd';
import { message, Upload } from 'antd';
import { callImportUser } from "@/config/api";

interface IProps {
    openModal: boolean;
    setOpenModal: (v: boolean) => void;
    reloadTable: any
}

const ModalImportUser = (props: IProps) => {
    const { openModal, setOpenModal, reloadTable } = props;

    const [file, setFile] = useState<UploadFile>();
    const [uploading, setUploading] = useState(false);

    const [form] = Form.useForm();


    const submitUser = async (valuesForm: any) => {
        setUploading(true);
        const res = await callImportUser(file);
        setUploading(false);
        setOpenModal(false);

    }

    const handleReset = async () => {
        form.resetFields();
        setFile(undefined);
        setOpenModal(false);
        reloadTable();
    }

    const { Dragger } = Upload;
    type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

    const handleUpload = async () => {

    };

    const propsForUpload: UploadProps = {
        onRemove: (file) => {
            setFile(file);
        },
        beforeUpload: (file) => {
            setFile(file);
            return false;
        }
    };
    return (
        <>
            <ModalForm
                title={<>Import list user</>}
                open={openModal}
                modalProps={{
                    onCancel: () => { handleReset() },
                    onOk: () => handleUpload(),
                    afterClose: () => handleReset(),
                    destroyOnClose: true,
                    width: isMobile ? "100%" : 900,
                    keyboard: false,
                    maskClosable: false,
                    okText: "Import",
                    cancelText: "Hủy"
                }}
                scrollToFirstError={true}
                preserve={false}
                form={form}
                onFinish={submitUser}
            >
                <Row gutter={16}>
                    <Col xs={24}>
                        <Dragger {...propsForUpload}
                        >
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">Click or drag file to this area to upload</p>
                            <p className="ant-upload-hint">
                                Support for a single or bulk upload. Strictly prohibited from uploading company data or other
                                banned files.
                            </p>
                        </Dragger>
                    </Col>
                </Row>
            </ModalForm >
        </>
    )
}

export default ModalImportUser;