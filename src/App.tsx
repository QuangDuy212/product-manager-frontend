import { useEffect, useRef, useState } from 'react';
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import NotFound from 'components/share/not.found';
import LoginPage from 'pages/auth/login';
import RegisterPage from 'pages/auth/register';
import LayoutAdmin from 'components/admin/layout.admin';
import ProtectedRoute from 'components/share/protected-route.ts';
import Header from 'components/client/header.client';
import Footer from 'components/client/footer.client';
import HomePage from 'pages/home';
import styles from 'styles/app.module.scss';
import DashboardPage from './pages/admin/dashboard';
import PermissionPage from './pages/admin/permission';
import RolePage from './pages/admin/role';
import UserPage from './pages/admin/user';
import { fetchAccount } from './redux/slice/accountSlide';
import LayoutApp from './components/share/layout.app';
import ClientJobPage from './pages/job';
import ClientCompanyPage from './pages/company';
import ClientCompanyDetailPage from './pages/company/detail';
import ProductPage from './pages/admin/product';
import CategoryPage from './pages/admin/category';
import TagPage from './pages/admin/tag';
import OrderPage from './pages/admin/order';
import ClientCategoryPage from './pages/job/detail';
import CategoryDetailPage from './pages/category/category.detail';
import ClientDetailProduct from './pages/product/detail';
import ConfirmOrder from './pages/order/confirm.order';
import "./assets/styles/index.scss"
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Cookies from "js-cookie";

const LayoutClient = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (rootRef && rootRef.current) {
      rootRef.current.scrollIntoView({ behavior: 'smooth' });
    }

  }, [location]);

  return (
    <div className='layout-app' ref={rootRef}>
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <div className={styles['content-app']}>
        <Outlet context={[searchTerm, setSearchTerm]} />
      </div>
      <Footer />
    </div>
  )
}

export default function App() {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(state => state.account.isLoading);

  useEffect(() => {
    if (
      window.location.pathname === '/login'
      || window.location.pathname === '/register'
    )
      return;
    dispatch(fetchAccount())
  }, [])

  useEffect(() => {
    let oldRefreshToken: any = null;
    const getCookieValue = (name: string) => {
      const cookies = document.cookie.split("; ");
      for (let cookie of cookies) {
        const [key, value] = cookie.split("=");
        if (key === name) return value;
      }
      return null;
    };

    const interval = setInterval(() => {
      if (window.location.pathname === "/cart") {
        const refreshToken = getCookieValue("refresh_token");
        if (oldRefreshToken !== null && refreshToken !== oldRefreshToken) {
          console.log("Refresh token has changed. Redirecting to login...");
          document.location.href = "/login";
        }
        oldRefreshToken = refreshToken;
      }
    }, 500);
    return () => clearInterval(interval);
  }, []);


  const router = createBrowserRouter([
    {
      path: "/",
      element: (<LayoutApp><LayoutClient /></LayoutApp>),
      errorElement: <NotFound />,
      children: [
        { index: true, element: <HomePage /> },
        { path: "category", element: <ClientJobPage /> },
        { path: "category/:id", element: <CategoryDetailPage /> },
        { path: "product", element: <ClientCompanyPage /> },
        { path: "product/:id", element: <ClientDetailProduct /> },
        { path: "cart", element: <ConfirmOrder /> }
      ],
    },

    {
      path: "/admin",
      element: (<LayoutApp><LayoutAdmin /> </LayoutApp>),
      errorElement: <NotFound />,
      children: [
        {
          index: true, element:
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
        },
        {
          path: "user",
          element:
            <ProtectedRoute>
              <UserPage />
            </ProtectedRoute>
        },
        {
          path: "permission",
          element:
            <ProtectedRoute>
              <PermissionPage />
            </ProtectedRoute>
        },
        {
          path: "role",
          element:
            <ProtectedRoute>
              <RolePage />
            </ProtectedRoute>
        },
        {
          path: "product",
          element:
            <ProtectedRoute>
              <ProductPage />
            </ProtectedRoute>
        },
        {
          path: "category",
          element:
            <ProtectedRoute>
              <CategoryPage />
            </ProtectedRoute>
        },

        {
          path: "tag",
          element:
            <ProtectedRoute>
              <TagPage />
            </ProtectedRoute>
        },

        {
          path: "order",
          element:
            <ProtectedRoute>
              <OrderPage />
            </ProtectedRoute>
        },
      ],
    },


    {
      path: "/login",
      element: <LoginPage />,
    },

    {
      path: "/register",
      element: <RegisterPage />,
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}