import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import { createError } from "../middleware/errorMiddleware.js";

const formatCartResponse = (cart) => {
  let totalPrice = 0;

  const items = cart.items
    .filter((item) => item.product !== null)
    .map((item) => {
      const subtotal = Number((item.product.price * item.quantity).toFixed(2));
      totalPrice = Number((totalPrice + subtotal).toFixed(2));
      return {
        product: item.product,
        quantity: item.quantity,
        subtotal,
      };
    });

  return {
    _id: cart._id,
    user: cart.user,
    items,
    totalPrice,
  };
};

export const getUserCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId }).populate("items.product");

  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }

  return formatCartResponse(cart);
};

export const addItemToCart = async (userId, { productId, quantity }) => {
  const qty = Number(quantity);
  const product = await Product.findById(productId);

  if (!product) {
    throw createError("Product not found", 404);
  }

  if (product.stock <= 0) {
    throw createError("Product is currently out of stock", 400);
  }

  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }

  const existingItemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId
  );

  if (existingItemIndex > -1) {
    const newQuantity = cart.items[existingItemIndex].quantity + qty;
    if (newQuantity > product.stock) {
      throw createError(
        `Cannot add ${qty} more item(s). Only ${product.stock} available in stock`,
        400
      );
    }
    cart.items[existingItemIndex].quantity = newQuantity;
  } else {
    if (qty > product.stock) {
      throw createError(
        `Requested quantity (${qty}) exceeds available stock (${product.stock})`,
        400
      );
    }
    cart.items.push({ product: productId, quantity: qty });
  }

  await cart.save();
  await cart.populate("items.product");

  return formatCartResponse(cart);
};

export const updateCartItemQuantity = async (userId, productId, quantity) => {
  const qty = Number(quantity);
  const product = await Product.findById(productId);

  if (!product) {
    throw createError("Product not found", 404);
  }

  if (qty > product.stock) {
    throw createError(
      `Requested quantity (${qty}) exceeds available stock (${product.stock})`,
      400
    );
  }

  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    throw createError("Cart not found", 404);
  }

  const itemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId
  );

  if (itemIndex === -1) {
    throw createError("Product not found in cart", 404);
  }

  cart.items[itemIndex].quantity = qty;
  await cart.save();
  await cart.populate("items.product");

  return formatCartResponse(cart);
};

export const removeItemFromCart = async (userId, productId) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    throw createError("Cart not found", 404);
  }

  const initialLength = cart.items.length;
  cart.items = cart.items.filter(
    (item) => item.product.toString() !== productId
  );

  if (cart.items.length === initialLength) {
    throw createError("Product not found in cart", 404);
  }

  await cart.save();
  await cart.populate("items.product");

  return formatCartResponse(cart);
};

export const clearUserCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  } else {
    cart.items = [];
    await cart.save();
  }

  return formatCartResponse(cart);
};
