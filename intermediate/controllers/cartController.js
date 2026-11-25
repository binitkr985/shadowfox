import * as cartService from "../services/cartService.js";

export const getCart = async (req, res, next) => {
  try {
    const cart = await cartService.getUserCart(req.user._id);
    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
};

export const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    const cart = await cartService.addItemToCart(req.user._id, {
      productId,
      quantity,
    });
    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
};

export const updateCartItem = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    const cart = await cartService.updateCartItemQuantity(
      req.user._id,
      productId,
      quantity
    );
    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
};

export const removeFromCart = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const cart = await cartService.removeItemFromCart(req.user._id, productId);
    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
};

export const clearCart = async (req, res, next) => {
  try {
    const cart = await cartService.clearUserCart(req.user._id);
    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
};
