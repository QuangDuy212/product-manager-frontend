import DataTable from "@/components/client/data-table";
import { convertSlug } from "@/config/utils";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchHistory } from "@/redux/slice/historySlide";
import { IOrder } from "@/types/backend";
import { ActionType, ProColumns } from "@ant-design/pro-components";
import { Breadcrumb, Tag } from "antd";
import dayjs from "dayjs";
import queryString from "query-string";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { sfLike } from "spring-filter-query-builder";
import styles from 'styles/client.module.scss';

const History = () => {
    //STATE: 
    const [histories, setHistories] = useState<IOrder[]>();
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [dataInit, setDataInit] = useState<IOrder | null>(null);
    const [openViewDetail, setOpenViewDetail] = useState<boolean>(false);

    //REF
    const tableRef = useRef<ActionType>();
    const navigate = useNavigate();

    //REDUX:
    const isFetching = useAppSelector(state => state.history.isFetching);
    const meta = useAppSelector(state => state.history.meta);
    const users = useAppSelector(state => state.history.result);
    const isAuthen = useAppSelector(state => state.account.isAuthenticated)
    const dispatch = useAppDispatch();

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
            render(dom, entity, index, action, schema) {
                return <div >
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(entity.totalPrice ?? 0)}
                </div>
            },
        },
        {
            title: 'Reciver Name',
            dataIndex: 'reciverName',
            sorter: true,
            render(dom, entity, index, action, schema) {
                return <div onClick={() => {
                    setOpenViewDetail(true);
                    setDataInit(entity);
                    const slug = convertSlug(entity.reciverName ?? "");
                    navigate(`/history/${slug}?id=${entity._id}`)
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
    ];

    //METHODS: 
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

    useEffect(() => {
        if (!isAuthen) navigate("/login")
    }, [])
    return (
        <div className={`${styles["container"]} ${styles["home-section"]}`} style={{ marginTop: "100px", marginBottom: 100 }}>
            <Breadcrumb
                items={[
                    {
                        title: <a href="/">Trang chủ</a>,
                    },
                    {
                        title: 'Lịch sử',
                    },
                ]}
            />
            <DataTable<IOrder>
                actionRef={tableRef}
                headerTitle="Danh sách Orders"
                rowKey="id"
                loading={isFetching}
                columns={columns}
                dataSource={users}
                request={async (params, sort, filter): Promise<any> => {
                    const query = buildQuery(params, sort, filter);
                    dispatch(fetchHistory({ query }))
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
            />
        </div >
    )
}
export default History;