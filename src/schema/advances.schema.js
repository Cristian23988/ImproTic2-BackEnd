import { gql } from 'apollo-server';

const advancesType = gql`
  # Advances
  type Advance {
    _id: ID!
    project_id: ID!
    addDate: String!
    description: String!
    observations: String!
    project: Project
  }
`;

const queries = gql`
  # Query all advances
  type Query {
    allAdvances(project_id: ID): [Advance]
  }
`;

const mutations = gql`
  type Mutation {
    registerAdvance(input: RegisterInputAd!): Advance!
  }

  type Mutation {
    deleteAdvance( _id: ID!): Advance!
  }

  type Mutation {
    updateAdvance(_id:  ID!, input: UpdateInputAd!): Advance!
  }
`;

const inputs = gql`
  input RegisterInputAd {
    project_id: ID!
    description: String!
  }

  input UpdateInputAd{
    description: String
    observations: String
  }
`;

export default [
  advancesType,
  queries,
  mutations,
  inputs,
];
