import { createHashRouter } from 'react-router-dom';
import FrontendLayout from "./layout/FrontendLayout";
import Home from "./views/frontend/Home";
import Products from "./views/frontend/Products";
import SingleProduct from "./views/frontend/SingleProduct";
import Cart from "./views/frontend/Cart";
import NotFound from "./views/frontend/NotFound";
import Checkout from './views/frontend/Checkout';
import Login from './views/Login';

export const router = createHashRouter([
    {
        path: '/',
        element: <FrontendLayout />,
        children: [
            {
                index: true,
                element: <Home />
            }, 
            {
                path: 'products',
                element: <Products />
            },
            {
                path: 'product/:id',
                element: <SingleProduct />
            },
            {
                path: 'cart',
                element: <Cart />
            },
            {
                path: 'checkout',
                element: <Checkout />
            },
            {
                path: 'login',
                element: <Login />
            }
        ]
    },
    {
        path: '*',
        element: <NotFound />
    }
])