import { gql } from 'apollo-server';

const projectType = gql`
  # Project
  type Project {
    _id: ID!,
    name: String!
    generalObjective: String!
    specificObjectives: [String]!
    budget: Float!
    startDate: String!
    endDate: String!
    leader_id: ID!
    status: projectStatus!
    phase: Phase
    leader: User!
  }
`;

const enums = gql`
  # Enum for status values
  enum projectStatus {
    active,
    inactive
  }

  # Enum for phase values
  enum Phase {
    started,
    in progress,
    ended
  }
`;

const queries = gql`
  # Query all projects
  type Query {
    allProjects: [Project]
  }

  type Query {
    projectById(_id: ID): Project
  }
`;
const mutations = gql`
  type Mutation {
    registerProject(input: RegInput!): Project!
  }

  type Mutation {
    deleteById(_id: ID): Project
  }
  type Mutation {
    updateProject(_id: ID, input: UpdateInputPro!): Project!
  }
`;

const inputP = gql`
  input RegInput {
    name: String!
    generalObjective: String!
    specificObjectives: [String]!
    budget: Float!
    startDate: String!
    endDate: String!
    leader_id: ID!
    status: projectStatus!
    phase: Phase
  }
  input UpdateInputPro {
    name: String!
    generalObjective: String!
    specificObjectives: [String]!
    budget: Float!
    startDate: String!
    endDate: String!
    leader_id: ID!
    status: projectStatus!
    phase: Phase
  }
  
`;

export default [
  projectType,
  enums,
  queries,
  mutations,
  inputP,
  
];