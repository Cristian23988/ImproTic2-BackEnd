import { gql } from 'apollo-server';

const advancesType = gql`
  # Advances
  type Advance {
    addDate: String!
    description: String!
    observations: String!
    project: Project
    egressDate: String!
  }
`;

const queries = gql`
  # Query all advances
  type Query {
    allAdvances: [Advance]
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
    addDate: String!
    description: String!
    observations: String!
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
