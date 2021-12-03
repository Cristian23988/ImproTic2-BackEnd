// vendors
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// models
import Users from "../models/users.model.js";

const allUsers = async (parent, args, { user, errorMessage }) => {
  if(user) {
    throw new Error(errorMessage);
  }
  return await Users.find();
};

const user = async (parent, args, context) => {
  console.log(args)
  const user = await Users.findById(args._id);
  return user;
};

const userById = async (parent, args, context) => {
  const user = await Users.findById(args._id);
  return user;
};
const deleteUser = async (parent, args, context) => {
  console.log(args.email,"ELIMINADO")
  const user = await Users.findOne({ email: args.email });
 return user.remove();
}

const registerUser = async (parent, args) => {
  console.log(args.input)
  const user = new Users({
    ...args.input,
    password: await bcrypt.hash(args.input.password, 12),
  });
  console.log(user)
  return user.save();
};

const userByEmail = async (parent, args, context) => {
  const user = await Users.findOne({ email: args.email });
  return user;
};

const loginUser = async (parent, args) => {
  const user = await Users.findOne({ email: args.email });
  const { password, _id, email } = user;
  if (!user) {
    throw new Error('User not found');
  }
  const isValid = await bcrypt.compare(args.password, password);
  if(!isValid) {
    throw new Error('Wrong password');
  }
  const token = await jwt.sign(
    { userId: _id },
    process.env.SECRET,
    { expiresIn: "1h" }
  );
  return token;
};

export default {
  userQueries: {
    allUsers,
    user,
    userById,
    userByEmail
  },
  userMutations: {
    registerUser,
    loginUser,
    deleteUser
  },
}