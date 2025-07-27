const prisma = require("../config/prisma");

exports.listUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        enabled: true,
        picture: true,
        createdAt: true,
      },
    });
    res.json({ users });
  } catch (error) {
    console.error("Error listing users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.changeStatus = async (req, res) => {
  try {
    const { id, enabled } = req.body;

    // Find user by ID and update status
    const user = await prisma.user.update({
      where: { id },
      data: { enabled },
      select: {
        enabled: true,
        id: true,
      },
    });

    // console.log(`User status updated: ${user.id} - Enabled: ${user.enabled}`);
    res.json({
      message: "User status updated successfully",
      user,
    });
  } catch (error) {
    console.error("Error changing user status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.changeRole = async (req, res) => {
  try {
    const { id, role } = req.body;

    // Find user by ID and update role
    const user = await prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        role: true,
      },
    });

    // console.log(`User role updated: ${user.id} - Role: ${user.role}`);
    res.json({
      message: "User role updated successfully",
      user,
    });
  } catch (error) {
    console.error("Error changing user role:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.userCarts = async (req, res) => {
  try {
    const { cart } = req.body;

    const user = await prisma.user.findFirst({
      where: {
        id: Number(req.user.id),
      },
    });

    //check quantity
    for (const item of cart) {
      const product = await prisma.product.findUnique({
        where: {
          id: Number(item.id),
        },
        select: {
          title: true,
          productsizes: {
            select: {
              size: true,
              quantity: true,
              price: true,
            },
          },
        },
      });
      if (!product) {
        return res.status(404).json({
          message: "ไม่พบสินค้านี้ในระบบ",
        });
      }
      if (item.count > product.quantity) {
        return res.status(400).json({
          message: `ขออภัย สินค้า${product.title || "product"}หมดสต๊อกแล้ว`,
        });
      }
    }

    // delete old carts item
    await prisma.productOnCart.deleteMany({
      where: {
        cart: {
          orderedById: user.id,
        },
      },
    });

    // delete old carts
    await prisma.cart.deleteMany({
      where: {
        orderedById: user.id,
      },
    });

    // เตรียมสินค้า
    let products = cart.map((item) => ({
      productId: item.id,
      count: item.count,
      price: item.price,
      size: item.size,
    }));

    // หาผลรวม
    let cartTotal = products.reduce(
      (sum, item) => sum + item.price * item.count,
      0
    );

    // สร้าง cart ใหม่
    const newcart = await prisma.cart.create({
      data: {
        products: {
          create: products,
        },
        cartTotal,
        orderedById: user.id,
      },
    });

    res.send({ message: "Add to cart Successfully" });
  } catch (error) {
    console.error("Error fetching user carts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getUserCarts = async (req, res) => {
  try {
    const cart = await prisma.cart.findFirst({
      where: {
        orderedById: Number(req.user.id),
      },
      include: {
        products: {
          include: {
            product: true,
          },
        },
      },
    });
    res.json({
      products: cart ? cart.products : [],
      cartTotal: cart ? cart.cartTotal : 0,
    });
  } catch (error) {
    console.error("Error fetching user carts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.emptyCart = async (req, res) => {
  try {
    const cart = await prisma.cart.findFirst({
      where: {
        orderedById: Number(req.user.id),
      },
    });

    await prisma.productOnCart.deleteMany({
      where: {
        cartId: cart.id,
      },
    });

    const result = await prisma.cart.deleteMany({
      where: {
        orderedById: Number(req.user.id),
      },
    });

    res.json({
      message: "Cart emptied successfully",
      deletedCount: result.count,
    });
  } catch (error) {
    console.error("Error emptying user cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.saveAddress = async (req, res) => {
  try {
    const { address } = req.body;
    const addressUser = await prisma.user.update({
      where: {
        id: Number(req.user.id),
      },
      data: {
        address,
      },
    });

    res.json({
      message: "Address saved successfully",
    });
  } catch (error) {
    console.error("Error saving address:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.saveOrder = async (req, res) => {
  try {
    // Get User Cart
    const userCart = await prisma.cart.findFirst({
      where: {
        orderedById: Number(req.user.id),
      },
      include: {
        products: true
      },
    });
    // console.log("User Cart:", userCart);

    // check empty Cart
    if (!userCart || userCart.products.length === 0) {
      return res.status(400).json({ ok: false, message: "Cart is empty" });
    }
    // Create Order
    const order = await prisma.order.create({
      data: {
        products: {
          create: userCart.products.map((item) => ({
            productId: item.productId,
            count: item.count,
            price: item.price,
            size: item.size,
          })),
        },
        orderedBy: {
          connect: {
            id: Number(req.user.id),
          },
        },
        cartTotal: userCart.cartTotal,
      },
    });

    //  update Product stock
    const updateProductSizes = userCart.products.map((item) =>
      prisma.productSize.updateMany({
        where: {
          productId: item.productId,
          size: item.size,
        },
        data: {
          quantity: {
            decrement: item.count,
          },
          sold: {
            increment: item.count,
          },
        },
      })
    );
    // Update products in stock
    await Promise.all(updateProductSizes);

    // Delete old carts items
    await prisma.cart.deleteMany({
      where: {
        orderedById: Number(req.user.id),
      },
    });

    res.json({
      message: "Order saved successfully",
      order,
      ok: true,
    });
  } catch (error) {
    console.error("Error saving order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: {
        orderedById: Number(req.user.id),
      },
      include: {
        products: {
          include: {
            product: true,
          },
        },
      },
    });

    if(orders.length === 0 ){
      return res.status(400).json({
        message:"No orders found for this user."
      })
    }

    res.json({
      ok: true,
      orders,
    })
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
