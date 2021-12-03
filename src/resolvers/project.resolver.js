import Projects from "../models/projects.model.js";
import Enrollments from '../models/enrollments.model.js';
import Users from "../models/users.model.js";

const allProjects = async (parent, args, { user, errorMessage }) => {
  if(!user) {
    throw new Error(errorMessage);
  }
  console.log(user, errorMessage)
  const projects = await Projects.find();
  return projects;
};

const project = async (parent, args) => {
  const user = await Projects.findById(args._id);
  return user;
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
    project,
  },
  Project: {
    leader,
  }
};