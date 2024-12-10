import React, { useState, useEffect } from 'react';
import { CodeOutlined, ContactsOutlined, DownOutlined, FireOutlined, LogoutOutlined, MenuFoldOutlined, RiseOutlined, ShoppingCartOutlined, TwitterOutlined } from '@ant-design/icons';
import { Avatar, Badge, Button, Divider, Drawer, Dropdown, Empty, Image, MenuProps, Space, message, theme } from 'antd';
import { Menu, ConfigProvider } from 'antd';
import styles from '@/styles/client.module.scss';
import { isMobile } from 'react-device-detect';
import { FaReact } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { callFetchCart, callLogout } from '@/config/api';
import { setLogoutAction } from '@/redux/slice/accountSlide';
import ManageAccount from './modal/manage.account';
import { fetchCart } from '@/redux/slice/cartSlide';
import { ICart } from '@/types/backend';

const Header = (props: any) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const isAuthenticated = useAppSelector(state => state.account.isAuthenticated);
    const user = useAppSelector(state => state.account.user);
    const dataCart = useAppSelector(state => state.cart.cart);
    const [cartState, setCartState] = useState<ICart>();
    const [openMobileMenu, setOpenMobileMenu] = useState<boolean>(false);

    const [current, setCurrent] = useState('home');
    const location = useLocation();

    const [openMangeAccount, setOpenManageAccount] = useState<boolean>(false);

    useEffect(() => {
        dispatch(fetchCart())
    }, [])

    useEffect(() => {
        setCurrent(location.pathname);
    }, [location])

    const fetchCartState = async () => {
        const res = await callFetchCart();
        if (res.statusCode == 200) {
            setCartState(res.data);
        }
    }

    const items: MenuProps['items'] = [
        {
            label: <Link to={'/'}>Trang Chủ</Link>,
            key: '/',
            icon: <TwitterOutlined />,
        },
        {
            label: <Link to={'/category'}>Thể loại sản phẩm</Link>,
            key: '/category',
            icon: <CodeOutlined />,
        },
        {
            label: <Link to={'/product'}>Sản phẩm</Link>,
            key: '/product',
            icon: <RiseOutlined />,
        }
    ];

    const { useToken } = theme;

    const cart: MenuProps['items'] =
        dataCart?.cartDetails?.map((i, index) => {
            if (index < 5)
                return {
                    key: index + 1,
                    label: (
                        <div onClick={() => navigate('/cart')}
                            style={{ display: "flex", justifyContent: "space-between" }}
                        >
                            <Image src={i?.product?.thumbnail} width={50} height={50} />
                            <div style={{ minWidth: "200px", display: "flex", justifyContent: "center", alignItems: "center" }}>{i?.product?.name}</div>
                            <div style={{ minWidth: "50px", display: "flex", justifyContent: "center", alignItems: "center" }}>{i.quantity}</div>
                        </div>
                    ),
                }
            else
                return <></>
        })


        ;
    const { token } = useToken();

    const contentStyle: React.CSSProperties = {
        backgroundColor: token.colorBgElevated,
        borderRadius: token.borderRadiusLG,
        boxShadow: token.boxShadowSecondary,
    };

    const menuStyle: React.CSSProperties = {
        boxShadow: 'none',
    };



    const onClick: MenuProps['onClick'] = (e) => {
        setCurrent(e.key);
    };

    const handleLogout = async () => {
        const res = await callLogout();
        if (res && res && +res.statusCode === 200) {
            dispatch(setLogoutAction({}));
            message.success('Đăng xuất thành công');
            navigate('/')
        }
    }

    const itemsDropdown = [
        {
            label: <label
                style={{ cursor: 'pointer' }}
                onClick={() => setOpenManageAccount(true)}
            >Quản lý tài khoản</label>,
            key: 'manage-account',
            icon: <ContactsOutlined />
        },
        ...(user.role?.permissions?.length ? [{
            label: <Link
                to={"/admin"}
            >Trang Quản Trị</Link>,
            key: 'admin',
            icon: <FireOutlined />
        },] : []),

        {
            label: <label
                style={{ cursor: 'pointer' }}
                onClick={() => handleLogout()}
            >Đăng xuất</label>,
            key: 'logout',
            icon: <LogoutOutlined />
        },
    ];

    const itemsMobiles = [...items, ...itemsDropdown];

    return (
        <>
            <div className={styles["header-section"]} style={{ padding: "10px 0", position: "fixed", zIndex: "1000", top: 0, left: 0 }}>
                <div className={styles["container"]}>
                    {!isMobile ?
                        <div style={{ display: "flex", gap: 30 }}>
                            <div className={styles['brand']} >
                                <FaReact onClick={() => navigate('/')} />
                            </div>
                            <div className={styles['top-menu']}>
                                <ConfigProvider
                                    theme={{
                                        token: {
                                            colorPrimary: '#fff',
                                            colorBgContainer: '#222831',
                                            colorText: '#a7a7a7',
                                        },
                                    }}
                                >

                                    <Menu
                                        // onClick={onClick}
                                        selectedKeys={[current]}
                                        mode="horizontal"
                                        items={items}
                                    />
                                </ConfigProvider>
                                <div className={styles['extra']}>
                                    {isAuthenticated === false ?
                                        <Link to={'/login'}>Đăng Nhập</Link>
                                        :
                                        <div style={{ display: "flex", alignItems: "center" }}>
                                            {dataCart && dataCart?.cartDetails && dataCart?.cartDetails?.length > 0 &&
                                                <Dropdown
                                                    menu={{
                                                        items: cart
                                                    }}
                                                    placement="bottomRight"
                                                    dropdownRender={(menu) => (
                                                        <div style={contentStyle}>
                                                            {React.cloneElement(menu as React.ReactElement, { style: menuStyle })}
                                                            <Divider style={{ margin: 0 }} />
                                                            <Space style={{ padding: 8, display: "flex", justifyContent: "end" }}
                                                            >
                                                                <Button type="primary"
                                                                    onClick={() => navigate('/cart')}
                                                                >Xem giỏ hàng</Button>
                                                            </Space>
                                                        </div>
                                                    )}
                                                >
                                                    <span onClick={(e) => e.preventDefault()}
                                                        style={{ marginRight: "20px", display: "flex", alignItems: "center", justifyContent: "center" }}
                                                    >
                                                        <Space>
                                                            <Badge count={dataCart?.sum ? dataCart.sum : 0}>
                                                                <ShoppingCartOutlined style={{ fontSize: "30px" }} />
                                                            </Badge>
                                                        </Space>
                                                    </span>
                                                </Dropdown>}
                                            <Dropdown menu={{ items: itemsDropdown }} trigger={['click']}>
                                                <Space style={{ cursor: "pointer" }}>
                                                    <span>Welcome {user?.name}</span>
                                                    <Avatar> {user?.name?.substring(0, 2)?.toUpperCase()} </Avatar>
                                                </Space>
                                            </Dropdown>

                                        </div>
                                    }

                                </div>

                            </div>
                        </div>
                        :
                        <div className={styles['header-mobile']}>
                            <span>Your APP</span>
                            <MenuFoldOutlined onClick={() => setOpenMobileMenu(true)} />
                        </div>
                    }
                </div>
            </div>
            <Drawer title="Chức năng"
                placement="right"
                onClose={() => setOpenMobileMenu(false)}
                open={openMobileMenu}
            >
                <Menu
                    onClick={onClick}
                    selectedKeys={[current]}
                    mode="vertical"
                    items={itemsMobiles}
                />
            </Drawer>
            <ManageAccount
                open={openMangeAccount}
                onClose={setOpenManageAccount}
            />
        </>
    )
};

export default Header;