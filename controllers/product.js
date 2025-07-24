const prisma = require("../config/prisma");

exports.createProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      categoryId,
      productsizes,
      gender,
      educationLevelId,
    } = req.body;

    // ติดImageไว้เดี๋ยวมาทำ

    const product = await prisma.product.create({
      data: {
        title,
        description,
        price: parseInt(price),
        categoryId: parseInt(categoryId),
        gender,
        educationLevelId: educationLevelId ? parseInt(educationLevelId) : null,
        productsizes: {
          create: productsizes.map((item) => {
            return {
              size: item.size,
              quantity: parseInt(item.quantity),
            };
          }),
        },
      },
    });
    res.send(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Product Error" });
  }
};

exports.list = async (req, res) => {
  try {
    const { count } = req.params;
    const products = await prisma.product.findMany({
      take: parseInt(count),
      orderBy: {
        createdAt: "desc",
      },
      include: {
        productsizes: true,
        category: true,
        educationLevel: true,
        images: true,
      },
    });
    res.send(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Product Error" });
  }
};

exports.read = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: {
        productsizes: true,
        category: true,
        educationLevel: true,
        images: true,
      },
    });
    res.send(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Product Read Error" });
  }
};

exports.update = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      categoryId,
      productsizes,
      gender,
      educationLevelId,
    } = req.body;

    // ติดImageไว้เดี๋ยวมาทำ

    // clear existing productsizes
    await prisma.productSize.deleteMany({
      where: { productId: parseInt(req.params.id) },
    });

    const product = await prisma.product.update({
      where: { id: parseInt(req.params.id) },
      data: {
        title,
        description,
        price: parseInt(price),
        categoryId: parseInt(categoryId),
        gender,
        educationLevelId: educationLevelId ? parseInt(educationLevelId) : null,
        productsizes: {
          create: productsizes.map((item) => {
            return {
              size: item.size,
              quantity: parseInt(item.quantity),
            };
          }),
        },
      },
    });
    res.send(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Product Update Error" });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    // ติดImageไว้เดี๋ยวมาทำ

    // ค้นหา Product ที่ต้องการลบ include sizes and Images แต่ติดImagesไว้ก่อน
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: {
        productsizes: true,
      },
    });
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    // ลบ Product
    await prisma.product.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: "Product deleted successfully", product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Product Remove Error" });
  }
};

exports.listby = async (req, res) => {
  try {
    const { sort, order, limit } = req.body;
    const products = await prisma.product.findMany({
      take: parseInt(limit),
      orderBy: {
        [sort]: order,
      },
      include: {
        category: true,
        images: true,
        productsizes: true,
        educationLevel: true,
      },
    });
    res.send(products);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server product listby Error" });
  }
};

const handleQuery = async (req, res, query) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        title: {
          contains: query, // ค้นหาชื่อสินค้าที่มีคำว่า query
        },
      },
      include: {
        category: true,
        images: true,
        productsizes: true,
        educationLevel: true,
      },
    });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Product Query Error" });
  }
};

const handlePrice = async (req, res, price) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        price: {
          gte: price[0], // กำหนดราคาต่ำสุด
          lte: price[1], // กำหนดราคาสูงสุด
        },
      },
      include: {
        category: true,
        images: true,
        productsizes: true,
        educationLevel: true,
      },
    });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Product Search Price Error" });
  }
};

const handleCategory = async (req, res, categoryId) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        categoryId: {
          in: categoryId.map((id) => Number(id)),
        },
      },
      include: {
        category: true,
        images: true,
      },
    });
    res.send(products);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Search Category Error" });
  }
};

exports.searchFilters = async(req,res)=>{
    try{
    const { query, price, category } = req.body;
    if (query) {
      await handleQuery(req, res, query);
    }
    if(price && price.length === 2){
      await handlePrice(req, res, price);
    }
    if (category && category.length > 0) {
      await handleCategory(req, res, category);
    }

    }catch(error){
        console.error(error);
        res.status(500).json({ error: "Server Product Search Filters Error" });
    }
}
