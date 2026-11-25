import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import { createError } from "../middleware/errorMiddleware.js";

export const ALLOWED_ORDER_STATUSES = [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
];

export const createOrderFromCart = async (userId) => {
  const cart = await Cart.findOne({ user: userId }).populate("items.product");

  if (!cart || cart.items.length === 0) {
    throw createError("Cannot place an order with an empty cart", 400);
  }

  let totalAmount = 0;
  const orderItems = [];

  for (const item of cart.items) {
    if (!item.product) {
      throw createError("One or more products in your cart no longer exist", 404);
    }

    const product = await Product.findById(item.product._id);
    if (!product) {
      throw createError(`Product "${item.product.name}" not found`, 404);
    }

    if (product.stock < item.quantity) {
      throw createError(
        `Insufficient stock for "${product.name}". Available: ${product.stock}, Requested: ${item.quantity}`,
        400
      );
    }

    orderItems.push({
      product: product._id,
      name: product.name,
      price: product.price,
      quantity: item.quantity,
    });

    totalAmount = Number(
      (totalAmount + product.price * item.quantity).toFixed(2)
    );
  }

  for (const item of orderItems) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: -item.quantity },
    });
  }

  const order = await Order.create({
    user: userId,
    items: orderItems,
    totalAmount,
    status: "pending",
  });

  cart.items = [];
  await cart.save();

  return order;
};

export const getUserOrders = async (userId) => {
  return await Order.find({ user: userId }).sort({ createdAt: -1 });
};

export const getOrderById = async (orderId, requestingUser) => {
  const order = await Order.findById(orderId).populate("user", "name email");

  if (!order) {
    throw createError("Order not found", 404);
  }

  const orderOwnerId = order.user._id
    ? order.user._id.toString()
    : order.user.toString();

  if (
    requestingUser.role !== "admin" &&
    orderOwnerId !== requestingUser._id.toString()
  ) {
    throw createError("Not authorized to view this order", 403);
  }

  return order;
};

export const getAllOrders = async () => {
  return await Order.find()
    .populate("user", "name email")
    .sort({ createdAt: -1 });
};

export const updateOrderStatusById = async (orderId, status) => {
  if (!ALLOWED_ORDER_STATUSES.includes(status)) {
    throw createError(
      `Invalid order status. Allowed values: ${ALLOWED_ORDER_STATUSES.join(", ")}`,
      400
    );
  }

  const order = await Order.findByIdAndUpdate(
    orderId,
    { status },
    { new: true, runValidators: true }
  ).populate("user", "name email");

  if (!order) {
    throw createError("Order not found", 404);
  }

  return order;
};
