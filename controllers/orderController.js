import orderModel from '../models/orderModel.js';

export const getOrdersController = async (req, res) => {
  try {
    const data = await orderModel
      .find({ buyer: req.user._id })
      .populate('products', '-photo')
      .populate('buyer', 'name');
    res.status(200).send({
      success: true,
      message: 'Order fetched successfully',
      data,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: 'Error in order fetching',
      error,
    });
  }
};

//ALL ORDERS
export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({})
      .populate('products', '-photo')
      .populate('buyer', 'name');
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Error WHile Geting Orders',
      error,
    });
  }
};

//ORDERS STATUS
export const orderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const orders = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Error While Updateing Order',
      error,
    });
  }
};
