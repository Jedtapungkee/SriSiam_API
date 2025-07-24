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

exports.changeStatus = async(req,res)=>{
    try {
        const { id, enabled } = req.body;

        // Find user by ID and update status
        const user = await prisma.user.update({
            where: { id },
            data: { enabled },
            select:{
                enabled: true,
                id: true,
            }
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
}

exports.changeRole = async(req,res)=>{
    try {
        const { id, role } = req.body;

        // Find user by ID and update role
        const user = await prisma.user.update({
            where: { id },
            data: { role },
            select: {
                id: true,
                role: true,
            }
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
}