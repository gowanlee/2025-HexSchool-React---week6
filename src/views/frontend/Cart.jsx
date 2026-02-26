import axios from "axios";
import { useEffect, useState } from "react";
import { currency } from "../../utils/filter";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function Cart() {
    const [cart, setCart] = useState([]);

    // 取得購物車列表
    useEffect(() => {
        const getCart = async() => {
            try {
                const res = await axios.get(`${API_BASE}/api/${API_PATH}/cart`);
                setCart(res.data.data);
            } catch (error) {
                console.log(error?.response) 
            }
        }
        getCart();
    }, [])
    
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

    return (<>
        <div className="container mb-5">
            <h2>購物車列表</h2>
            <div className="text-end mt-4">
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
        </div>
    </>)
}

export default Cart;