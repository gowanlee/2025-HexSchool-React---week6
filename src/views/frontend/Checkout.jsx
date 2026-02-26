import * as bootstrap from "bootstrap";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { currency } from "../../utils/filter";
import { useForm } from "react-hook-form";
import { ThreeDots } from "react-loader-spinner";
import SingleProductModal from "../../components/SingleProductModal";
import { addressValidation, emailValidation, nameValidation, telValidation } from "../../utils/validation";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function Checkout() {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [loadingCartId, setLoadingCartId] = useState(null);
    const [loadingProductId, setLoadingProductId] = useState(null);
    const [product, setProduct] = useState({});

    const productModalRef = useRef(null);

    useEffect(() => {
        // 初始化取得產品列表 api
        const getProducts = async () => {
            try {
                const res = await axios.get(`${API_BASE}/api/${API_PATH}/products`);
                setProducts(res.data.products);
            } catch (error) {
                console.log(error?.response);
            }
        }
        getProducts();

        // 初始化取得購物車列表 api
        const getCart = async() => {
            try {
                const res = await axios.get(`${API_BASE}/api/${API_PATH}/cart`);
                setCart(res.data.data);
            } catch (error) {
                console.log(error?.response) 
            }
        }
        getCart();

        // 初始化 bootstrap
        productModalRef.current = new bootstrap.Modal("#productModal", {
            keyboard: false // 關掉 keyboard esc 的功能
        });

        // Modal 關閉時移除焦點
        document
            .querySelector("#productModal")
            .addEventListener("hide.bs.modal", () => {
            if (document.activeElement instanceof HTMLElement) {
                document.activeElement.blur();
            }
            });
    }, [])

    // 單一產品資料
    const handleProductView = async (id) => {
        setLoadingProductId(id);
        try {
            const res = await axios.get(`${API_BASE}/api/${API_PATH}/product/${id}`);
            setProduct(res.data.product);

            // 開啟 產品modal
            productModalRef.current.show();
        } catch (error) {
            console.log(error);
        } finally {
            setLoadingProductId(null);
        }
    }

    // 關閉 產品modal
    const closeModal = () => {
        productModalRef.current.hide();
    }

    // 加入購物車
    const addCart = async(id, qty = 1) => {
        setLoadingCartId(id);
        try {
            const data = {
                product_id: id,
                qty
            }
            const addCart = await axios.post(`${API_BASE}/api/${API_PATH}/cart`, {data});
            const getCart = await axios.get(`${API_BASE}/api/${API_PATH}/cart`);
            setCart(getCart.data.data);
        } catch (error) {
            console.log(error?.response?.data);
        } finally {
            setLoadingCartId(null);
        }
    }
    
    // 更新購物車數量
    const updateCartItemNum = async(cartId, productId, num) => {
        if (num > 0) {
            try {
                const data = {
                    product_id: productId,
                    qty: num
                }
                await axios.put(`${API_BASE}/api/${API_PATH}/cart/${cartId}`, {data});
                const getCartRes = await axios.get(`${API_BASE}/api/${API_PATH}/cart`);
                setCart(getCartRes.data.data);
            } catch (error) {
                console.log(error?.response);
            }
        }
    }

    // 清除單一筆購物車
    const deleteSingleCart = async(cartId) => {
        try {
            await axios.delete(`${API_BASE}/api/${API_PATH}/cart/${cartId}`);
            const getCartRes = await axios.get(`${API_BASE}/api/${API_PATH}/cart`);
            setCart(getCartRes.data.data);
        } catch (error) {
            console.log(error?.response);
        }
    }

    // 清除全部購物車
    const deleteAllCart = async() => {
        try {
            await axios.delete(`${API_BASE}/api/${API_PATH}/carts`);
            const getCartRes = await axios.get(`${API_BASE}/api/${API_PATH}/cart`);
            setCart(getCartRes.data.data);
        } catch (error) {
            console.log(error?.response);
        }
    }

    // 結帳表單驗證
    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        reset,
    } = useForm({
        mode: 'onChange', // 邊輸入時就即時驗證
    })

    // 提交結帳表單
    const onSubmit = async(formData) => {
        try {
            // 將結帳表單格式整理
            const data = {
                user: formData,
                message: formData.message
            };
            const submitOrder = await axios.post(`${API_BASE}/api/${API_PATH}/order`, {data}); // 送出訂單 API
            reset(); // 重置表單

            // 重新取得購物車列表（此時購物車清空）
            const getCart = await axios.get(`${API_BASE}/api/${API_PATH}/cart`);
            setCart(getCart.data.data);
        } catch (error) {
            console.log(error)
        }
    }

    return (<>
        <div className="container mb-5">
            {/* 產品列表 */}
            <section className="mb-5">
                <h2 className="mb-4">產品列表</h2>
                <table className="table align-middle">
                    <thead>
                        <tr>
                            <th>圖片</th>
                            <th>商品名稱</th>
                            <th>價格</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            products.map((product) => {
                                return (<tr key={product.id}>
                                    <td style={{ width: "200px" }}>
                                        <div
                                        style={{
                                            height: "100px",
                                            backgroundSize: "cover",
                                            backgroundPosition: "center",
                                            backgroundImage: `url(${product.imageUrl})`,
                                        }}
                                        ></div>
                                    </td>
                                    <td>{product.title}</td>
                                    <td>
                                        <del className="h6 text-muted">原價：${currency(product.origin_price)}</del>
                                        <div className="h5">特價：${currency(product.price)}</div>
                                    </td>
                                    <td className="text-end">
                                        <div className="btn-group btn-group-sm">
                                            <button 
                                                type="button" 
                                                className="btn btn-outline-secondary" 
                                                onClick={() => handleProductView(product.id)}
                                                disabled={loadingProductId === product.id}
                                            >
                                                {
                                                    loadingProductId === product.id ? (
                                                        <ThreeDots
                                                            height={20}
                                                            width={55}
                                                            color=""
                                                        />
                                                    ) : ('查看更多')
                                                }
                                            </button>
                                            <button 
                                                type="button"
                                                className="btn btn-outline-danger" 
                                                onClick={() => addCart(product.id)}
                                                disabled={loadingCartId === product.id}
                                            >
                                                {
                                                    loadingCartId === product.id ? (
                                                        <ThreeDots 
                                                            height={20}
                                                            width={70}
                                                            color="#dc3545"
                                                        />) : ('加入購物車')
                                                }
                                            </button>
                                        </div>
                                    </td>
                                </tr>)
                            })
                        }
                    </tbody>
                </table>
            </section>

            {/* 購物車列表 */}
            <section className="mb-5">
                <h2 className="mb-4">購物車列表</h2>
                <div className="text-end">
                    <button type="button" className="btn btn-outline-danger" onClick={() => deleteAllCart()}>
                    清空購物車
                    </button>
                </div>

                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col"></th>
                            <th scope="col">品名</th>
                            <th scope="col">數量/單位</th>
                            <th scope="col">小計</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            cart?.carts?.map((cartItem) => {
                                return (
                                    <tr key={cartItem.id}>
                                        <td>
                                            <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => deleteSingleCart(cartItem.id)}>
                                                刪除
                                            </button>
                                        </td>
                                        <th scope="row">{cartItem.product.title}</th>
                                        <td>
                                            <div className="input-group input-group-sm mb-3">
                                                <input type="number" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" defaultValue={cartItem.qty} onChange={(e) => updateCartItemNum(cartItem.id, cartItem.product.id, parseInt(e.target.value))}/>
                                                <span className="input-group-text" id="inputGroup-sizing-sm">{cartItem.product.unit}</span>
                                            </div>
                                        </td>
                                        <td className="text-end">${currency(cartItem.final_total)}</td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                    <tfoot>
                        <tr>
                            <td className="text-end" colSpan="3">
                            總計
                            </td>
                            <td className="text-end">${currency(cart.final_total)}</td>
                        </tr>
                    </tfoot>
                </table>
            </section>
            

            {/* 結帳表單 */}
            <section className="mb-5">
                <h2 className="text-center">結帳表單</h2>
                <div className="my-5 row justify-content-center">
                    <form className="col-md-6" onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                className="form-control"
                                placeholder="請輸入 Email"
                                {...register('email', emailValidation)}
                            />
                            {
                                errors.email && (<p className="text-danger text-end mt-2">{errors.email.message}</p>)
                            }
                        </div>

                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">
                                收件人姓名
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                className="form-control"
                                placeholder="請輸入姓名"
                                {...register('name', nameValidation)}
                            />
                            {
                                errors.name && (<p className="text-danger text-end mt-2">{errors.name.message}</p>)
                            }
                        </div>

                        <div className="mb-3">
                            <label htmlFor="tel" className="form-label">
                                收件人電話
                            </label>
                            <input
                                id="tel"
                                name="tel"
                                type="tel"
                                className="form-control"
                                placeholder="請輸入電話"
                                {...register('tel', telValidation)}
                            />
                            {
                                errors.tel && (<p className="text-danger text-end mt-2">{errors.tel.message}</p>)
                            }
                        </div>

                        <div className="mb-3">
                            <label htmlFor="address" className="form-label">
                                收件人地址
                            </label>
                            <input
                                id="address"
                                name="address"
                                type="text"
                                className="form-control"
                                placeholder="請輸入地址"
                                {...register('address', addressValidation)}
                            />
                            {
                                errors.address && (<p className="text-danger text-end mt-2">{errors.address.message}</p>)
                            }
                        </div>

                        <div className="mb-3">
                            <label htmlFor="message" className="form-label">
                                留言
                            </label>
                            <textarea
                                id="message"
                                className="form-control"
                                cols="30"
                                rows="10"
                                {...register('message')}
                            ></textarea>
                        </div>
                        <div className="text-end">
                            <button type="submit" className="btn btn-danger" disabled={!isValid}>
                                送出訂單
                            </button>
                        </div>
                    </form>
                </div>
            </section>

            <SingleProductModal product={product} addCart={addCart} closeModal={closeModal}/>
        </div>
    </>)
}

export default Checkout;