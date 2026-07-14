import logger from '#config/logger.js';
import { formatValidationErrror } from '#utils/format.js';
import { signupSchema, signinSchema } from '#validations/auth.validations.js';
import { jwttoken } from '#utils/jwt.js';
import { cookies } from '#utils/cookies.js';
import {
  comparePassword,
  createUser,
  findUserByEmail,
} from '#services/auth.service.js';

export const signup = async (req, res, next) => {
  try {
    const validationResult = signupSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation Failed',
        details: formatValidationErrror(validationResult.error),
      });
    }

    const { name, email, password, role } = validationResult.data;
    const user = await createUser({ name, email, password, role });
    const token = jwttoken.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    cookies.set(res, 'token', token);

    logger.info(`User registered successfully: ${email}`);
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    logger.error('Signup Error', error);

    if (error.message === 'User already exists') {
      return res.status(409).json({ error: 'Email already exists' });
    }

    next(error);
  }
};

export const signin = async (req, res, next) => {
  try {
    const validationResult = signinSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation Failed',
        details: formatValidationErrror(validationResult.error),
      });
    }

    const { email, password } = validationResult.data;
    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwttoken.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });
    cookies.set(res, 'token', token);

    logger.info(`User signed in successfully: ${email}`);
    res.status(200).json({
      message: 'Signed in successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    logger.error('Signin Error', error);
    next(error);
  }
};

export const signout = async (req, res) => {
  try {
    cookies.clear(res, 'token');
    res.status(200).json({ message: 'Signed out successfully' });
  } catch (error) {
    logger.error('Signout Error', error);
    res.status(500).json({ error: 'Failed to sign out' });
  }
};
