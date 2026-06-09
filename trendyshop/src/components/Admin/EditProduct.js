import React, { useEffect } from 'react'
// import img7 from "../Images/adminImages/photo@4x.png";
import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { Button, Col, Dropdown, DropdownButton, Form } from 'react-bootstrap';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { MyToast } from './AddProducts';

import { FiEdit } from "react-icons/fi";

const EditProduct = () => {
    const [categories, setCategories] = useState(null);

    const [productCategory, setProductCategory] = useState([null, 'აირჩიეთ კატეგორია']);
    const [productName, setProductName] = useState('');
    const [productPrice, setProductPrice] = useState(null);
    const [productDiscount, setProductDiscount] = useState(0);
    const [productQuantity, setProductQuantity] = useState(null);
    const [productDescription, setProductDescription] = useState('');
    const [fields, setFields] = useState([]);
    const [specialOffer, setSpecialOffer] = useState(false);
    const [photo, setPhoto] = useState(null);
    const [photoPath, setPhotoPath] = useState(null);

    const [showToast, setShowToast] = useState(false);
    const [message, setMessage] = useState('');
    const hideToast = () => {
        setShowToast(false);
        setMessage('');
    };

    const params = useParams();

    const getProduct = async () => {
        await axios.get(`${url}/product/${params.id}`)
            .then(res => {
                if (res.status === 200) {
                    const data = res.data;
                    setProductCategory([data.categoryId, data.categoryName]);
                    setProductName(data.productName);
                    setProductPrice(data.price);
                    setProductDiscount(data.salePercent);
                    setProductQuantity(data.amount);
                    setProductDescription(data.description);
                    setFields(data.detail);
                    setPhotoPath(data.photos);
                    setSpecialOffer(data.specialOffer);
                }
            })
            .catch(err => console.log(err));
    }

    useEffect(() => {
        if (params.id) {
            getProduct();
        }
    }, [params.id]);

    const handleInputChange = (index, event) => {
        const values = [...fields];
        values[index][event.target.name] = event.target.value;
        setFields(values);
    };
    const handleAddFields = () => {
        setFields([...fields, { name: "", parameter: "" }]);
    };
    const handleDeleteField = (index) => {
        const values = [...fields];
        values.splice(index, 1);
        setFields(values);
    };

    const handleUploadImage = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            setPhoto(reader.result);
            setPhotoPath('');
        }
        reader.readAsDataURL(file);
    }

    const url = process.env.REACT_APP_SERVER_URL;


    const getCategories = async () => {
        await axios.get(`${url}/categories`)
            .then(res => {
                if (res.status === 200) {
                    setCategories(res.data);
                }
            })
            .catch(err => console.log(err));
    }

    const updateProduct = async () => {
        await axios.put(`${url}/updateproduct/${params.id}`, {
            productCategory: productCategory[0],
            productName,
            productPrice,
            productDiscount,
            productQuantity,
            productDescription,
            fields: fields,
            photo,
            photoPath,
            specialOffer,
        })
            .then(res => {
                if (res.status === 200) {
                    setShowToast(true);
                    setMessage('პროდუქტი წარმატებით განახლდა');
                }
            })
            .catch(err => console.log(err));
    }

    const SortedCategories = ({ c, ms }) => {
        return c?.map(x => {
            return (
                <>
                    <Dropdown.Item className={`${x.categoryId === productCategory[0] ? 'bg-warning' : x.parentId === 0 ? 'bg-dark text-light' : 'bg-white text-dark'}`} style={{ paddingLeft: ms }} onClick={() => setProductCategory([x.categoryId, x.categoryName])}>{x.categoryName}</Dropdown.Item>
                    {x.subCategories && <SortedCategories c={x.subCategories} ms={ms + 15} />}
                </>
            )
        })
    }

    useEffect(() => {
        getCategories();
    }, [])


    return (
        <div className="admin_layout">
            <div className="admin_header">
                <div className="left">პროდუქტის დამატება</div>
                <div className="right" onClick={updateProduct}>განახლება</div>
            </div>
            <div className="add_product_container">
                <div className="left_container">
                    <div className="input_container">
                        <Col className='d-flex align-items-center mb-2'>
                            <p className="title m-0">ძირითადი ინფორმაცია</p>
                            <Button variant={`${specialOffer ? 'success' : 'dark'}`} className='ms-auto' onClick={() => setSpecialOffer(!specialOffer)}>სპეციალური შემოთავაზება</Button>
                        </Col>
                        <DropdownButton id='dropdown-categories' variant='dark' title={productCategory[1]}>
                            <SortedCategories c={categories} ms={15} />
                        </DropdownButton>
                        <div className="input_fields">
                            <input type="text" placeholder="პროდუქტის დასახელება" value={productName} onChange={e => setProductName(e.target.value)} />
                            <input type="text" placeholder="პროდუქტის ფასი" value={productPrice} onChange={e => setProductPrice(e.target.value)} />
                            <input type="number" min={0} max={100} placeholder="პროდუქტის ფასდაკლება" value={productDiscount} onChange={e => setProductDiscount(e.target.value)} />
                            <input type="text" placeholder="რაოდენობა" value={productQuantity} onChange={e => setProductQuantity(e.target.value)} />
                        </div>
                        <textarea className="description" placeholder="აღწერა..." value={productDescription} onChange={e => setProductDescription(e.target.value)}></textarea>
                    </div>
                    <div className="image_container d-flex">
                        <input type="file" className='d-none' id='upfile' onChange={handleUploadImage} />
                        <label htmlFor='upfile' className='upload_image'></label>
                    </div>
                </div>

                <div className="right_container">
                    <div className="header">
                        <p className="add">დეტალები</p>
                        <button className="add_btn" onClick={handleAddFields}>
                            დეტალის დამატება +
                        </button>
                    </div>
                    <div className="content">
                        {fields.map((field, index) => (
                            <div className="input_field_container" key={index}>
                                <input type="text" placeholder="სახელწოდება" name="name" value={field.name} onChange={(event) => handleInputChange(index, event)} style={{ marginRight: "1rem" }} />
                                <input type="text" placeholder="პარამეტრი" name="parameter" value={field.parameter} onChange={(event) => handleInputChange(index, event)} />
                                <IoClose className="delete" onClick={() => handleDeleteField(index)} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <MyToast show={showToast} onHide={hideToast} message={message} />
        </div>
    )
}

export default EditProduct