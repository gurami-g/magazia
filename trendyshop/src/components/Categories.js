import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Col, Image } from 'react-bootstrap';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { Link, useNavigate, useParams } from 'react-router-dom';

const Categories = () => {
    const [categories, setCategories] = useState(null);
    const [products, setProducts] = useState([]);
    const [categoryName, setCategoryName] = useState(null);

    const params = useParams();
    const navigate = useNavigate();
    const url = process.env.REACT_APP_SERVER_URL;

    const getCategories = async (id) => {
        console.log(id);
        await axios.get(`${url}/category/${id}`)
            .then(res => {
                if (res.status === 200) {
                    setCategories(res.data.categories);
                    setProducts(res.data.products);
                    setCategoryName(res.data.categoryName);
                    console.log(res.data);
                }
            })
            .catch(err => console.log(err));
    }

    useEffect(() => {
        const _params = params.categoryId || 0;
        getCategories(_params);
    }, [params]);

    return (
        <Col className='col-10 mx-auto my-3 flex-column'>
            <Col>
                <Col className='d-flex justify-content-center col-12 bpg-arial-caps'>
                    <h2 className='d-flex align-items-center col-12'>
                        <Col className='col-auto py-1 px-2 rounded-circle text-light bg-warning me-2' style={{ cursor: "pointer" }} onClick={() => navigate(-1)}>
                            <AiOutlineArrowLeft className='mb-1' />
                        </Col>
                        <b className='mx-auto'>{categoryName}</b>
                    </h2>
                </Col>
                <Col className='col-12 p-3 mx-auto my-2 d-flex flex-wrap bpg-arial-caps'>
                    {categories?.map((x, i) => {
                        return (
                            <Link to={`/categories/${x.categoryId}`} key={i} className='col-3 p-2'>
                                <Col className='bg-light p-2 d-flex flex-nowrap shadow btn btn-light'>
                                    <Col className='col-auto p-1'>
                                        <Image src={`${url}${x.categoryImage}`} className='p-0 border-0 rounded-0' style={{ height: "80px" }} thumbnail />
                                    </Col>
                                    <Col className='col-7 p-1 d-flex align-items-center justify-content-center text-center'>
                                        {x.categoryName}
                                    </Col>
                                </Col>
                            </Link >
                        )
                    })}
                </Col>
            </Col>
            {products.length > 0 ? (
                <Col>
                    <Col className='d-flex justify-content-center col-12 bpg-arial-caps'>
                        <h2 className='d-flex align-items-center col-12'><b className='mx-auto'>პროდუქტები</b></h2>
                    </Col>
                    <Col className='col-12 p-3 mx-auto my-2 d-flex flex-wrap bpg-arial-caps'>
                        {products?.map((x, i) => {
                            return (
                                <Link to={`/product/${x.productId}`} key={i} className='col-3 p-2'>
                                    <Col className='bg-light p-2 d-flex flex-column align-items-center shadow btn btn-light'>
                                        <Col className='col-12 p-1 overflow-hidden' style={{ width: '100%', height: 300 }}>
                                            <Image src={`${url}${x.photos}`} className='col-12 p-0 border-0 rounded-0 w-100 h-100' style={{ objectFit: "cover" }} thumbnail />
                                        </Col>
                                        <Col className='col-7 p-1 d-flex align-items-center justify-content-center text-center flex-column gap-2'>
                                            <b>{x.productName}</b>
                                            {x.salePercent > 0 ? (
                                                <Col className='d-flex align-items-center gap-2'>
                                                    {x.discount}₾
                                                    <Col className='d-flex bg-warning py-1 px-2 gap-2 rounded-2'><Col className='col-auto text-secondary' style={{ textDecoration: "line-through" }}>{x.price}₾</Col> {x.salePercent}%</Col>
                                                </Col>
                                            ) : (
                                                <Col className='d-flex align-items-center gap-2'>
                                                    {x.price}₾
                                                </Col>
                                            )}
                                            <Col>რაოდენობა: {x.amount}</Col>
                                        </Col>
                                    </Col>
                                </Link >
                            )
                        })}
                    </Col>
                </Col>
            ) : (
                <Col className='d-flex justify-content-center col-12 bpg-arial-caps'>
                    <h2 className='d-flex align-items-center col-12'><b className='mx-auto'>პროდუქტი არ არის განთავსებული</b></h2>
                </Col>
            )}
        </Col >
    )
}

export default Categories