const prisma = require('../config/prisma')

exports.listUsers = async(req,res)=>{
    try {
        const users = await prisma.user.findMany(
            {
                orderBy: {
                    createdAt: 'desc'
                },
                select:{
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    role: true,
                    enabled: true,
                    picture: true,
                    createdAt: true,
                }
            }
        );
        res.json({ users });
    } catch (error) {
        console.error("Error listing users:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}