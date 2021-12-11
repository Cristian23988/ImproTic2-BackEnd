import Projects from "../models/projects.model.js";
import Enrollments from '../models/enrollments.model.js';
import Users from "../models/users.model.js";

// constants
import { USER_STATUS, ROLES } from '../constants/user.constants.js';

const allProjects = async (parent, args, { userSesion, errorMessage }) => {
  if (!userSesion) {
    throw new Error(errorMessage);
  }

  const projects = await Projects.find();
  return projects;
};

const projectById = async (parent, args, context) => {
  const project = await Projects.findById(args._id);
  return project;
};

const deleteById = async (parent, args, context) => {
  const project = await Projects.findOne(args._id);
  return project.remove();
};

const updateProject = async (parent, args, { userSesion, errorMessage }) => {
  if (!userSesion) {
    throw new Error(errorMessage);
  }else if(userSesion.role == ROLES.STUDENT){
    throw new Error("No access");
  }
  
  const idProject = await Projects.findById(args._id); //Consultar projecto
  const date = new Date();

  //Validar si no ha finalizado el project
  if(idProject.phase == "ended"){
    throw new Error("Project ended");
  }

  //Validar roles
  const userId = await Users.findById(userSesion._id);

  if(userSesion.role == ROLES.ADMIN){
    args.input = {status: args.input.status, phase: args.input.phase};
  }else if(!idProject.leader_id.equals(userId._id)){ //Validar si NO es el lider de ese proyecto
    throw new Error("No access");
  }
  
  if(args.input.phase && args.input.phase == "ended"){
    args.input.status = "inactive";
    args.input.endDate = date;
  }
  
  //Actualizar enrollment/projects al recibir STATUS o PHASE
  if(idProject.phase && (idProject.phase == "started" || idProject.phase == "in_progress") && args.input.status == "inactive"){
    const enroll = await Enrollments.findOneAndUpdate(
      { project_id : idProject._id , egressDate: null, status: "acepted"},
      { $set: { egressDate: date } },
    );
  }
  
  const project = await Projects.findOneAndUpdate(
    { _id : idProject._id },
    { $set: { ...args.input} },
  );
  
  return project;
};

const registerProject = async (parent, args, { userSesion, errorMessage }) => {
  if (!userSesion) {
    throw new Error(errorMessage);
  }else if(userSesion.role == ROLES.STUDENT && userSesion.role == ROLES.ADMIN){
    throw new Error("No access");
  }
  //const leaderId = await Users.findById(args.input.leader_id);
  console.log(userSesion);
  /*const project = new Projects({
    ...args.input,
    status: "inactive",
    startDate: new Date(),
    leader_id: leaderId._id
  });*/
  //return project.save();
};

const leader = async (parent) => {
  const user = await Users.findById(parent.leader_id);
  return user;
};


const enrollments = async (parent) => {
  const enrollments = await Enrollments.find({ project_id: parent._id.toString() });
  return enrollments;
}


export default {
  projectQueries: {
    allProjects,
    projectById,
  },
  Project: {
    leader,
  },
  projectMutations: {
    deleteById,
    registerProject ,
    updateProject
  }
};