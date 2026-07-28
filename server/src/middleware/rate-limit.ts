import rateLimit from "express-rate-limit";

const isProduction = process.env.NODE_ENV === 'production';

export const loginLimiter = rateLimit({
    skip: () => !isProduction,
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: {
        success: false,
        data: null,
        error: { message: 'Too many requests, please try again later.'},
    },
});

export const registerLimiter = rateLimit({
    skip: () => !isProduction,
    windowMs: 60 * 60 * 1000,
    max: 5,
    message: {
        success: false,
        data: null,
        error: {
            message: 'Too many requests, please try again later.'
        },
    },
});