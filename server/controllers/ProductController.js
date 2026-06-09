import mariadb from "mariadb";
import fs from "fs";
import axios from "axios";

const pool = mariadb.createPool({
  database: "trendyshopdb",
  host: "localhost",
  user: "root",
  password: "123",
})

const createConnection = async () => {
  return await pool.getConnection();
};

export const getCategories = async (req, res) => {
  let conn;

  try {
    conn = await createConnection();

    const categories = await conn.query("SELECT * FROM categories");

    const sortCategories = () => {
      const parentCategories = categories.filter(x => x.parentId === 0);

      const recurse = (c) => {
        return c.map(x => {
          const filtered = categories.filter(z => z.parentId === x.categoryId);
          if (filtered.length > 0) {
            return {
              ...x,
              subCategories: recurse(filtered),
            }
          } else {
            return {
              ...x
            }
          }
        })
      }

      return recurse(parentCategories);
    }

    const sortedCategories = sortCategories();

    res.send(sortedCategories);
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) conn.end();
  }
};

export const getCategory = async (req, res) => {
  let conn;
  const { categoryId } = req.params;

  try {
    conn = await createConnection();

    const categories = await conn.query(`SELECT * FROM categories WHERE parentId = ?`, [categoryId]);
    const categoryName = categoryId !== '0' ? await conn.query(`SELECT categoryName FROM categories WHERE categoryId = ?`, [categoryId]) : [{ categoryName: 'კატეგორიები' }];
    const products = await conn.query(`
      SELECT productId, productName, price, (price - (price * (salePercent / 100))) AS discount, salePercent, photos, amount
      FROM products 
      WHERE categoryId = ?
    `, [categoryId]);


    res.send({ categoryName: categoryName[0]?.categoryName, categories, products });
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) conn.end();
  }
}

export const getUnsortedCategories = async (req, res) => {
  let conn;
  try {
    conn = await createConnection();

    const categories = await conn.query(`SELECT * FROM categories`);

    res.send(categories);
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) conn.end();
  }
}

export const addNewCategory = async (req, res) => {
  let conn;
  const categoryName = req.body.categoryName;
  const parentId = req.body.parentId;

  const photo = req.body.categoryImage;

  console.log(photo);
  const dataType = photo.slice(0, photo.indexOf(',') + 1);
  const _photo = photo.replace(dataType, '');
  const date = new Date().toLocaleDateString("en-GB").split("/").join("_") + "-" + new Date().toLocaleTimeString("it-IT").split(":").join("_");
  const path = `images/category_${date}.png`;

  try {
    conn = await createConnection();

    fs.writeFile(path, _photo, 'base64', (err) => {
      conn.query(`INSERT INTO categories (categoryName, parentId, categoryImage) VALUES (?, ?, ?)`, [categoryName, parentId, "/" + path]).then(resp => {
        res.send("added");
      })
    });
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) conn.end();
  }
}

export const addProduct = async (req, res) => {
  let conn;
  const { productCategory, productName, productPrice, productDiscount, productQuantity, productDescription, photo, fields } = req.body;

  const dataType = photo.slice(0, photo.indexOf(',') + 1);
  const _photo = photo.replace(dataType, '');
  const date = new Date().toLocaleDateString("en-GB").split("/").join("_") + "-" + new Date().toLocaleTimeString("it-IT").split(":").join("_");
  const path = `images/product_${date}.png`;
  try {
    conn = await createConnection();

    fs.writeFile(path, _photo, 'base64', (err) => {
      conn.query(`INSERT INTO products (productName, price, salePercent, categoryId, description, photos, amount, detail) VALUES (?,?,?,?,?,?,?,?)`,
        [productName, productPrice, productDiscount || 0, productCategory, productDescription, '/' + path, productQuantity, JSON.stringify(fields)]).then(resp => {
          res.status(200).send("added!");
        }).catch(err => console.log(err));
    })

  } catch (err) {
    console.log(err);
  } finally {
    if (conn) conn.end();
  }
}

