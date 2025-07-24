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
      
      if (!product || item.count > product.quantity) {
        return res.status(400).json({
          ok: false,
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
      size: item.size
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
