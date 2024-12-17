import { CheckSquareOutlined, LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { FooterToolbar, ModalForm, ProCard, ProForm, ProFormText, ProFormTextArea } from "@ant-design/pro-components";
import { Col, ConfigProvider, Form, InputNumber, Modal, Row, Select, Upload, message, notification } from "antd";
import 'styles/reset.scss';
import { isMobile } from 'react-device-detect';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useEffect, useState } from "react";
import { callCreateProduct, callFetchCategory, callFetchTag, callUpdateProduct, callUploadSingleFile } from "@/config/api";
import { ICategory, ICompany, IProduct } from "@/types/backend";
import { v4 as uuidv4 } from 'uuid';
import enUS from 'antd/lib/locale/en_US';

interface IProps {
    openModal: boolean;
    setOpenModal: (v: boolean) => void;
    dataInit?: IProduct | null;
    setDataInit: (v: any) => void;
    reloadTable: () => void;
}



interface ICompanyLogo {
    name: string;
    uid: string;
}

export interface ISelect {
    label: string;
    value: string;
    key?: string;
}

const ModalProduct = (props: IProps) => {
    const { openModal, setOpenModal, reloadTable, dataInit, setDataInit } = props;

    //modal animation
    const [animation, setAnimation] = useState<string>('open');

    const [loadingUpload, setLoadingUpload] = useState<boolean>(false);
    const [loadingUploadSlider, setLoadingUploadSlider] = useState<boolean>(false);
    const [thumbnail, setThumbnail] = useState<ICompanyLogo[]>([]);
    const [sliders, setSliders] = useState<ICompanyLogo[]>([]);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');

    const [categoryOptions, setCategoryOptions] = useState<ISelect[]>([]);
    const [category, setCategory] = useState<ISelect>();

    const [tagOptions, setTagOptions] = useState<ISelect[]>([]);
    const [tag, setTag] = useState<ISelect[]>([]);

    const [value, setValue] = useState<string>("");
    const [form] = Form.useForm();

    useEffect(() => {
        if (dataInit?._id && dataInit?.shortDes) {
            setValue(dataInit.shortDes);
        }
        if (dataInit?._id && dataInit?.sliders) {
            const data = dataInit?.sliders.map(i => {
                return {
                    uid: uuidv4(),
                    name: i ?? "",
                    status: 'done',
                    url: i,
                }
            })
            setSliders(data);
        }
        if (dataInit?._id && dataInit?.category) {
            const data = {
                label: dataInit.category.name,
                value: dataInit.category._id,
                key: dataInit.category._id,
            }
            setCategory(data);
        }

        if (dataInit?._id && dataInit?.tags) {
            const data = dataInit?.tags.map(i => {
                return {
                    label: i.name,
                    value: i._id,
                    key: i._id,
                }
            })
            setTag(data);
            console.log(">>> check tag", tag);
        }
    }, [dataInit])

    console.log(".>> check sliders", sliders)

    useEffect(() => {
        fetchCategories("")
        fetchTags("");
    }, [])

    const submitCompany = async (valuesForm: any) => {
        const { name, shortDes, quantity, price, discount } = valuesForm;
        const data = {
            name, shortDes,
            thumbnail: thumbnail[0].name,
            sliders: sliders.map(x => x.name),
            quantity, price, discount, categoryId: category?.value ? category.value : category,
            tagsId: tag?.map(x => x?.value ? x.value : x)
        }
        if (thumbnail.length === 0) {
            message.error('Vui lòng upload ảnh thumbnail')
            return;
        }

        if (dataInit?._id) {

            //update
            const res = await callUpdateProduct(dataInit._id, data);
            if (res.data) {
                message.success("Cập nhật product thành công");
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
            const res = await callCreateProduct(data);
            if (res.data) {
                message.success("Thêm mới product thành công");
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
        setValue("");
        setDataInit(null);

        //add animation when closing modal
        setAnimation('close')
        await new Promise(r => setTimeout(r, 400))
        setOpenModal(false);
        setAnimation('open')
        setCategory(undefined);
        setTag([]);
        setSliders([]);
        setThumbnail([]);
    }

    const handleRemoveFile = (file: any) => {
        setThumbnail([])
    }

    const handleRemoveFileSliders = (file: any) => {
        const newSlider = sliders.filter((x: any) => x.uid != file.uid);
        setSliders(newSlider)
    }

    const handlePreview = async (file: any) => {
        if (!file.originFileObj) {
            setPreviewImage(file.url);
            setPreviewOpen(true);
            setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
            return;
        }
        getBase64(file.originFileObj, (url: string) => {
            setPreviewImage(url);
            setPreviewOpen(true);
            setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
        });
    };

    const getBase64 = (img: any, callback: any) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    };

    const beforeUpload = (file: any) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M;
    };

    const handleChange = (info: any) => {
        if (info.file.status === 'uploading') {
            setLoadingUpload(true);
        }
        if (info.file.status === 'done') {
            setLoadingUpload(false);
        }
        if (info.file.status === 'error') {
            setLoadingUpload(false);
            message.error(info?.file?.error?.event?.message ?? "Đã có lỗi xảy ra khi upload file.")
        }
    };


    const handleChangeSlider = (info: any) => {
        if (info.file.status === 'uploading') {
            setLoadingUploadSlider(true);
        }
        if (info.file.status === 'done') {
            setLoadingUploadSlider(false);
        }
        if (info.file.status === 'error') {
            setLoadingUploadSlider(false);
            message.error(info?.file?.error?.event?.message ?? "Đã có lỗi xảy ra khi upload file.")
        }
    };

    const handleUploadFileThumbnail = async ({ file, onSuccess, onError }: any) => {
        const res = await callUploadSingleFile(file, "product");
        if (res && res.data) {
            setThumbnail([{
                name: res.data.fileName,
                uid: uuidv4()
            }])
            if (onSuccess) onSuccess('ok')
        } else {
            if (onError) {
                setThumbnail([])
                const error = new Error(res.message);
                onError({ event: error });
            }
        }
    };

    const handleUploadFileSliders = async ({ file, onSuccess, onError }: any) => {
        const res = await callUploadSingleFile(file, "product");
        if (res && res.data) {
            setSliders([{
                name: res.data.fileName,
                uid: uuidv4()
            }])
            setSliders
            if (onSuccess) onSuccess('ok')
        } else {
            if (onError) {
                setThumbnail([])
                const error = new Error(res.message);
                onError({ event: error });
            }
        }
    };

    async function fetchCategories(name: string) {
        const res = await callFetchCategory(`page=1&size=100&name=/${name}/i`);
        if (res && res.data) {
            const list = res.data.result;
            const temp = list.map(item => {
                return {
                    label: item.name as string,
                    value: item._id as string
                }
            })
            // return temp;
            setCategoryOptions(temp);
        }
    }

    async function fetchTags(name: string) {
        const res = await callFetchTag(`page=1&size=100&name=/${name}/i`);
        if (res && res.data) {
            const list = res.data.result;
            const temp = list.map(item => {
                return {
                    label: item.name as string,
                    value: item._id as string
                }
            })
            // return temp;
            setTagOptions(temp);
        }
    }

    return (
        <>
            {openModal &&
                <>
                    <ModalForm
                        title={<>{dataInit?._id ? "Cập nhật sản phẩm" : "Tạo mới sản phẩm"}</>}
                        open={openModal}
                        modalProps={{
                            onCancel: () => { handleReset() },
                            afterClose: () => handleReset(),
                            destroyOnClose: true,
                            width: isMobile ? "100%" : 900,
                            footer: null,
                            keyboard: false,
                            maskClosable: false,
                            className: `modal-product ${animation}`,
                            rootClassName: `modal-product-root ${animation}`
                        }}
                        scrollToFirstError={true}
                        preserve={false}
                        form={form}
                        onFinish={submitCompany}
                        initialValues={dataInit?._id ? dataInit : {}}
                        submitter={{
                            render: (_: any, dom: any) => <FooterToolbar>{dom}</FooterToolbar>,
                            submitButtonProps: {
                                icon: <CheckSquareOutlined />
                            },
                            searchConfig: {
                                resetText: "Hủy",
                                submitText: <>{dataInit?._id ? "Cập nhật" : "Tạo mới"}</>,
                            }
                        }}
                    >
                        <Row gutter={16}>
                            <Col span={24}>
                                <ProFormText
                                    label="Tên sản phẩm"
                                    name="name"
                                    rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
                                    placeholder="Nhập tên sản phẩm"
                                />
                            </Col>
                            <Col lg={12} md={12} sm={24} xs={24}>
                                <ProForm.Item
                                    name="category"
                                    label="Category"
                                    rules={[{ required: true, message: 'Vui lòng chọn thể loại!' }]}

                                >
                                    <Select
                                        allowClear
                                        showSearch
                                        defaultValue={category}
                                        value={category}
                                        placeholder="Chọn thể loại"
                                        onSearch={(name: any) => fetchCategories(name)}
                                        options={categoryOptions}
                                        onChange={(newValue: any) => {
                                            setCategory(newValue?.value ? newValue.value : newValue as ISelect);
                                        }}
                                        style={{ width: '100%' }}
                                    />
                                </ProForm.Item>

                            </Col>
                            <Col lg={12} md={12} sm={24} xs={24}>
                                <ProForm.Item
                                    name="tag"
                                    label="Tag"
                                    rules={[{ required: true, message: 'Vui lòng chọn nhãn!' }]}

                                >
                                    <Select
                                        mode="multiple"
                                        allowClear
                                        showSearch
                                        defaultValue={tag}
                                        value={tag}
                                        placeholder="Chọn nhãn"
                                        onSearch={(name: any) => fetchTags(name)}
                                        options={tagOptions}
                                        onChange={(newValue: any) => {
                                            setTag(newValue as ISelect[]);
                                        }}

                                        style={{ width: '100%' }}
                                    />
                                </ProForm.Item>

                            </Col>
                            <Col span={24}>
                                <ProFormText
                                    label="Miêu tả ngắn ngọn"
                                    name="shortDes"
                                    rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
                                    placeholder="Nhập miêu tả ngắn gọn"
                                />
                            </Col>
                            <Col span={8}>
                                <Form.Item name="price" label="Giá" rules={[{ required: true }]}>
                                    <InputNumber style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="quantity" label="Số lượng" rules={[{ required: true }]}>
                                    <InputNumber style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="discount" label="Giảm giá" rules={[{ required: true }]}>
                                    <InputNumber style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    labelCol={{ span: 24 }}
                                    label="Thumbnail"
                                    name="thumbnail"
                                    rules={[{
                                        required: true,
                                        message: 'Vui lòng không bỏ trống',
                                        validator: () => {
                                            if (thumbnail.length > 0) return Promise.resolve();
                                            else return Promise.reject(false);
                                        }
                                    }]}
                                >
                                    <ConfigProvider locale={enUS}>
                                        <Upload
                                            name="thumbnail"
                                            listType="picture-card"
                                            className="avatar-uploader"
                                            maxCount={1}
                                            multiple={false}
                                            customRequest={handleUploadFileThumbnail}
                                            beforeUpload={beforeUpload}
                                            onChange={handleChange}
                                            onRemove={(file) => handleRemoveFile(file)}
                                            onPreview={handlePreview}
                                            defaultFileList={
                                                dataInit?._id ?
                                                    [
                                                        {
                                                            uid: uuidv4(),
                                                            name: dataInit?.thumbnail ?? "",
                                                            status: 'done',
                                                            url: `${dataInit?.thumbnail}`,
                                                        }
                                                    ] : []
                                            }

                                        >
                                            <div>
                                                {loadingUpload ? <LoadingOutlined /> : <PlusOutlined />}
                                                <div style={{ marginTop: 8 }}>Upload</div>
                                            </div>
                                        </Upload>
                                    </ConfigProvider>
                                </Form.Item>

                            </Col>

                            <Col span={16}>
                                <Form.Item
                                    labelCol={{ span: 24 }}
                                    label="Sliders"
                                    name="sliders"
                                >
                                    <ConfigProvider locale={enUS}>
                                        <Upload
                                            name="sliders"
                                            listType="picture-card"
                                            className="avatar-uploader"
                                            multiple={true}
                                            maxCount={3}
                                            customRequest={handleUploadFileSliders}
                                            beforeUpload={beforeUpload}
                                            onChange={handleChangeSlider}
                                            onRemove={(file) => handleRemoveFileSliders(file)}
                                            onPreview={handlePreview}
                                            defaultFileList={
                                                dataInit?._id && dataInit.sliders ? dataInit.sliders.map(i => {
                                                    return {
                                                        uid: uuidv4(),
                                                        name: i ?? "",
                                                        status: 'done',
                                                        url: i,
                                                    }
                                                }) : []
                                            }

                                        >
                                            <div>
                                                {loadingUploadSlider ? <LoadingOutlined /> : <PlusOutlined />}
                                                <div style={{ marginTop: 8 }}>Upload</div>
                                            </div>
                                        </Upload>
                                    </ConfigProvider>
                                </Form.Item>

                            </Col>
                        </Row>
                    </ModalForm>
                    <Modal
                        open={previewOpen}
                        title={previewTitle}
                        footer={null}
                        onCancel={() => setPreviewOpen(false)}
                        style={{ zIndex: 1500 }}
                    >
                        <img alt="example" style={{ width: '100%' }} src={previewImage} />
                    </Modal>
                </>
            }
        </>
    )
}

export default ModalProduct;
