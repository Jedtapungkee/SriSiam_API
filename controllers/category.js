const prisma = require("../config/prisma");

exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({
        message: "Category name is required!!",
      });
    }
    // Create category
    const category = await prisma.category.create({
      data: {
        name,
      },
    });
    res.json({
      message: "Category created successfully!!!",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Category Error",
    });
  }
};

exports.listCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Category Error",
    });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        message: "Category ID is required!!",
      });
    }
    // Delete category
    const category = await prisma.category.delete({
        where:{
            id: Number(id),
        }
    })
    res.json({
      message: "Category deleted successfully!!!",
      category,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Category Error",
    });
  }
};
