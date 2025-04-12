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
 * if not exists return error Invalid email or password
 * compare password
 * if password not match return error Invalid email or password
 * create token
 * return the response
 */

export const signin = async (req, res, next) => {
  // destructuring the required data from the request body
  const { email, password } = req.body;
  // check if the user already exists in the database using the email
  const user = await prisma.user.findUnique({ where: { email } });
  // if not exists return error Invalid email or password
  if (!user) {
    return next(new Error('Invalid email or password ', { cause: 401 }));
  }
  // compare password
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  // if old password not match return error Invalid email or password
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
 * check if the user already exists in the database using the id
 * if not exists return error login first
 * compare password
 * if old password not match return error Invalid password
 * password hashing
 * update password in the database
 * return the response
 */

export const setPassword = async (req, res, next) => {
  // destructuring the required data from the request body
  const { oldPassword, newPassword } = req.body;
  const { id } = req.authUser;
  // check if the user already exists in the database using the id
  const user = await prisma.user.findUnique({ where: { id } });
  // if not exists return error login first
  if (!user) {
    return next(new Error('login first', { cause: 401 }));
  }
  // compare password
  const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
  // if old password not match return error Invalid password
  if (!isPasswordMatch) {
    return next(new Error('Invalid password ', { cause: 401 }));
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
