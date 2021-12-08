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

const updateEnrollment = async (parent, args) => {
  const id = await Enrollments.findById(args._id);
  if(args.input.status=="rejected"){
    const enrollment = await Enrollments.findOneAndUpdate(
      { _id : id._id },
      { $set: { ...args.input,egressDate: new Date()} },
      { upsert: true, returnNewDocument : true},//devuelve los datos ya actualizados
      ); 
      return enrollment.save();
  }else{
    const enrollment = await Enrollments.findOneAndUpdate(
      { _id : id._id },
      { $set: { ...args.input} },
      { upsert: true, returnNewDocument : true},//devuelve los datos ya actualizados
      ); 
      return enrollment.save();
  }
   

  
};
const registerEnrollment = async (parent, args, context) => {
  const ProjectId = await Projects.findById(args.input.projectId);
  const studentId = await Users.findById(args.input.studentId);

  const enrollment = new Enrollments({
    ...args.input,
    project_id: ProjectId,
    user_id: studentId,
    enrollmentDate: new Date()
  });
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
    deleteEnrollById,
    updateEnrollment
    
  }
}