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
  console.log(project)
  return project;
};

const student = async (parent) => {
  const student = await Users.findById(parent.user_id);
  return student;
};

export default {
  enrollmentQueries: {
    allEnrollments
  },
  Enrollment: {
    project,
    student,
  }
}