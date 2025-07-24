const prisma = require("../config/prisma");
const jwt = require('jsonwebtoken')

exports.authCheck = async(req, res, next) => {
    try {
        const headerToken = req.headers.authorization
        if(!headerToken) {
            return res.status(401).json({message: "No Token, Authorization"})
        }
        const token = headerToken.split(' ')[1]

        const decode = jwt.verify(token, process.env.SECRET)
        req.user = decode

        const user = await prisma.user.findFirst({
            where:{
                email: req.user.email
            }
        })
        if(!user.enabled){
            return res.status(400).json({message: "User not enabled"})
        }

        next()
    } catch (error) {
        console.log(error)
        res.status(500).json({error: 'Token invalid'})
    }
}


exports.adminCheck = async (req, res, next) => {
    try {
        if (!req.user || !req.user.email) {
            return res.status(401).json({ message: 'Unauthorized: No user information found' });
        }

        const { email } = req.user;

        const adminUser = await prisma.user.findUnique({
            where: { email },
        });

        if (!adminUser || adminUser.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied: Admin only' });
        }

        next();
    } catch (error) {
        console.error('Admin check error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
