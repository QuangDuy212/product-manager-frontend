import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import { ICategory, IJob } from "@/types/backend";
import { callFetchCategoryById, callFetchJobById } from "@/config/api";
import styles from 'styles/client.module.scss';
import parse from 'html-react-parser';
import { Col, Divider, Row, Skeleton, Tag } from "antd";
import { DollarOutlined, EnvironmentOutlined, HistoryOutlined } from "@ant-design/icons";
import { getLocationName } from "@/config/utils";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import ApplyModal from "@/components/client/modal/apply.modal";
dayjs.extend(relativeTime)


const ClientCategoryPage = (props: any) => {
    const [categoryDetail, setCategoryDetail] = useState<ICategory | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    let location = useLocation();
    let params = new URLSearchParams(location.search);
    const id = params?.get("id"); // job id

    useEffect(() => {
        const init = async () => {
            if (id) {
                setIsLoading(true)
                const res = await callFetchCategoryById(id);
                if (res?.data) {
                    setCategoryDetail(res.data)
                }
                setIsLoading(false)
            }
        }
        init();
    }, [id]);

    return (
        <div className={`${styles["container"]} ${styles["detail-job-section"]}`}>
            {isLoading ?
                <Skeleton />
                :
                <Row gutter={[20, 20]}>
                    {categoryDetail && categoryDetail._id &&
                        <>
                            <Col span={24} md={16}>
                                <div className={styles["header"]}>
                                    {categoryDetail.name}
                                </div>
                                <div>
                                    <button
                                        onClick={() => setIsModalOpen(true)}
                                        className={styles["btn-apply"]}
                                    >Apply Now</button>
                                </div>
                                <Divider />
                                <div className={styles["skills"]}>
                                    {categoryDetail?.products?.map((item, index) => {
                                        return (
                                            <Tag key={`${index}-key`} color="gold" >
                                                {item.name}
                                            </Tag>
                                        )
                                    })}
                                </div>
                                <div className={styles["salary"]}>
                                    <DollarOutlined />
                                    {/* <span>&nbsp;{(categoryDetail.salary + "")?.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} đ</span> */}
                                </div>
                                <div className={styles["location"]}>
                                    {/* <EnvironmentOutlined style={{ color: '#58aaab' }} />&nbsp;{getLocationName(categoryDetail.location)} */}
                                </div>
                                <div>
                                    <HistoryOutlined /> {categoryDetail.updatedAt ? dayjs(categoryDetail.updatedAt).locale("en").fromNow() : dayjs(categoryDetail.createdAt).locale("en").fromNow()}
                                </div>
                                <Divider />
                                {/* {parse(categoryDetail.description)} */}
                            </Col>

                            <Col span={24} md={8}>
                                <div className={styles["company"]}>
                                    <div>
                                    </div>
                                    <div>
                                    </div>
                                </div>
                            </Col>
                        </>
                    }
                </Row>
            }
        </div>
    )
}
export default ClientCategoryPage;