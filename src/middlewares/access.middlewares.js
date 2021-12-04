// vendors
import jwt from 'jsonwebtoken';

const validateAuthentication = async (req) => {
  const token = req.headers.authorization;
  try {
    const session = await jwt.verify(token, process.env.SECRET);
    return {
      userSesion: session.userSesion,
    }
  } catch (error) {
    return {
      errorMessage: error.message,
    }
  }
};

export default validateAuthentication;