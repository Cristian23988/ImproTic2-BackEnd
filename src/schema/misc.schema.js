import { gql } from 'apollo-server';

const roleType = gql`
  # Role
  type role {
    code: String!
    value: String!
  }
`;

const queries = gql`
  # Query roles
  type Query {
    roles: [role]
  }
`;

export default [
  roleType,
  queries,
];
