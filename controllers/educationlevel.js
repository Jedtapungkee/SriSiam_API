const prisma = require("../config/prisma");

exports.create = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({
        message: "EducationLevel name is required!!",
      });
    }
    // Create educationLevel
    const educationLevel = await prisma.educationLevel.create({
      data: {
        name,
      },
    });
    res.json({
      message: "EducationLevel created successfully!!!",
      educationLevel,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server educationLevel Error",
    });
  }
};

exports.list = async (req, res) => {
  try {
    const educationLevel = await prisma.educationLevel.findMany();
    res.json(educationLevel);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server educationLevel Error",
    });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        message: "educationLevel ID is required!!",
      });
    }
    // Delete educationLevel
    const educationLevel = await prisma.educationLevel.delete({
        where:{
            id: Number(id),
        }
    })
    res.json({
      message: "educationLevel deleted successfully!!!",
      educationLevel,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server educationLevel Error",
    });
  }
};
