const prisma = require("../config/prisma");

exports.changeStatus = async (req, res) => {
  try {
    const { orderId, orderStatus } = req.body;
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { orderStatus: orderStatus },
    });
    res.json(updatedOrder);
  } catch (error) {
    console.error("Error changing status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getOrdersAdmin = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        products: {
          include: {
            product: true,
          },
        },
        orderedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            address: true,
          },
        },
      },
    });
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
