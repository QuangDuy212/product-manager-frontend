import { ModalForm, ProForm, ProFormDigit, ProFormSelect, ProFormSwitch, ProFormText } from "@ant-design/pro-components";
import { Col, Form, Row, Select, message, notification } from "antd";
import { isMobile } from 'react-device-detect';
import { useState, useEffect } from "react";
import { callCreateUser, callFetchCompany, callFetchRole, callUpdateUser } from "@/config/api";
import { IUser } from "@/types/backend";
import { DebounceSelect } from "./debouce.select";

interface IProps {
    openModal: boolean;
    setOpenModal: (v: boolean) => void;
    dataInit?: IUser | null;
    setDataInit: (v: any) => void;
    reloadTable: () => void;
}

export interface ICompanySelect {
    label: string;
    value: string;
    key?: string;
}

const ModalUser = (props: IProps) => {
    const { openModal, setOpenModal, reloadTable, dataInit, setDataInit } = props;
    const [roles, setRoles] = useState<ICompanySelect[]>([]);
    const [rolesOptions, setRolesOptions] = useState<ICompanySelect[]>([]);

    const [form] = Form.useForm();

    useEffect(() => {
        if (dataInit?._id) {
            if (dataInit.role) {
                setRoles([
                    {
                        label: dataInit.role?.name,
                        value: dataInit.role?._id,
                        key: dataInit.role?._id,
                    }
                ])
            }
        }
    }, [dataInit]);

    useEffect(() => {
        fetchRoleList("")
    }, [])

    const submitUser = async (valuesForm: any) => {
        const { name, username, password, address, role, active } = valuesForm;
        if (dataInit?._id) {
            //update
            const user = {
                _id: dataInit._id,
                name,
                username,
                password,
                address,
                role: role._id,
                active
            }

            const res = await callUpdateUser(user._id, user);
            if (res.data) {
                message.success("Cập nhật user thành công");
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
            const user = {
                name,
                username,
                password,
                address,
                role: role,
                active
            }
            const res = await callCreateUser(user);
            if (res.data) {
                message.success("Thêm mới user thành công");
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

    async function fetchRoleList(name: string) {
        const res = await callFetchRole(`page=1&size=100&name=/${name}/i`);
        if (res && res.data) {
            const list = res.data.result;
            const temp = list.map(item => {
                return {
                    label: item.name as string,
                    value: item._id as string
                }
            })
            // return temp;
            setRolesOptions(temp);
        }
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
                            label="Username"
                            name="username"
                            rules={[
                                { required: true, message: 'Vui lòng không bỏ trống' },
                            ]}
                            placeholder="Nhập username"
                        />
                    </Col>
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProFormText.Password
                            disabled={dataInit?._id ? true : false}
                            label="Password"
                            name="password"
                            rules={[{ required: dataInit?._id ? false : true, message: 'Vui lòng không bỏ trống' }]}
                            placeholder="Nhập password"
                        />
                    </Col>
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProFormText
                            label="Tên hiển thị"
                            name="name"
                            rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
                            placeholder="Nhập tên hiển thị"
                        />
                    </Col>

                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProForm.Item
                            name="role"
                            label="Vai trò"
                            rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}

                        >
                            <Select
                                allowClear
                                showSearch
                                defaultValue={roles}
                                value={roles}
                                placeholder="Chọn công vai trò"
                                onSearch={(name: any) => fetchRoleList(name)}
                                options={rolesOptions}
                                onChange={(newValue: any) => {
                                    // if (newValue?.length === 0 || newValue?.length === 1) {

                                    // }
                                    setRoles(newValue as ICompanySelect[]);
                                }}
                                style={{ width: '100%' }}
                            />
                        </ProForm.Item>

                    </Col>
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProFormSwitch
                            label="Trạng thái"
                            name="active"
                            checkedChildren="ACTIVE"
                            unCheckedChildren="INACTIVE"
                            initialValue={true}
                            fieldProps={{
                                defaultChecked: true,
                            }}
                        />
                    </Col>
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProFormText
                            label="Địa chỉ"
                            name="address"
                            rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
                            placeholder="Nhập địa chỉ"
                        />
                    </Col>
                </Row>
            </ModalForm >
        </>
    )
}

export default ModalUser;





