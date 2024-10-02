const Product = require('../models/Product');
const Order = require('../models/Order');

const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const { checkPermissions } = require('../utils');

// Creating Fake Stripe 
const fakeStripeAPI = async ({ amount, currency }) => {
    const client_secret = 'someRandomValue';
    return { client_secret , amount };
}

const createOrder = async ( req, res) => {
    const { items: cartItems , tax , shippingFee } = req.body;
    if(!cartItems || cartItems.length < 1){
        throw new CustomError.BadRequestError('No cart items Provided');
    }

    if(!tax || !shippingFee){
        throw new CustomError.BadRequestError('Please provide tax and Shipping fee');
    }

    let orderItems = [];
    let subtotal = 0;

    // we are usign for of loop beacuse it will be a await operation 
    for(const item of cartItems){
        const dbProduct = await Product.findOne({ _id: item.product});
        if(!dbProduct){
            throw new CustomError.NotFoundError(
                `No Product with id : ${item.product}`
            )
        }

        const { name, price, image, _id }= dbProduct;
        const singleOrderItem = {
            amount: item.amount,
            name , price, image,
            product: _id
        }

        // Add item to order
        orderItems = [ ...orderItems, singleOrderItem ];
        
        // Calculate subTotal
        subtotal += item.amount * price;
    }

    // Calculate Total 
    const total = tax + shippingFee + subtotal;

    // Get Client Secret - Here using Fake
    const paymentIntent = await fakeStripeAPI({
        amount: total,
        currency: 'usd',
    });

    const order = await Order.create({
        orderItems,
        total,
        subtotal,
        tax,
        shippingFee,
        clientSecret: paymentIntent.client_secret,
        user: req.user.userId,
    });

    res.status(StatusCodes.CREATED)
       .json({ order, clientSecret: order.clientSecret });
}

const getAllOrders = async ( req, res) => {
    res.send('Get All Order');
}

const getSingleOrder = async ( req, res) => {
    res.send('Get Single Orders');
}

const getCurrentUserOrders = async ( req, res) => {
    res.send('Get Current User Orders');
}

const updateOrder = async ( req, res) => {
    res.send('Update Orders');
}

module.exports = {
    getAllOrders,
    getSingleOrder,
    getCurrentUserOrders,
    createOrder,
    updateOrder
};