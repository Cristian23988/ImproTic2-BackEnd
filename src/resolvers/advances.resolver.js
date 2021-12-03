// models
import Advances from '../models/advances.model.js';
import Projects from '../models/projects.model.js';

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

const registerAdvance = async (parent, args) => {
  const project = await Projects.findById(args.input.project_id);
  const advance = new Advances({
      ...args.input,
      project_id: project._id,
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