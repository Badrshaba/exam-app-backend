import prisma from '../../prisma.js';
// ========================================= GetProfile API ================================//

/**
 * destructure from token
 * get the user from the database
 * return the response
 */
export const getProfile = async (req, res, next) => {
  // 1- destructure from token
  const { id } = req.authUser;
  // 2- get the user from the database
  const user = await prisma.user.findUnique({ where: { id } });
  // 3- return the response
  res.status(200).json({
    success: true,
    message: 'success',
    data: user,
  });
};
