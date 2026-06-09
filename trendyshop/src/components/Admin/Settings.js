import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Button, Col, Form, FormGroup } from 'react-bootstrap';
import { MyToast } from './AddProducts';

const Settings = ({ setCurrent }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [dateOfBirth, setDateBirth] = useState('');
    const [phone, setPhone] = useState('');
    const [privateNumber, setPrivateNumber] = useState('');

    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatpassword] = useState('');

    const [showToast, setShowToast] = useState(false);
    const [message, setMessage] = useState('');
    const hideToast = () => {
        setShowToast(false);
        setMessage('');
    };

    const url = process.env.REACT_APP_SERVER_URL;

    const getUserData = async () => {
        await axios.get(`${url}/getuserdata`)
            .then(res => {
                if (res.status === 200) {
                    setFirstName(res.data.firstName)
                    setLastName(res.data.lastName)
                    setEmail(res.data.email)
                    setDateBirth(new Date(res.data.dateOfBirth).toLocaleDateString("en-GB").split("/").reverse().join("-"))
                    setPhone(res.data.phone)
                    setPrivateNumber(res.data.privateNumber)
                }
            })

            .catch(err => console.log(err));
    }

    const updateUserData = async () => {
        if (firstName && lastName && phone && email && privateNumber && dateOfBirth) {
            await axios.put(`${url}/updateuser`, {
                firstName, lastName, phone, email, privateNumber, dateOfBirth
            })
                .then(res => {
                    if (res.status === 200) {
                        setShowToast(true);
                        setMessage('მონაცემები წარმატებით განახლდა')
                    }
                })
                .catch(err => console.log(err));
        }
    }

    const updatePassword = async () => {
        if (password && password.length >= 6 && (password === repeatPassword)) {
            await axios.put(`${url}/updatepassword`, { password })
                .then(res => {
                    if (res.status === 200) {
                        setShowToast(true);
                        setMessage('პაროლი წარმატებით განახლდა');
                    }
                })
                .catch(err => console.log(err))
        }
    }

    useEffect(() => {
        setCurrent(4);
        getUserData();
    }, [])

    return (
        <Col className='p-2 d-flex flex-column'>
            <Col className='col-auto bg-secondary p-3 bpg-arial-caps text-warning'>
                <Col className='fs-4'>პროფილის რედაქტირება</Col>
            </Col>
            <Col className='p-2 col-6 bpg-arial-caps mx-auto mt-2 d-flex flex-column gap-4'>
                <Col className='fs-5 text-center mb-4'><b>მომხმარებლის ინფო</b></Col>
                <Col className='d-flex gap-3'>
                    <Form.Control className='shadow-none' type='text' size='lg' value={firstName} onChange={e => setFirstName(e.target.value)} placeholder='სახელი' />
                    <Form.Control className='shadow-none' type='text' size='lg' value={lastName} onChange={e => setLastName(e.target.value)} placeholder='გვარი' />
                </Col>
                <Col className='d-flex gap-3'>
                    <Form.Control className='shadow-none' type='number' size='lg' value={privateNumber} onChange={e => setPrivateNumber(e.target.value)} placeholder='პირადი ნომერი' />
                    <Form.Control className='shadow-none' type='number' size='lg' value={phone} onChange={e => setPhone(e.target.value)} placeholder='ტელეფონის ნომერი' />
                </Col>
                <Col className='d-flex gap-3'>
                    <Form.Control className='shadow-none' type='email' size='lg' value={email} onChange={e => setEmail(e.target.value)} placeholder='ელ.ფოსტა' />
                    <Form.Control className='shadow-none' type='date' size='lg' value={dateOfBirth} onChange={e => setDateBirth(e.target.value)} />
                </Col>
                <Col>
                    <Button variant='dark' className='rounded-1' size='lg' onClick={updateUserData}>განახლება</Button>
                </Col>
            </Col>

            <Col className='p-2 col-6 bpg-arial-caps mx-auto mt-4 d-flex flex-column gap-4'>
                <Col className='fs-5 text-center mb-2'><b>პაროლის ცვლილება</b></Col>
                <Col className='d-flex gap-3'>
                    <Form.Control className='shadow-none' type='text' size='lg' value={password} onChange={e => setPassword(e.target.value)} placeholder='ახალი პაროლი' />
                    <Form.Control className='shadow-none' type='text' size='lg' value={repeatPassword} onChange={e => setRepeatpassword(e.target.value)} placeholder='გაიმეორეთ პაროლი' />
                </Col>
                <Col>
                    <Button variant='dark' className='rounded-1' size='lg' onClick={updatePassword}>პაროლის ცვლილება</Button>
                </Col>
            </Col>
            <MyToast show={showToast} onHide={hideToast} message={message} />
        </Col>
    )
}

export default Settings