const { default: mongoose } = require("mongoose");
const OrderModel = require("../Model/order.model");

async function CreateOrder(req, res) {
  const userId = req.UserId;
  const { Items, address, totalAmount } = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res
        .status(400)
        .send({ message: "Invalid User Id", success: false });
    }
    const checkUser = await UserModel.findOne({ _id: userId });
    if (!checkUser) {
      return res
        .status(400)
        .send({ message: "Users not present pls Signup", success: false });
    }

    if (!Items) {
      return res
        .status(400)
        .send({ message: "Items not present", success: false });
    }

    const order = await OrderModel.create({
      user: userId,
      orderItems: Items,
      shippingAddress: address,
      totalAmount: totalAmount,
    });
    return res
      .status(201)
      .send({ message: "Data Successfully fetched", success: true, order });
  } catch (er) {
    return res.status(500).send({ message: er.message, success: false });
  }
}

async function GetUserOrders(req, res) {
  const userId = req.UserId;
  try {
    if (!mongoose.Types.ObjectId.isValid) {
      return res
        .status(400)
        .send({ message: "In valid user id", success: false });
    }
    const checkUser = await UserModel.findOne({ _id: userId });
    if (!checkUser) {
      return res
        .status(400)
        .send({ message: "Please sign up", success: false });
    }
    const orders = await OrderModel.find({ user: userId });
    return res
      .status(200)
      .send({ message: "Data Successfully fetched", success: true, orders });
  } catch (er) {
    return res.status(500).send({ message: er.message, success: false });
  }
}

module.exports = {
  CreateOrder,
  GetUserOrders,
};
