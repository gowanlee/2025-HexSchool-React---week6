import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { currency } from "../../utils/filter";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function Products(params) {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    // 初始化串接產品列表 api
    useEffect(() => {
        const getProducts = async () => {
            try {
                const res = await axios.get(`${API_BASE}/api/${API_PATH}/products`);
                setProducts(res.data.products);
            } catch (error) {
                console.log(error?.response);
            }
        }
        getProducts();
    }, [])

    // 單一產品切換頁面
    const handleProductView = (id) => {
        navigate(`/product/${id}`)
    }

    return (<>
        <div className="container mb-5">
            <div className="row">
                {products.map((product) => {
                    return (
                        <div className="col-md-4 mb-3" key={product.id}>
                            <div className="card">
                                <img src={product.imageUrl} className="card-img-top" alt={product.title} />
                                <div className="card-body">
                                    <h5 className="card-title">{product.title}</h5>
                                    <p className="card-text">{product.description}</p>
                                    <p className="card-text text-black-50 text-decoration-line-through"><small>${currency(product.origin_price)}</small></p>
                                    <p className="card-text fs-3 fw-bolder">${currency(product.price)} / {product.unit}</p>
                                    <div className="d-flex justify-content-end">
                                        <button type="button" className="btn btn-warning" onClick={() => handleProductView(product.id)}>查看更多</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    </>)
}

export default Products;