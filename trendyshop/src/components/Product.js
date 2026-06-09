import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Button, Col, Image } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';

const Product = ({ basketItems, setBasketItems }) => {
    const [product, setProduct] = useState(null);

    const navigate = useNavigate();
    const param = useParams();

    const url = process.env.REACT_APP_SERVER_URL;

    const getProduct = async (id) => {
        await axios.get(`${url}/product/${id}`)
            .then(res => {
                if (res.status === 200) {
                    if (res.data === false) navigate("/");
                    else setProduct(res.data);
                }
            })
            .catch(err => console.log(err));
    }

    const addToBasket = (item) => {
        if (basketItems) {
            let _basket = [...basketItems];
            const _isItemExists = _basket.find(x => x.productId === item.productId);
            if (_isItemExists) {
                _basket = _basket.filter(x => x.productId !== item.productId);
            } else {
                _basket.push({ ...item, _total: item.discount, _amount: 1 });
            }
            localStorage.setItem("basket", JSON.stringify(_basket));
            setBasketItems(_basket);
        } else {
            const _basket = [];
            _basket.push({ ...item, _total: item.discount, _amount: 1 });
            localStorage.setItem("basket", JSON.stringify(_basket));
            setBasketItems(_basket);
        }
    }

    useEffect(() => {
        if (param.productId) {
            getProduct(param.productId);
        }
    }, [param])

    if (product) {
        const _isCurrentItem = basketItems?.find(x => x.productId === product.productId);
        return (
            <Col className='col-11 d-flex p-3 mx-auto'>
                <Col className='col-4 p-2'>
                    <Image src={`${url}${product.photos}`} className='p-0 m-0 border-0 rounded-0 w-100' thumbnail />
                </Col>
                <Col className='py-2 px-3 bpg-banner-es-caps'>
                    <Col className='bg-light rounded-3 shadow p-2 mb-3'>
                        <Col className='d-flex align-items-center fs-2 mb-3'>
                            <b>{product.productName}</b>
                            <Button variant={`${_isCurrentItem ? 'success' : 'dark'}`} className='ms-auto' onClick={() => addToBasket(product)}>{_isCurrentItem ? 'დამატებულია' : 'კალათაში დამატება'}</Button>
                        </Col>
                        <Col className='fs-5 mb-3'>ფასი: {product.price}₾</Col>
                        {product.salePercent > 0 && <Col className='fs-5 mb-3'>ფასდაკლებით: {product.discount}₾</Col>}
                        {product.salePercent > 0 && <Col className='fs-5 mb-3'>ფასდაკლება: {product.salePercent}%</Col>}
                    </Col>
                    <Col className='bg-light rounded-3 shadow p-2 mb-3'>
                        <Col className='fs-4 mb-1'><b>აღწერა</b></Col>
                        <Col className='fs-6 mb-3'>{product.description}</Col>
                    </Col>
                    <Col className='bg-light rounded-3 shadow p-2'>
                        <Col className='fs-4 mb-1'><b>დეტალები</b></Col>
                        {product.detail?.map((x, i) => {
                            return (
                                <Col key={i} className='d-flex gap-2 mb-2'>
                                    <b>{x.name}: </b>
                                    <span>{x.parameter}</span>
                                </Col>
                            )
                        })}
                    </Col>
                </Col>
            </Col>
        )
    }
}

export default Product