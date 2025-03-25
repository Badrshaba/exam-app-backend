import jwt from 'jsonwebtoken';
import prisma from '../prisma.js';

export const auth = (accessRoles) => {
  return async (req, res, next) => {
    const { accesstoken } = req.headers;
    const decodedData = jwt.verify(accesstoken, process.env.JWT_SECRET_LOGIN);
    try {
      if (!accesstoken) return next(new Error('please login first', { cause: 400 }));
      if (!decodedData || !decodedData.id) return next(new Error('invalid token payload', { cause: 400 }));
      // user check
      const findUser = await prisma.user.findUnique({ where: { id: decodedData.id } });
      if (!findUser) return next(new Error('please signUp first', { cause: 404 }));
      // auhtorization
      if (!accessRoles.includes(findUser.role)) return next(new Error('unauthorized', { cause: 401 }));
      req.authUser = findUser;
      next();
    } catch (error) {
      next(error);
    }
  };
};
