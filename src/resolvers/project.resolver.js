import Projects from "../models/projects.model.js";
import Enrollments from '../models/enrollments.model.js';
import Users from "../models/users.model.js";

const allProjects = async (parent, args, { user, errorMessage }) => {
  if (!user) {
    throw new Error(errorMessage);
  }
  console.log(user, errorMessage)
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

const registerProject = async (parent, args) => {
  const leaderId = await Users.findById(args.input.leader_id);
  const project = new Projects({
    ...args.input,
    startDate: new Date(),
    leader_id: leaderId
  });
  return project.save();
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
    registerProject 
  }
};