import type { Request, Response } from 'express';
import User from '../models/user.js';

export const getCurrentUser = async (
    req: Request,
    res: Response,
): Promise<void> => {
    const id = req.user?.userId;
    const user = await User.findById(id).select("-password");
    
    if (!user) {
        res.send(404).json({
            success: false,
            data: null,
            error: { message: 'No logged in' }
        });
        return;
    }

    res.send(200).json({
        success: true,
        data: {
            userId: user._id,
            name: user.name,
            email: user.email,
        },
        error: null
    });
}