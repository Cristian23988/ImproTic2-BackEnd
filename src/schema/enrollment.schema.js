import { gql } from 'apollo-server';

const enrollmentType = gql`
  # Enrollment
  type Enrollment {
    _id: ID
    project_id: ID
    user_id: ID
    status: EnrollmentStatus
    enrollmentDate: String
    egressDate: String
    project: Project!
    student: User!
  }
`;

const enums = gql`
  # Enum for status values
  enum EnrollmentStatus {
    acepted
    rejected
  }
`;

const queries = gql`
  # Query all enrollments
  type Query {
    allEnrollments: [Enrollment]
  }
`;

const mutations = gql`
  type Mutation {
    registerEnrollment(input: RegiInputEn!): Enrollment!
  }
  type  Mutation {
    deleteEnrollById(_id:ID!): Enrollment!
  }
  type Mutation {
    updateEnrollment(_id:ID!, input: UpdateInputEn!): Enrollment!
  }
`;

const inputs = gql`
  input RegiInputEn {
    project_id: ID!
  }
  input UpdateInputEn {
    status: EnrollmentStatus
  }
`;

export default [
  enrollmentType,
  enums,
  queries,
  mutations,
  inputs
];