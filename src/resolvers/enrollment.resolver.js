// models
import Enrollments from '../models/enrollments.model.js';
import Projects from '../models/projects.model.js';
import Users from '../models/users.model.js';

// constants
import { ROLES } from '../constants/user.constants.js';
import { PHASE, PROJECTS_STATUS } from '../constants/projects.constants.js';
import { ENROLLMENTS_STATUS } from '../constants/enrollments.constants.js';

const allEnrollments = async (parent, args, { userSesion, errorMessage }) => {
  if (!userSesion) {
    throw new Error(errorMessage);
  }else if(userSesion.role == ROLES.ADMIN){
    throw new Error("No access");
  }

  const user = await Users.findById(userSesion._id);
  let enrollments = null;

  if(userSesion.role == ROLES.LEADER){
    let projId = null;
    if(args.project_id){
      projId = await Projects.find({leader_id: user._id, _id: args.project_id},{_id:1});
    }else{
      projId = await Projects.find({leader_id: user._id},{_id:1});
    }
    enrollments = await Enrollments.find({project_id: {'$in': projId}});
    return enrollments;
  }else{
    enrollments = await Enrollments.find({user_id: user._id});
    return enrollments;
  }
};

const deleteEnrollById = async (parent, args, context) => {
  const enrollment = await Enrollments.findOne(args._id);
  return enrollment.remove();
};

const updateEnrollment = async (parent, args, { userSesion, errorMessage }) => {
  if (!userSesion) {
    throw new Error(errorMessage);
  }else if(userSesion.role == ROLES.ADMIN || userSesion.role == ROLES.STUDENT){
    throw new Error("No access");
  }
  
  const enroll = await Enrollments.findById(args._id);

  if(!enroll){
    throw new Error("No found enrollment");
  }

  if(enroll.enrollmentDate && enroll.egressDate){
    throw new Error("not possible to update");
  }

  if(args.input.status == ENROLLMENTS_STATUS.ACEPTED){
    args.input = {status: args.input.status, enrollmentDate: new Date()};
  }else if(args.input.status == ENROLLMENTS_STATUS.REJECTED){
    args.input = {status: args.input.status, egressDate: new Date()};
  }

  const projId = await Projects.findOne({_id: enroll.project_id, leader_id: userSesion._id});
  const enrollment = await Enrollments.findOneAndUpdate(
    { _id : enroll._id , project_id: projId._id},
    { $set: { ...args.input} },
    { upsert: true, returnNewDocument : true},//devuelve los datos ya actualizados
    );
    return enrollment;
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
  
  if(enroll[0] && enroll[0].status == null){
    
    throw new Error("Enrollment exist, wait admin/leader to acepted enrollment");
  }

  if(enroll[0] && ProjId._id.equals(enroll[0].project_id) && enroll[0].status == ENROLLMENTS_STATUS.ACEPTED && !enroll[0].egressDate){
    throw new Error("Exist enrollment to project");
  }
  
  const date = new Date();//fecha actual
  
  if(enroll[0] && enroll[0].egressDate){
    const dias = 5*24*60*60000;//dias*numero de intentos
    enroll[0].egressDate = new Date(enroll[0].egressDate.getTime() + dias);//Calculo de 5 dias: dias*horas*minutos*milesimasSegundos
    
    if(date < enroll[0].egressDate){
      throw new Error("Debe esperar 5 dias mínimo para hacer una nueva inscripción");
    }
  }
  
  args.input.project_id = ProjId._id;
  args.input.user_id = studentId._id;

  const enrollments = new Enrollments({
    ...args.input,
  });
  
  return enrollments.save();
};

const project = async (parent) => {
  const project = await Projects.findById(parent.project_id);
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
  },
  enrollmentMutations:{
    registerEnrollment,
    deleteEnrollById,
    updateEnrollment
    
  }
}