import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Button, Col, Image, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Products = ({ setCurrent }) => {
    const [products, setProducts] = useState(null);
    const [productId, setProductId] = useState(null);

    const navigate = useNavigate();

    const url = process.env.REACT_APP_SERVER_URL;

    const getProducts = async () => {
        await axios.get(`${url}/products`)
            .then(res => {
                if (res.status === 200) {
                    setProducts(res.data);
                }
            })
            .catch(err => console.log(err));
    }

    const deleteProduct = async () => {
        await axios.delete(`${url}/deleteproduct/${productId}`)
            .then(res => {
                if (res.status === 200) {
                    getProducts();
                    setProductId(null);
                }
            })
            .catch(err => console.log(err));
    }

    useEffect(() => {
        setCurrent(2);
        getProducts();
    }, [])

    return (
        <Col className='p-2 d-flex flex-column'>
            <Col className='bpg-arial-caps py-3 px-4 bg-secondary col-auto fs-4 text-warning'>პროდუქტები</Col>
            <Col className='p-2 d-flex flex-column mt-4 bpg-arial-caps gap-3' style={{ flex: 0 }}>
                {products?.map((x, i) => {
                    return (
                        <Col key={i} className='py-3 px-4 d-flex align-items-center gap-3 bg-light'>
                            <Col className='col-auto'>
                                <Image src={`${url}${x.photos}`} width={50} thumbnail />
                            </Col>
                            <Col className='col-3'>{x.productName}</Col>
                            <Col className='col-2'>{x.price}₾</Col>
                            <Col className='col-auto'>{x.amount} ცალი</Col>
                            <Col className='col-auto ms-auto'><Button variant='warning' className='rounded-0' onClick={() => navigate(`/editproduct/${x.productId}`)}>რედაქტირება</Button></Col>
                            <Col className='col-auto'><Button variant='danger' className='rounded-0' onClick={() => setProductId(x.productId)}>წაშლა</Button></Col>
                        </Col>
                    )
                })}
            </Col>
            <Modal size='md' show={productId} onHide={() => setProductId(null)} centered>
                <Modal.Header className='bpg-arial-caps' closeButton>
                    <Modal.Title>პროდუქტის წაშლა</Modal.Title>
                </Modal.Header>
                <Modal.Body className='bpg-arial-caps'>
                    ნამდვილად გსურთ პროდუქტის წაშლა?
                </Modal.Body>
                <Modal.Footer className='bpg-arial-caps'>
                    <Button variant='danger' className='rounded-0' onClick={deleteProduct}>წაშლა</Button>
                    <Button variant='success' className='rounded-0' onClick={() => setProductId(null)}>გაუქმება</Button>
                </Modal.Footer>
            </Modal>
        </Col>
    )
}

export default Products