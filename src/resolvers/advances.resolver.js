// models
import Advances from '../models/advances.model.js';
import Projects from '../models/projects.model.js';
import Enrollments from '../models/enrollments.model.js';
import Users from '../models/users.model.js';
import { AuthenticationError, ForbiddenError } from 'apollo-server';

// constants
import { ROLES } from '../constants/user.constants.js';
import { PHASE, PROJECTS_STATUS } from '../constants/projects.constants.js';
import { ENROLLMENTS_STATUS } from '../constants/enrollments.constants.js';

const allAdvances = async (parent, args, { userSesion, errorMessage }) => {
  if (!userSesion) {
    throw new AuthenticationError(errorMessage);
  }else if(userSesion.role == ROLES.ADMIN){
    throw new ForbiddenError("No access");
  }

  let advances = null;
  let projId = null;
  const user = await Users.findById(userSesion._id);

  if(userSesion.role == ROLES.LEADER){
    if(args.project_id){
      projId = await Projects.find({leader_id: user._id, _id: args.project_id},{_id:1});
    }else{
      projId = await Projects.find({leader_id: user._id},{_id:1});
    }
    advances = await Advances.find({project_id: {'$in': projId}});
    return advances;
  }else{
    if(args.project_id){
      projId = await Projects.findOne({_id: args.project_id},{_id:1});
      advances = await Advances.find({project_id: projId});
    }else{
      projId = await Enrollments.find({user_id: user._id, status: 'acepted', egressDate: {'$exists': false}},{project_id:1, _id:0});

      let countPro = projId.length;
      
      if(countPro > 1){
        projId = await Projects.find({_id: {'$in': projId.project_id}},{_id:1});
        advances = await Advances.find({project_id: {'$in': projId._id}});
      }else{
        projId = await Projects.find({_id: {'$in': projId[0].project_id}},{_id:1});
        advances = await Advances.find({project_id: {'$in': projId[0]._id}});
      }
    }

    if(!advances[0]){
      throw new ForbiddenError("No found advances");
    }

    return advances;    
  }
};

const deleteAdvance = async (parent, args, { userSesion, errorMessage }) => {
  if (!userSesion) {
    throw new AuthenticationError(errorMessage);
  }else if(userSesion.role != ROLES.LEADER){
    throw new ForbiddenError("No access");
  }
  const idAdv = await Advances.findById(args._id);
  
  if(!idAdv){
    throw new ForbiddenError("No found advance");
  }

  const user = await Users.findById(userSesion._id);
  const project = await Projects.find({_id: idAdv.project_id, leader_id: user._id});

  if(!project){
    throw new ForbiddenError("Not found project vinculated");
  }

  if(project.phase == PHASE.ENDED || project.status == PROJECTS_STATUS.INACTIVE){
    throw new ForbiddenError("Project ended/inactive");
  }

  return idAdv.remove();
};

const registerAdvance = async (parent, args, { userSesion, errorMessage }) => {
  if (!userSesion) {
    throw new AuthenticationError(errorMessage);
  }else if(userSesion.role != ROLES.STUDENT){
    throw new ForbiddenError("No access");
  }

  if(!args.input.project_id){
    throw new ForbiddenError("Id project required");
  }
  
  const project = await Projects.findById(args.input.project_id);

  if(project && (project.phase == PHASE.ENDED || project.status == PROJECTS_STATUS.INACTIVE)){
    throw new ForbiddenError("Project ended/inactive");
  }

  const enroll = await Enrollments.find({project_id: project._id}).sort({enrollmentDate: -1});//sort: orden descendente(-1), ascendente(1)

  if(!enroll[0]){
    throw new ForbiddenError("No enroll to project");
  }

  if(enroll[0].status == ENROLLMENTS_STATUS.REJECTED){
    throw new ForbiddenError("No access, enrollment rejected");
  }

  args.input.project_id = project._id;
  args.input.addDate = new Date();

  if(project.phase == PHASE.STARTED){
    const proj = await Projects.findOneAndUpdate(
      { _id : project._id, },
      { $set: { phase: PHASE.IN_PROGRESS} }
    );
  }

  const advance = new Advances({
      ...args.input
  });
  
  return advance.save();
};

const updateAdvance = async (parent, args, { userSesion, errorMessage }) => {
  if (!userSesion) {
    throw new AuthenticationError(errorMessage);
  }else if(userSesion.role == ROLES.ADMIN){
    throw new ForbiddenError("No access");
  }

  const idAdv = await Advances.findById(args._id);

  if(!idAdv){
    throw new ForbiddenError("No found advance");
  }

  const project = await Projects.findById(idAdv.project_id);

  if(!project){
    throw new ForbiddenError("Not found project vinculated");
  }

  if(project.phase == PHASE.ENDED || project.status == PROJECTS_STATUS.INACTIVE){
    throw new ForbiddenError("Project ended/inactive");
  }

  if(userSesion.role == ROLES.LEADER){
    args.input = {observations: args.input.observations};
  }else{
    const enroll = await Enrollments.find({project_id: project._id}).sort({enrollmentDate: -1});//sort: orden descendente(-1), ascendente(1)

    if(!enroll[0]){
      throw new ForbiddenError("No enroll to project");
    }

    if(enroll[0].status == ENROLLMENTS_STATUS.REJECTED){
      throw new ForbiddenError("No access, enrollment rejected");
    }

    args.input = {descriptions: args.input.descriptions};
  }

  const advance = await Advances.findOneAndUpdate(
    { _id : idAdv._id },
    { $set: { ...args.input} },
    { upsert: true, returnNewDocument : true},//devuelve los datos ya actualizados
  );  
  return advance;
};

const project = async (parent) => {
    const project = await Projects.findById(parent.project_id);
    return project;
};

export default {
  advancesQueries: {
    allAdvances,
  },
  Advance: {
    project,
  },
  advancesMutations: {
    registerAdvance,
    deleteAdvance,
    updateAdvance
  },
}