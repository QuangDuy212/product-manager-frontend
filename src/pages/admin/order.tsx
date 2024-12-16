import DataTable from "@/components/client/data-table";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchUser } from "@/redux/slice/userSlide";
import { IOrder } from "@/types/backend";
import { DeleteOutlined, EditOutlined, PlusOutlined, EyeOutlined, ExportOutlined, ImportOutlined } from "@ant-design/icons";
import { ActionType, ProColumns } from '@ant-design/pro-components';
import { Button, Popconfirm, Space, Tag, message, notification } from "antd";
import { useState, useRef } from 'react';
import dayjs from 'dayjs';
import { callDeleteOrder, callDeleteUser, callExportOrder, callExportUser } from "@/config/api";
import queryString from 'query-string';
import Access from "@/components/share/access";
import { ALL_PERMISSIONS } from "@/config/permissions";
import { sfLike } from "spring-filter-query-builder";
import { saveAs } from 'file-saver';
import { fetchOrder } from "@/redux/slice/orderSlide";
import ViewOrder from "@/components/admin/order/view.order";
import ModalOrder from "@/components/admin/order/model.order";
const OrderPage = () => {
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [dataInit, setDataInit] = useState<IOrder | null>(null);
    const [openViewDetail, setOpenViewDetail] = useState<boolean>(false);
    const [openModalImport, setOpenModalImport] = useState<boolean>(false);
    const tableRef = useRef<ActionType>();

    const isFetching = useAppSelector(state => state.order.isFetching);
    const meta = useAppSelector(state => state.order.meta);
    const users = useAppSelector(state => state.order.result);
    const dispatch = useAppDispatch();

    const handleDeleteOrder = async (id: string | undefined) => {
        if (id) {
            const res = await callDeleteOrder(id);
            if (+res.statusCode === 200) {
                message.success('Xóa order thành công');
                reloadTable();
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message
                });
            }
        }
    }

    const handleExportOrder = async () => {
        try {
            const response = await callExportOrder();
            const filename = 'orders_' + Date.now() + '.xlsx';
            saveAs(response, filename);
            message.success('Export thành công');
        } catch (error) {
            message.error('Export thất bại');
            console.error('Error during export:', error);
        }
    }

    const reloadTable = () => {
        tableRef?.current?.reload();
    }

    const columns: ProColumns<IOrder>[] = [
        {
            title: 'STT',
            key: 'index',
            width: 50,
            align: "center",
            render: (text, record, index) => {
                return (
                    <>
                        {(index + 1) + (meta.current - 1) * (meta.pageSize)}
                    </>)
            },
            hideInSearch: true,
        },
        {
            title: 'Total',
            dataIndex: 'totalPrice',
            sorter: true,
        },
        {
            title: 'Reciver Name',
            dataIndex: 'reciverName',
            sorter: true,
            render(dom, entity, index, action, schema) {
                return <div onClick={() => {
                    setOpenViewDetail(true);
                    setDataInit(entity)
                }}
                    style={{ color: "#1677ff", cursor: "pointer" }}>
                    {entity.reciverName}
                </div>
            },
        },


        {
            title: 'Reciver Address',
            dataIndex: 'reciverAddress',
            sorter: true,
        },

        {
            title: 'Reciver Phone',
            dataIndex: 'reciverPhone',
            sorter: true,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            render(dom, entity, index, action, schema) {
                return <>
                    <Tag color={entity.status == "SUCCESS" ? "lime" : "red"} >
                        {entity.status}
                    </Tag>
                </>
            },
            hideInSearch: true,
        },

        {
            title: 'CreatedAt',
            dataIndex: 'createdAt',
            width: 200,
            sorter: true,
            render: (text, record, index, action) => {
                return (
                    <>{record.createdAt ? dayjs(record.createdAt).format('DD-MM-YYYY HH:mm:ss') : ""}</>
                )
            },
            hideInSearch: true,
        },
        {
            title: 'UpdatedAt',
            dataIndex: 'updatedAt',
            width: 200,
            sorter: true,
            render: (text, record, index, action) => {
                return (
                    <>{record.updatedAt ? dayjs(record.updatedAt).format('DD-MM-YYYY HH:mm:ss') : ""}</>
                )
            },
            hideInSearch: true,
        },
        {

            title: 'Actions',
            hideInSearch: true,
            width: 50,
            render: (_value, entity, _index, _action) => (
                <Space>
                    < Access
                        permission={ALL_PERMISSIONS.ORDERS.UPDATE}
                        hideChildren
                    >
                        <EditOutlined
                            style={{
                                fontSize: 20,
                                color: '#ffa500',
                            }}
                            type=""
                            onClick={() => {
                                setOpenModal(true);
                                setDataInit(entity);
                            }}
                        />
                    </Access >

                    <Access
                        permission={ALL_PERMISSIONS.ORDERS.DELETE}
                        hideChildren
                    >
                        <Popconfirm
                            placement="leftTop"
                            title={"Xác nhận xóa order"}
                            description={"Bạn có chắc chắn muốn xóa order này ?"}
                            onConfirm={() => handleDeleteOrder(entity._id)}
                            okText="Xác nhận"
                            cancelText="Hủy"
                        >
                            <span style={{ cursor: "pointer", margin: "0 10px" }}>
                                <DeleteOutlined
                                    style={{
                                        fontSize: 20,
                                        color: '#ff4d4f',
                                    }}
                                />
                            </span>
                        </Popconfirm>
                    </Access>
                </Space >
            ),

        },
    ];

    const buildQuery = (params: any, sort: any, filter: any) => {
        const q: any = {
            page: params.current,
            size: params.pageSize,
            filter: ""
        }

        const clone = { ...params };
        if (clone.total) q.filter = `${sfLike("total", clone.total)}`;
        if (clone.reciverName) q.filter = `${sfLike("reciverName", clone.reciverName)}`;
        if (clone.reciverAddress) q.filter = `${sfLike("reciverAddress", clone.reciverAddress)}`;
        if (clone.reciverPhone) q.filter = `${sfLike("reciverPhone", clone.reciverPhone)}`;

        if (!q.filter) delete q.filter;
        let temp = queryString.stringify(q);

        let sortBy = "";
        if (sort && sort.total) {
            sortBy = sort.total === 'ascend' ? "sort=total,asc" : "sort=total,desc";
        }
        if (sort && sort.reciverName) {
            sortBy = sort.reciverName === 'ascend' ? "sort=reciverName,asc" : "sort=reciverName,desc";
        }
        if (sort && sort.reciverAddress) {
            sortBy = sort.reciverAddress === 'ascend' ? "sort=reciverAddress,asc" : "sort=reciverAddress,desc";
        }
        if (sort && sort.reciverPhone) {
            sortBy = sort.reciverPhone === 'ascend' ? "sort=reciverPhone,asc" : "sort=reciverPhone,desc";
        }
        if (sort && sort.status) {
            sortBy = sort.status === 'ascend' ? "sort=status,asc" : "sort=status,desc";
        }
        if (sort && sort.createdAt) {
            sortBy = sort.createdAt === 'ascend' ? "sort=createdAt,asc" : "sort=createdAt,desc";
        }
        if (sort && sort.updatedAt) {
            sortBy = sort.updatedAt === 'ascend' ? "sort=updatedAt,asc" : "sort=updatedAt,desc";
        }

        //mặc định sort theo updatedAt
        if (Object.keys(sortBy).length === 0) {
            temp = `${temp}&sort=updatedAt,desc`;
        } else {
            temp = `${temp}&${sortBy}`;
        }

        return temp;
    }

    return (
        <div>
            <Access
                permission={ALL_PERMISSIONS.ORDERS.GET_PAGINATE}
            >
                <DataTable<IOrder>
                    actionRef={tableRef}
                    headerTitle="Danh sách Orders"
                    rowKey="id"
                    loading={isFetching}
                    columns={columns}
                    dataSource={users}
                    request={async (params, sort, filter): Promise<any> => {
                        const query = buildQuery(params, sort, filter);
                        dispatch(fetchOrder({ query }))
                    }}
                    scroll={{ x: true }}
                    pagination={
                        {
                            current: meta.current,
                            pageSize: meta.pageSize,
                            showSizeChanger: true,
                            total: meta.total,
                            showTotal: (total, range) => { return (<div> {range[0]}-{range[1]} trên {total} rows</div>) }
                        }
                    }
                    rowSelection={false}
                    toolBarRender={(_action, _rows): any => {
                        return (
                            <>
                                <Access
                                    permission={ALL_PERMISSIONS.ORDERS.EXPORT}
                                >
                                    <Button
                                        icon={<ExportOutlined />}
                                        type="primary"
                                        onClick={() => handleExportOrder()}
                                    >
                                        Export
                                    </Button>
                                </Access>
                            </>
                        );
                    }}
                />
            </Access>
            <ViewOrder
                onClose={setOpenViewDetail}
                open={openViewDetail}
                dataInit={dataInit}
                setDataInit={setDataInit}
            />
            <ModalOrder
                openModal={openModal}
                setOpenModal={setOpenModal}
                reloadTable={reloadTable}
                dataInit={dataInit}
                setDataInit={setDataInit}
            />
        </div >
    )
}

export default OrderPage;