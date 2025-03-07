import { clerkClient } from "@clerk/express"

// Middleware ( Protect Educator Routes )
export const protectEducator = async (req,res,next) => {

    try {

        const userId = req.auth.userId
        
        const response = await clerkClient.users.getUser(userId)

        if (response.publicMetadata.role !== 'educator') {
            return res.json({success:false, message: 'Unauthorized Access'})
        }
        
        next ()

    } catch (error) {
        res.json({success:false, message: error.message})
    }

}


// Middleware ( Protect Student Routes )
export const protectStudent = async (req, res, next) => {
    try {
        const userId = req.auth?.userId;

        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized Access" });
        }

        const response = await clerkClient.users.getUser(userId);

        if (response.publicMetadata.role !== "student") {
            return res.status(403).json({ success: false, message: "Forbidden: Access restricted to students" });
        }

        next();
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
