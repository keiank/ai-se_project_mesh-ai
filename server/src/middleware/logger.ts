import morgan from 'morgan';

const isProduction = process.env.NODE_ENV === 'production';
const logFormat = isProduction ? 'combined' : 'dev';
export const requestLogger = morgan(logFormat);
