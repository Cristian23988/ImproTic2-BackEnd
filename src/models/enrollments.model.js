import mongoose from 'mongoose';
const { Schema } = mongoose;

const enrollmentsSchema = new Schema({
 
  status: {
    type: String,
    enum: ['acepted', 'rejected'],
  },
  enrollmentDate: {
    type: Date,
  },
  egressDate: {
    type: Date
  }
})

const Enrollements = new mongoose.model('enrollments', enrollmentsSchema);

export default Enrollements;