// models
import Enrollments from '../models/enrollments.model.js';
import Projects from '../models/projects.model.js';
import Users from '../models/users.model.js';

const allEnrollments = async () => {
  const enrollments = await Enrollments.find();
  return enrollments;
}

const project = async (parent) => {
  const project = await Projects.findById(parent.project_id);
  return project;
};

const student = async (parent) => {
  const student = await Users.findById(parent.user_id);
  return student;
};

const register = async (parent, args) => {
  console.log(args.input)
  const enrollment = new Enrollments({
    ...args.input
  });
  console.log(enrollment)
  return enrollment.save();
};

export default {
  Query: {
    allEnrollments
  },
  Enrollment: {
    project,
    student,
  },
  enrollmentMutations:{
    register
  }
}