export const updateProduct = async (req, res) => {
  let conn;
  const { id } = req.params;
  const { productCategory, productName, productPrice, productDiscount, productQuantity, productDescription, photo, photoPath, fields, specialOffer } = req.body;
  let path;
  let _photo;

  if (photoPath) {
    path = photoPath;
  } else {
    const dataType = photo.slice(0, photo.indexOf(',') + 1);
    _photo = photo.replace(dataType, '');
    const date = new Date().toLocaleDateString("en-GB").split("/").join("_") + "-" + new Date().toLocaleTimeString("it-IT").split(":").join("_");
    path = `images/product_${date}.png`;
  }

  try {
    conn = await createConnection();

    if (photoPath) {
      conn.query(`UPDATE products SET productName = ?, price = ?, salePercent = ?, categoryId = ?, description = ?, photos = ?, amount = ?, detail = ?, specialOffer = ? WHERE productId = ?`,
        [productName, productPrice, productDiscount || 0, productCategory, productDescription, photoPath || ('/' + path), productQuantity, JSON.stringify(fields), specialOffer === true ? 1 : 0, id]).then(resp => {
          res.send("updated!");
        });
    } else {
      fs.writeFile(path, _photo, 'base64', (err) => {
        conn.query(`UPDATE products SET productName = ?, price = ?, salePercent = ?, categoryId = ?, description = ?, photos = ?, amount = ?, detail = ?, specialOffer = ? WHERE productId = ?`,
          [productName, productPrice, productDiscount || 0, productCategory, productDescription, '/' + path, productQuantity, JSON.stringify(fields), specialOffer === true ? 1 : 0, id]).then(resp => {
            res.send("added!");
          }).catch(err => console.log(err));
      })
    }

  } catch (err) {
    console.log(err);
  } finally {
    if (conn) conn.end();
  }
}

export const deleteProduct = async (req, res) => {
  let conn;
  const { id } = req.params;
  try {
    conn = await createConnection();

    await conn.query(`DELETE FROM products WHERE productId = ?`, [id]);

    res.send("deleted!");
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) conn.end();
  }
}

export const getOfferedProducts = async (req, res) => {
  let conn;

  try {
    conn = await createConnection();

    const offered = await conn.query(`SELECT * FROM products WHERE specialOffer = 1`);

    res.send(offered);
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) conn.end();
  }
}

export const getSeveralProducts = async (req, res) => {
  let conn;

  try {
    conn = await createConnection();

    const products = await conn.query(`
      SELECT productId, categories.categoryId, productName, categoryName, price, (price - (price * (salePercent / 100))) AS discount, salePercent, description, photos, amount, detail 
      FROM products
      LEFT JOIN categories ON products.categoryId = categories.categoryId
      WHERE salePercent >= 20
      LIMIT 8
    `);

    res.send(products);

  } catch (err) {
    console.log(err);
  } finally {
    if (conn) conn.end();
  }
}

export const getProduct = async (req, res) => {
  let conn;
  const { productId } = req.params;

  try {
    conn = await createConnection();

    const product = await conn.query(`
      SELECT productId, categories.categoryId, productName, categoryName, price, (price - (price * (salePercent / 100))) AS discount, salePercent, description, photos, amount, detail, specialOffer 
      FROM products
      LEFT JOIN categories ON products.categoryId = categories.categoryId 
      WHERE productId = ?
    `, [productId]);

    if (product.length > 0) {
      res.send(product[0]);
    } else {
      res.send(false);
    }

  } catch (err) {
    console.log(err);
  } finally {
    if (conn) conn.end();
  }
}

export const getProducts = async (req, res) => {
  let conn;
  const startPrice = req.query.startPrice || 0;
  const endPrice = req.query.endPrice || Number.MAX_VALUE;
  try {
    conn = await createConnection();

    const products = await conn.query(`
      SELECT productId, categories.categoryId, productName, categoryName, price, (price - (price * (salePercent / 100))) AS discount, salePercent, description, photos, amount, detail 
      FROM products
      LEFT JOIN categories ON products.categoryId = categories.categoryId 
      WHERE products.price >= ? AND products.price <= ?
    `, [startPrice, endPrice]);

    res.send(products);
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) conn.end();
  }
}



export const pay = async (req, res) => {

  const { total } = req.body;

  await axios.post('https://payze.io/api/v1', JSON.stringify({
    method: 'justPay',
    apiKey: '2EB032BF49E24180A9A4C9F78964E493',
    apiSecret: 'A27E0AD0472549139B6130A36DCA54A9',
    data: {
      amount: total,
      currency: 'GEL',
      callback: 'https://corp.com/success_callback',
      callbackError: 'https://corp.com/fail_url',
      preauthorize: false,
      lang: 'KA',
      hookUrl: 'https://corp.com/payze_hook?authorization_token=token',
      hookUrlV2: 'https://corp.com/payze_hook?authorization_token=token',
      // info: {
      //   description: 'A lightsaber is a fictional energy sword.',
      //   image: 'https://payze.io/assets/images/logo_v2.svg',
      //   name: 'Lightsaber'
      // },
      hookRefund: false
    }
  }), {
    headers: {
      Accept: 'application/json',
      "Content-Type": 'application/json'
    }
  })
    .then(resp => {
      if (resp.status === 200) {
        res.send(resp.data.response);
      }
    })
    .catch(err => console.log(err));

}
