// vendors
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { AuthenticationError, ForbiddenError } from 'apollo-server';

// constants
import { USER_STATUS, ROLES } from '../constants/user.constants.js';

// models
import Users from "../models/users.model.js";

const allUsers = async (parent, args, { userSesion, errorMessage }) => {
  if (!userSesion) {
    throw new AuthenticationError(errorMessage);
  }else if(userSesion.role == ROLES.STUDENT) {
    throw new ForbiddenError('No access');
  }
  return await Users.find();
};

const user = async (parent, args, context) => {
  const user = await Users.findById(args._id);
  return user;
};

const userById = async (parent, args, { userSesion, errorMessage }, context) => {
  if (!userSesion) {
    throw new AuthenticationError(errorMessage);
  }else if(userSesion.role !== ROLES.ADMIN) {
    throw new ForbiddenError('No access');
  }
  return await Users.findById(args._id);
};
const deleteUser = async (parent, args, context) => {
  /*if (!userSesion) {
    throw new AuthenticationError(errorMessage);
  }else if(userSesion._id != id._id) {
    throw new ForbiddenError('No access');
  }*/
  const user = await Users.findById({ _id: args._id });
  return user.remove();
}

const registerUser = async (parent, args) => {
  const user = new Users({
    ...args.input,
    status: USER_STATUS.PENDING,
    fullName: `${args.input.name} ${args.input.lastName}`,
    password: await bcrypt.hash(args.input.password, 12),
  });
  return user.save();
};

const updateUser = async (parent, args, { userSesion, errorMessage }) => {
  if (!userSesion) {
    throw new AuthenticationError(errorMessage);
  }
  const id = await Users.findById(args._id);
  
  if(userSesion.role == ROLES.ADMIN && userSesion._id != id._id) {
    args.input = {status: args.input.status};
  }else if(userSesion._id == id._id){
    delete args.input.status;
    delete args.input.role;
  }

  if(args.input.name && args.input.lastName){
    if(args.input.name != id.name && args.input.lastName != id.lastName){
      args.input.fullName = args.input.name+' '+args.input.lastName;
    }
  }

  if(args.input.name){
    if(args.input.name != id.name){
      args.input.fullName = args.input.name+' '+id.lastName;
    }
  }else if(args.input.lastName){
    if(args.input.lastName != id.lastName){
      args.input.fullName = id.name+' '+args.input.lastName;
    }
  }

  const user = await Users.findOneAndUpdate(
    { _id : id._id },
    { $set: { ...args.input} },
    { upsert: true, returnNewDocument : true},//devuelve los datos ya actualizados
  );
  
  return user.save();
};

const userByEmail = async (parent, args, { userSesion, errorMessage }, context) => {
  if (!userSesion) {
    throw new AuthenticationError(errorMessage);
  }else if(userSesion.role !== ROLES.ADMIN) {
    throw new ForbiddenError('No access');
  }
  const user = await Users.findOne({ email: args.email });
  return user;
};

const loginUser = async (parent, args) => {
  const user = await Users.findOne({ email: args.email });
  
  if (!user) {
    throw new ForbiddenError('Email/password not found or incorrect');
  }

  const { password, _id, email } = user;
  const isValid = await bcrypt.compare(args.password, password);
  
  if(!isValid){
    throw new ForbiddenError('Email/password not found or incorrect');
  }
  
  if(user.status !== USER_STATUS.AUTHORIZED){
    throw new ForbiddenError('Access denied');
  }

  const token = await jwt.sign(
    { userSesion: user},
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
    deleteUser,
    updateUser
  },
}