import { gql } from 'apollo-server';

const enrollmentType = gql`
  # Enrollment
  type Enrollment {
    status: EnrollmentStatus
    enrollmentDate: String
    egresDate: String
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
  type Mutations {
    register(input: RegisterInput!): Enrollment!
  }

`;

const inputs = gql`
  input RegisterInput {
    status: String
    enrollmentDate: String
    egresDate: String
  }
`;



export default [
  enrollmentType,
  enums,
  queries,
];
