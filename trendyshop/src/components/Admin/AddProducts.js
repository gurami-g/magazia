import React, { useEffect, useRef } from 'react'
// import img7 from "../Images/adminImages/photo@4x.png";
import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { Button, Col, Dropdown, DropdownButton, Form } from 'react-bootstrap';
import axios from 'axios';

const AddProducts = ({ setCurrent }) => {
    const [categories, setCategories] = useState(undefined);
    const [filteredCategories, setFilteredCategories] = useState(undefined);
    const [searchCategories, setSearchCategories] = useState('');

    const [parentCategory, setParentCategory] = useState([0, 'მშობელი კატეგორია']);
    const [newCategory, setNewCategory] = useState('');
    const [categoryImage, setCategoryImage] = useState(undefined);

    const [productCategory, setProductCategory] = useState([undefined, 'აირჩიეთ კატეგორია']);
    const [productName, setProductName] = useState('');
    const [productPrice, setProductPrice] = useState(undefined);
    const [productDiscount, setProductDiscount] = useState(0);
    const [productQuantity, setProductQuantity] = useState(undefined);
    const [productDescription, setProductDescription] = useState('');
    const [fields, setFields] = useState([]);
    const [photo, setPhoto] = useState(undefined);
    const [uploadedPhoto, setUploadedPhoto] = useState(null);

    const [showToast, setShowToast] = useState(false);
    const [message, setMessage] = useState('');
    const hideToast = () => {
        setShowToast(false);
        setMessage('');
    };

    const clearValues = () => {
        setProductName('');
        setProductPrice(0);
        setProductDiscount(0);
        setProductQuantity(0);
        setProductDescription('');
        setPhoto(null);
    }

    const clearCategory = () => {
        setNewCategory('');
        setParentCategory([0, 'მშობელი კატეგორია']);
        setUploadedPhoto(null);
    }

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
        }
        reader.readAsDataURL(file);
    }

    const handleUploadCategoryImage = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setCategoryImage(reader.result);
            }
            reader.readAsDataURL(file);
        }
    }

    const url = process.env.REACT_APP_SERVER_URL;

    const getCategories = async () => {
        await axios.get(`${url}/categories`)
            .then(res => {
                if (res.status === 200) {
                    setCategories(res.data);
                    setFilteredCategories(res.data);
                }
            })
            .catch(err => console.log(err));
    }

    const addProduct = async () => {
        console.log(fields);
        await axios.post(`${url}/addproduct`, {
            productCategory: productCategory[0],
            productName,
            productPrice,
            productDiscount,
            productQuantity,
            productDescription,
            fields: fields,
            photo
        })
            .then(res => {
                if (res.status === 200) {
                    setMessage('პროდუქტი წარმატებით დაემატა');
                    setShowToast(true);
                    clearValues();
                }
            })
            .catch(err => console.log(err));
    }

    const addNewCategory = async () => {
        console.log(newCategory, categoryImage);
        if (newCategory && categoryImage) {
            await axios.post(`${url}/addcategory`, {
                categoryName: newCategory,
                parentId: parentCategory[0],
                categoryImage,
            })
                .then(res => {
                    if (res.status === 200) {
                        getCategories();
                        setMessage('კატეგორია წარმატებით დაემატა');
                        setShowToast(true);
                        clearCategory();
                    }
                })
                .catch(err => console.log(err));
        }
    }

    const SortedCategories = ({ c, ms }) => {
        return c?.map((x, i) => {
            return (
                <div key={i}>
                    <Dropdown.Item className={`${x.categoryId === parentCategory[0] ? 'bg-warning' : x.parentId === 0 ? 'bg-dark text-light' : 'bg-white text-dark'}`} style={{ paddingLeft: ms }} onClick={() => {
                        setParentCategory([x.categoryId, x.categoryName]);
                    }}>{x.categoryName}</Dropdown.Item>
                    {x.subCategories && <SortedCategories c={x.subCategories} ms={ms + 15} />}
                </div>
            )
        })
    }
    const SortedProductCategories = ({ c, ms }) => {
        return c?.map((x, i) => {
            return (
                <div key={i}>
                    <Dropdown.Item className={`${x.categoryId === productCategory[0] ? 'bg-warning' : x.parentId === 0 ? 'bg-dark text-light' : 'bg-white text-dark'}`} style={{ paddingLeft: ms }} onClick={() => {
                        setProductCategory([x.categoryId, x.categoryName]);
                    }}>{x.categoryName}</Dropdown.Item>
                    {x.subCategories && <SortedProductCategories c={x.subCategories} ms={ms + 15} />}
                </div>
            )
        })
    }

    useEffect(() => {
        setCurrent(1);
        getCategories();
    }, [])

    useEffect(() => {
        const fc = categories?.filter(x => x.categoryName.includes(searchCategories));
        if (searchCategories) {
            setFilteredCategories(fc);
        } else {
            setFilteredCategories(categories);
        }
    }, [searchCategories])

    const selectParentCategory = (id, name) => {
        setParentCategory([id, name]);
    }

    return (
        <div className="admin_layout">
            <div className="admin_header">
                <div className="left">პროდუქტის დამატება</div>
                <div className="right" onClick={addProduct}>დამატება</div>
            </div>
            <Col className='px-3 d-flex gap-3 alk-sanet'>
                <DropdownButton id='dropdown-categories' variant='dark' title={parentCategory[1]}>
                    <Col>
                        <Form.Control type='search' size='sm' className='shadow-none position-sticky top-0 border-0' placeholder='მოძებნეთ...' value={searchCategories} onChange={e => setSearchCategories(e.target.value)} />
                    </Col>
                    <Dropdown.Divider />
                    <Dropdown.Item as="button" className={`${parentCategory[0] === 0 ? 'bg-warning' : 'bg-secondary text-light'}`} onClick={() => selectParentCategory(0, 'მშობელი კატეგორია')}>მშობელი კატეგორია</Dropdown.Item>
                    <SortedCategories c={filteredCategories} ms={15} />
                </DropdownButton>
                <Col className='col-3'>
                    <Form.Control type='text' className='shadow-none' placeholder='კატეგორიის სახელი' value={newCategory} onChange={e => setNewCategory(e.target.value)} />
                </Col>
                <Col className='d-flex align-items-center col-auto'>
                    <Form.Control id='upcatim' type='file' className='d-none' value={uploadedPhoto} onChange={handleUploadCategoryImage} />
                    <Form.Label className='btn btn-dark m-0' htmlFor='upcatim'>ფოტო</Form.Label>
                </Col>
                <Button variant='dark' onClick={addNewCategory}>კატეგორიის დამატება</Button>
            </Col>
            <div className="add_product_container">
                <div className="left_container">
                    <div className="input_container">
                        <p className="title">ძირითადი ინფორმაცია</p>
                        <DropdownButton id='dropdown-categories' variant='dark' title={productCategory[1]}>
                            <SortedProductCategories c={categories} ms={15} />
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
                <MyToast show={showToast} onHide={hideToast} message={message} />
            </div>
        </div>
    )
}

export const MyToast = ({ message, onHide, show }) => {

    useEffect(() => {
        if (show) {
            setTimeout(() => {
                onHide();
            }, 3000);
        }
    }, [show]);

    if (show) {
        return (
            <Col className='position-absolute bg-dark rounded-2 bpg-arial-caps col-3' style={{ bottom: 20, right: 20 }}>
                <Col className='py-1 px-3 d-flex align-items-center border-1 border-secoondary border-bottom text-warning'>
                    <Col>შეტყობინება</Col>
                    <Col className='ms-auto col-auto fs-3 text-light' onClick={onHide}><IoClose style={{ cursor: "pointer" }} /></Col>
                </Col>
                <Col className='p-3 text-success '>
                    {message}
                </Col>
            </Col>
        )
    }
}

export default AddProducts