import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { currency } from "../../utils/filter";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function SingleProduct() {
    const { id } = useParams();
    const [product, setProduct] = useState({});

    useEffect(() => {
        const handleProductView = async (id) => {
            try {
                const res = await axios.get(`${API_BASE}/api/${API_PATH}/product/${id}`);
                setProduct(res.data.product);
            } catch (error) {
                console.log(error);
            }
        }
        handleProductView(id);
    }, [id])

    const addCart = async(id, qty = 1) => {
        try {
            const data = {
                product_id: id,
                qty
            }
            const res = await axios.post(`${API_BASE}/api/${API_PATH}/cart`, {data});
        } catch (error) {
            console.log(error?.response?.data);
        }
    }

    return !product ? ( 
        <div><Link to="/NotFound"></Link></div> ) : (
        <div className="container">
            <div className="card w-75 mx-auto">
                <div className="row g-0">
                    <div className="col-md-4">
                        <img src={product.imageUrl} className="img-fluid rounded-start" alt={product.title} />
                    </div>
                    <div className="col-md-8">
                        <div className="card-body">
                            <h5 className="card-title">{product.title}</h5>
                            <p className="card-text">{product.description}</p>
                            <p className="card-text text-black-50 text-decoration-line-through"><small>${product.origin_price}</small></p>
                            <p className="card-text fs-3 fw-bolder">${currency(product.price)} / {product.unit}</p>
                            <div className="d-flex justify-content-end">
                                <button type="button" className="btn btn-warning" onClick={() => addCart(product.id)}>加入購物車</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>)
}

export default SingleProduct;