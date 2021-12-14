// models
import Enrollments from '../models/enrollments.model.js';
import Projects from '../models/projects.model.js';
import Users from '../models/users.model.js';

// constants
import { ROLES } from '../constants/user.constants.js';
import { PHASE, PROJECTS_STATUS } from '../constants/projects.constants.js';
import { ENROLLMENTS_STATUS } from '../constants/enrollments.constants.js';

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

const registerEnrollment = async (parent, args, { userSesion, errorMessage }) => {
  if (!userSesion) {
    throw new Error(errorMessage);
  }else if(userSesion.role == ROLES.ADMIN || userSesion.role == ROLES.LEADER){
    throw new Error("No access");
  }
  const ProjId = await Projects.findById(args.input.project_id);

  if(ProjId.phase == PHASE.ENDED || ProjId.status == PROJECTS_STATUS.INACTIVE){
    throw new Error("Project ended/inactive");
  }

  const studentId = await Users.findById(userSesion._id);
  const enroll = await Enrollments.find({project_id: ProjId._id, user_id: studentId._id}).sort({enrollmentDate: -1});//sort: orden descendente(-1), ascendente(1)

  if(enroll && enroll[0].status == null){
    throw new Error("Enrollment exist, wait admin/leader to acepted enrollment");
  }

  if(enroll && ProjId._id.equals(enroll[0].project_id) && enroll[0].status == ENROLLMENTS_STATUS.ACEPTED && !enroll[0].egressDate){
    throw new Error("Exist enrollment to project");
  }
  
  const date = new Date();//fecha actual
  
  if(enroll && enroll[0].status == ENROLLMENTS_STATUS.ACEPTED && enroll[0].egressDate){
    const dias = 5*enroll[0].length;//dias*numero de intentos
    enroll[0].egressDate = new Date(enroll[0].egressDate.getTime() + dias*24*60*60000);//Calculo de 5 dias: dias*horas*minutos*milesimasSegundos
    
    if(enroll[0].egressDate.equals(date)){
      throw new Error("Debe esperar "+dias+" dias mínimo para hacer una nueva inscripción");
    }
  }
  
  args.input.project_id = ProjId._id;
  args.input.user_id = studentId._id;
  args.input.enrollmentDate = date;

  const enrollments = new Enrollments({
    ...args.input,
  });
  
  return enrollments.save();
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