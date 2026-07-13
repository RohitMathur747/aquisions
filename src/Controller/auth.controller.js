import logger from '#config/logger.js';
import { formatValidationErrror } from '#utils/format.js';
import { signupSchema } from '#validations/auth.validations.js';

export const signup = async (req, res, next) => {
  try {
    const validationResult = signupSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation Failed',
        details: formatValidationErrror(validationResult.error),
      });
    }

    const { name, email, role } = validationResult.data;
    logger.info(`User Register  Successfully:${email}`);
    res.status(201).json({
      message: 'User Register',
      user: {
        id: 1,
        name,
        email,
        role,
      },
    });
  } catch (e) {
    logger.error('Signup Error', e);

    if (e.message === 'user email already exists') {
      return res.status(409).json({ error: 'Email already Exists' });
    }
    next(e);
  }
};
