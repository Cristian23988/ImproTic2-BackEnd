// models
import Enrollments from '../models/enrollments.model.js';
import Projects from '../models/projects.model.js';
import Users from '../models/users.model.js';

const allEnrollments = async () => {
  const enrollments = await Enrollments.aggregate([{
      $lookup: {
        from: 'projects',
        localField: 'project_id',
        foreignField: '_id',
        as: 'project'
      }
    }, {
      $unwind: { path: '$project' }
    },{
      $project: {
        project: 0
      }
    }]);
  return enrollments;
};

const project = async (parent) => {
  const project = await Projects.findById(parent.project_id);
  return project;
};

const student = async (parent) => {
  const student = await Users.findById(parent.user_id);
  return student;
};
const deleteEnrollById = async (parent, args, context) => {
  const enrollment = await Enrollments.findOne(args._id);
  return enrollment.remove();
};
const registerEnrollment = async (parent, args, context) => {
  const ProjectId = await Projects.findById(args.input.projectId);
  const studentId = await Users.findById(args.input.studentId);
  console.log(args.input)
  const enrollment = new Enrollments({
    ...args.input,
    project_id: ProjectId,
    user_id: studentId,
    enrollmentDate: new Date(),
    status:args.input.status
  });
  console.log(enrollment)
  return enrollment.save();
};

export default {
  enrollmentQueries: {
    allEnrollments
  },
  Enrollment: {
    project,
    student,
  },
  enrollmentMutations:{
    registerEnrollment,
    deleteEnrollById
  }
}