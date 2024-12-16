import { Button, Col, Form, Input, Modal, Row, Select, Table, Tabs, message, notification } from "antd";
import { isMobile } from "react-device-detect";
import type { TabsProps } from 'antd';
import { IResume, ISubscribers } from "@/types/backend";
import { useState, useEffect } from 'react';
import { callCreateSubscriber, callFetchAllSkill, callFetchResumeByUser, callGetSubscriberSkills, callUpdateSubscriber, callUpdateUser } from "@/config/api";
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { MonitorOutlined } from "@ant-design/icons";
import { SKILLS_LIST } from "@/config/utils";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { ProFormText } from "@ant-design/pro-components";
import { fetchAccount } from "@/redux/slice/accountSlide";

interface IProps {
    open: boolean;
    onClose: (v: boolean) => void;
}



const UserUpdateInfo = (props: any) => {
    const { onClose } = props;
    const user = useAppSelector(state => state.account.user);
    const dispatch = useAppDispatch();

    const handleUpdateUser = async (value: { name: string; address: string }) => {
        const { name, address } = value;
        const data = { name, address, active: true }
        const res = await callUpdateUser(user._id, data)
        if (res.statusCode == 200) {
            message.success("Cập nhật tài khoản thành công");
            dispatch(fetchAccount());
            onClose(false);
        } else {
            notification.error({
                message: 'Có lỗi xảy ra',
                description: res.message
            });
        }
    }

    const onFinishFailed = (value: any) => {
        console.log(">>> check error: ", value);
    }


    return (
        <div style={{ width: "100%" }}>
            <Form
                name="basic"
                initialValues={user?._id ? user : {}}
                onFinish={handleUpdateUser}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Row gutter={16}>
                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProFormText
                            label="Tên hiển thị"
                            name="name"
                            rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
                            placeholder="Nhập tên hiển thị"
                            labelCol={{ span: 6 }}
                        />
                    </Col>

                    <Col lg={12} md={12} sm={24} xs={24}>
                        <ProFormText
                            label="Địa chỉ"
                            name="address"
                            rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
                            placeholder="Nhập địa chỉ"
                            labelCol={{ span: 6 }}
                        />
                    </Col>

                    <Col span={24} >
                        <Button style={{ float: "right" }} type="primary" htmlType="submit">Cập nhật</Button>
                    </Col>
                </Row>
            </Form>
        </div>
    )
}

const UserUpdatePassword = (props: any) => {
    const { onClose } = props;
    const user = useAppSelector(state => state.account.user);
    const dispatch = useAppDispatch();

    const handleUpdateUser = async (value: { password: string }) => {
        const { password } = value;
        const data = { password, active: true }
        const res = await callUpdateUser(user._id, data)
        if (res.statusCode == 200) {
            message.success("Cập nhật mật khẩu thành công");
            dispatch(fetchAccount());
            onClose(false);
        } else {
            notification.error({
                message: 'Có lỗi xảy ra',
                description: res.message
            });
        }
    }

    const onFinishFailed = (value: any) => {
        console.log(">>> check error: ", value);
    }


    return (
        <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
            <Form
                name="basic"
                initialValues={user?._id ? user : {}}
                onFinish={handleUpdateUser}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                style={{ maxWidth: "400px" }}
            >
                <Row gutter={16}>
                    <Col span={24}>
                        <ProFormText.Password
                            label="Mật khẩu"
                            name="password"
                            rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
                            placeholder="Nhập mật khẩu mới"
                            labelCol={{ span: 6 }}
                        />
                    </Col>

                    <Col span={24}>
                        <Form.Item
                            label="Xác nhận"
                            name="password2"
                            dependencies={['password']}
                            labelCol={{ span: 6 }}
                            rules={[
                                {
                                    required: true,
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('The new password that you entered do not match!'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password
                                placeholder="Xác nhận mật khẩu" />
                        </Form.Item>
                    </Col>

                    <Col span={24} >
                        <Button style={{ float: "right" }} type="primary" htmlType="submit">Cập nhật</Button>
                    </Col>
                </Row>
            </Form>
        </div>
    )
}



const ManageAccount = (props: IProps) => {
    const { open, onClose } = props;

    const onChange = (key: string) => {
    };

    const items: TabsProps['items'] = [
        {
            key: 'user-update-info',
            label: `Cập nhật thông tin`,
            children: <UserUpdateInfo onClose={onClose} />,
        },
        {
            key: 'user-password',
            label: `Thay đổi mật khẩu`,
            children: <UserUpdatePassword onClose={onClose} />,
        },
    ];


    return (
        <>
            <Modal
                title="Quản lý tài khoản"
                open={open}
                onCancel={() => onClose(false)}
                maskClosable={false}
                footer={null}
                destroyOnClose={true}
                width={isMobile ? "100%" : "1000px"}
            >

                <div style={{ minHeight: 200 }}>
                    <Tabs
                        defaultActiveKey="user-resume"
                        items={items}
                        onChange={onChange}
                    />
                </div>

            </Modal>
        </>
    )
}

export default ManageAccount;