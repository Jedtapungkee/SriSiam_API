const express = require("express");
const {
  listUsers,
  changeStatus,
  changeRole,
  userCarts,
  getUserCarts,
  emptyCart,
  saveAddress,
  saveOrder,
  getOrder,
} = require("../controllers/user");
const router = express.Router();
const { adminCheck, authCheck } = require("../middlewares/authCheck");

router.get("/users", listUsers);
router.post("/change-status", authCheck, adminCheck, changeStatus);
router.post("/change-role", authCheck, adminCheck, changeRole);

router.post("/user/cart", authCheck, userCarts);
router.get("/user/cart", authCheck, getUserCarts);
router.delete("/user/cart", authCheck, emptyCart);
router.post("/user/address", authCheck, saveAddress);

router.post("/user/order", authCheck, saveOrder);
router.get("/user/order", authCheck, getOrder);

module.exports = router;
