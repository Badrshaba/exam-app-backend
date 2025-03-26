import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../../prisma.js';
// ========================================= SignUp API ================================//

/**
 * destructuring the required data from the request body
 * check if the user already exists in the database using the email
 * if exists return error email is already exists
 * password hashing
 * create new document in the database
 * return the response
 */
export const signUp = async (req, res, next) => {
  // 1- destructure the required data from the request body
  const { firstName, lastName, email, password } = req.body;
  // 2- check if the user already exists in the database using the email
  const isEmailExists = await prisma.user.findUnique({ where: { email } });
  if (isEmailExists) {
    return next(new Error('Email already exists,Please try another email', { cause: 409 }));
  }
  // 3- password hashing
  const hashedPassword = await bcrypt.hash(password, +process.env.SALT_ROUNDS);
  // 4- create new document in the database
  const user = await prisma.user.create({ data: { firstName, lastName, password: hashedPassword, email } });
  // 5- return the response
  res.status(201).json({
    success: true,
    message: 'User created successfully',
    data: user,
  });
};

// ========================================= SignIn API ================================//

/**
 * destructuring the required data from the request body
 * check if the user already exists in the database using the email
 * if exists return error email is already exists
 * password hashing
 * create new document in the database
 * return the response
 */

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return next(new Error('Invalid email or password ', { cause: 401 }));
  }
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    return next(new Error('Invalid email or password ', { cause: 401 }));
  }
  // generate login token
  const token = jwt.sign({ id: user.id, email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

  res.status(200).json({
    success: true,
    message: 'User logged in successfully',
    token,
    data: user,
  });
};

// ========================================= Set Password API =======================//

/**
 * destructuring the required data from the request body
 * check if the user already exists in the database using the email
 * if exists return error email is already exists
 * password hashing
 * create new document in the database
 * return the response
 */

export const setPassword = async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  const { id } = req.authUser;
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    return next(new Error('Invalid email or password ', { cause: 401 }));
  }
  const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isPasswordMatch) {
    return next(new Error('Invalid old password ', { cause: 401 }));
  }
  // password hashing
  const hashedPassword = await bcrypt.hash(newPassword, +process.env.SALT_ROUNDS);
  // update password in the database
  await prisma.user.update({ where: { id }, data: { password: hashedPassword } });
  res.status(200).json({
    success: true,
    message: 'Password updated successfully',
  });
};
