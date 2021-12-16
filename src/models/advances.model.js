import mongoose from 'mongoose';
const { Schema } = mongoose;

const advancesSchema = new Schema({
    project_id: {
        type: Schema.ObjectId,
        required: true,
    },
    addDate: {
        type: Date,
        required: true
    },
    description: {
        type: 'string',
        required: true
    },
    observations: {
        type: 'string'
    },
})

const Advances = new mongoose.model('advances', advancesSchema);

export default Advances;