// models
import Advances from '../models/advances.model.js';
import Projects from '../models/projects.model.js';
import Enrollments from '../models/enrollments.model.js';

// constants
import { ROLES } from '../constants/user.constants.js';
import { PHASE, PROJECTS_STATUS } from '../constants/projects.constants.js';
import { ENROLLMENTS_STATUS } from '../constants/enrollments.constants.js';

const allAdvances = async () => {
  const advance = await Advances.aggregate([{
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
  return advance;
};

const deleteAdvance = async (parent, args, context) => {
    const advance = await Advances.findById(args._id);
    return advance.remove();
};

const registerAdvance = async (parent, args, { userSesion, errorMessage }) => {
  if (!userSesion) {
    throw new Error(errorMessage);
  }else if(userSesion.role != ROLES.STUDENT){
    throw new Error("No access");
  }

  if(!args.input.project_id){
    throw new Error("Id project required");
  }
  
  const project = await Projects.findById(args.input.project_id);

  if(project && (project.phase == PHASE.ENDED || project.status == PROJECTS_STATUS.INACTIVE)){
    throw new Error("Project ended/inactive");
  }

  const enroll = await Enrollments.find({project_id: project._id}).sort({enrollmentDate: -1});//sort: orden descendente(-1), ascendente(1)

  if(!enroll[0]){
    throw new Error("No enroll to project");
  }

  if(enroll[0].status == ENROLLMENTS_STATUS.REJECTED){
    throw new Error("No access");
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

const updateAdvance = async (parent, args) => {
  const id = await Advances.findById(args._id);
  const advance = await Advances.findOneAndUpdate(
    { _id : id._id },
    { $set: { ...args.input} },
    { upsert: true, returnNewDocument : true},//devuelve los datos ya actualizados
  );  
  return advance.save();
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