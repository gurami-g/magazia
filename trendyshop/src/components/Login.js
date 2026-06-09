import React, { useEffect, useState } from 'react'
import { Button, Col, Form, Image, InputGroup } from 'react-bootstrap'
import { MdOutlineAlternateEmail } from 'react-icons/md'
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [message, setMessage] = useState('');

    const navigate = useNavigate();

    const url = process.env.REACT_APP_SERVER_URL;

    const login = async () => {
        if (email.trim() && password.trim()) {
            await axios.post(`${url}/login`, {
                email: email,
                password: password,
            })
                .then(res => {
                    if (res.status === 200) {
                        if (res.data === true) {
                            navigate('/addproducts');
                        } else {
                            setMessage(res.data);
                        }
                    }
                })
                .catch(err => console.log(err));
        }
    }

    useEffect(() => {
        let timeout;
        if (message && !timeout) {
            timeout = setTimeout(() => {
                setMessage('');
            }, 8000);
        }
        return () => clearTimeout(timeout);
    }, [message]);

    return (
        <Col className='d-flex flex-column align-items-center py-5 bg-dark' style={{ height: '100vh' }}>
            <Col className='d-flex flex-column align-items-center col-6 bg-dark rounded-3 py-5' style={{ flex: 1 }}>
                <Image className='mb-5' src='/images/trendyshop.svg' alt='noimg' width={180} height={180} />
                <Col className='col-8 p-3 d-flex flex-column bg-light shadow rounded-3 shadow mb-3'>
                    <Col className='d-flex align-items-center'>
                        <span className='text-warning fs-4 bg-dark px-2 ms-3 rounded-start' style={{ fontWeight: 'bold' }}>TRENDY</span>
                        <span className='text-dark fs-4 bg-warning px-2 rounded-end' style={{ fontWeight: 'bold' }}>SHOP</span>
                        <span className='text-dark fs-4 alk-sanet ms-auto mt-1' style={{ fontWeight: 'bold' }}>ავტორიზაცია</span>
                    </Col>
                    <hr />
                    <Col className='d-flex flex-column bpg-banner-es-caps'>
                        <Col className='col-8 ms-3 mb-3'>
                            <InputGroup>
                                <Form.Control type='email' size='lg' className='shadow-none rounded-start-1' placeholder='ელ-ფოსტა' value={email} onChange={e => setEmail(e.target.value)} />
                                <InputGroup.Text className='px-2 fs-3'><MdOutlineAlternateEmail /></InputGroup.Text>
                            </InputGroup>
                        </Col>
                        <Col className='col-8 ms-3'>
                            <InputGroup>
                                <Form.Control type={`${passwordVisible ? 'text' : 'password'}`} size='lg' className='shadow-none rounded-start-1' placeholder='პაროლი' value={password} onChange={e => setPassword(e.target.value)} />
                                <InputGroup.Text className={`px-2 fs-3 ${passwordVisible ? 'bg-dark text-light' : 'bg-light text-dark'}`} style={{ cursor: "pointer" }} onClick={() => setPasswordVisible(!passwordVisible)}>{passwordVisible ? <AiFillEye /> : <AiFillEyeInvisible />}</InputGroup.Text>
                            </InputGroup>
                        </Col>
                        <hr />
                        <Button variant='dark' size='lg' className='ms-3 col-3 pt-2 rounded-1' onClick={login}>შესვლა</Button>
                    </Col>
                </Col>
                <Col className='col-8'>
                    {message && <Col className='bg-light px-3 pb-1 pt-2 rounded-3 d-flex align-items-center text-danger bpg-banner-es-caps me-auto' style={{ flex: 0 }}>{message}</Col>}
                </Col>
            </Col>
        </Col>
    )
}

export default Login