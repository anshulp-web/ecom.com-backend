import slugify from 'slugify';
import productModel from '../models/productModel.js';
import fs from 'fs';
import exp from 'constants';
import braintree from 'braintree';
import dotenv from 'dotenv';
import orderModel from '../models/orderModel.js';

dotenv.config();

//PAYMENT GATEWAY
var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.MERCHENT_ID,
  publicKey: process.env.PUBLIC_KEY,
  privateKey: process.env.PRIVATE_KEY,
});
//CREATE PRODUCT CONTROLLER

export const createProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;
    //Validation
    switch (true) {
      case !name:
        return res.status(500).send({ error: 'Name is required' });

      case !description:
        return res.status(500).send({ error: 'Description is required' });
      case !price:
        return res.status(500).send({ error: 'Price is required' });
      case !category:
        return res.status(500).send({ error: 'Category is required' });
      case !quantity:
        return res.status(500).send({ error: 'Quantity is required' });
      case !shipping:
        return res.status(500).send({ error: 'Shipping is required' });
      case photo && photo.size > 1000000:
        return res
          .status(500)
          .send({ error: 'Photo is required and should be less then 1mb' });
    }
    const products = new productModel({ ...req.fields, slug: slugify(name) });
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    res.status(201).send({
      success: true,
      message: 'Product Created Successfully',
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Error in create product',
      error,
    });
  }
};

//UPDATE PRODUCT

export const updateProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;
    //Validation
    switch (true) {
      case !name:
        return res.status(500).send({ error: 'Name is required' });

      case !description:
        return res.status(500).send({ error: 'Description is required' });
      case !price:
        return res.status(500).send({ error: 'Price is required' });
      case !category:
        return res.status(500).send({ error: 'Category is required' });
      case !quantity:
        return res.status(500).send({ error: 'Quantity is required' });
      case !shipping:
        return res.status(500).send({ error: 'Shipping is required' });
      case photo && photo.size > 1000000:
        return res
          .status(500)
          .send({ error: 'Photo is required and should be less then 1mb' });
    }
    const products = await productModel.findByIdAndUpdate(
      req.params.id,
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    res.status(201).send({
      success: true,
      message: 'Product Updated Successfully',
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Error in update product',
      error,
    });
  }
};

//GET ALL PRODUCTS

export const getAllProductsCotnroller = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .select('-photo')
      .populate('category')
      .limit(12)
      .sort({ createdAt: -1 });
    res.status(201).send({
      success: true,
      totalCount: products.length,
      message: 'Products fetched successfully',
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Error in get all products',
      error,
    });
  }
};

//GET SINGLE PRODUT BY SLUG

export const getSingleProductController = async (req, res) => {
  try {
    const product = await productModel
      .findOne({ slug: req.params.slug })
      .select('-photo')
      .populate('category');
    res.status(201).send({
      success: true,
      message: 'Product fetched successfully',
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Error in get single product',
      error,
    });
  }
};

//PRODUCT PHOTO

export const productPhotoController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.pid).select('photo');
    if (product.photo.data) {
      res.set('Content-Type', product.photo.contentType);
      return res.status(201).send(product.photo.data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Error in get product photo',
      error,
    });
  }
};

//DELETE PRODUCT

export const deleteProductController = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.params.id).select('-photo');
    res.status(201).send({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Error in delete product',
      error,
    });
  }
};

//PRODUCT FILTER CONTROLLER

export const productFilterController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let argument = {};
    if (checked.length > 0) argument.category = checked;
    if (radio.length) argument.price = { $gte: radio[0], $lte: radio[1] };
    const products = await productModel.find(argument);
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: 'Error in product filter',
      error,
    });
  }
};

// PRODUCT COUNT
export const productCountController = async (req, res) => {
  try {
    const total = await productModel.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: 'Error in product count',
      error,
      success: false,
    });
  }
};

// PRODUCT PER PAGE
export const productListController = async (req, res) => {
  try {
    const perPage = 2;
    const page = req.params.page ? req.params.page : 1;
    const products = await productModel
      .find({})
      .select('-photo')
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: 'error in per page',
      error,
    });
  }
};

//PRODUCT SEARCH
export const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const resutls = await productModel
      .find({
        $or: [
          { name: { $regex: keyword, $options: 'i' } },
          { description: { $regex: keyword, $options: 'i' } },
        ],
      })
      .select('-photo');
    res.json(resutls);
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: 'Error In Search Product API',
      error,
    });
  }
};

//GET SIMILAR PRODUCT

export const similarProductController = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const products = await productModel
      .find({
        category: cid,
        _id: { $ne: pid },
      })
      .select('-photo')
      .limit(3)
      .populate('category');
    res.status(201).send({
      success: true,
      message: 'Similar Product fetched successfully',
      products,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: 'Error in similar product api',
      error,
    });
  }
};

//TOKEN CONTROLLER
export const braintreeTokenController = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(response);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

//PAYEMTN CONTROLLER
export const brainTreePaymentController = async (req, res) => {
  try {
    const { nonce, cart } = req.body;
    let total = 0;
    cart.map((i) => {
      total += i.price;
    });
    let newTransaction = gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      function (error, result) {
        if (result) {
          const order = new orderModel({
            products: cart,
            payment: result,
            buyer: req.user._id,
          }).save();
          res.json({ ok: true });
        } else {
          res.status(500).send(error);
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};
