import userResolver from "./user.resolver.js";
import projectResolver from "./project.resolver.js";
import enrollmentResolver from "./enrollment.resolver.js";
import advancesResolver from "./advances.resolver.js";
import miscResolver from "./misc.resolver.js";

const { userQueries, userMutations, ...userRest } = userResolver;
const { projectQueries, projectMutations, ...projectRest } = projectResolver;
const { enrollmentQueries, enrollmentMutations, ...enrollmentRest} = enrollmentResolver;
const { advancesQueries, advancesMutations, ...advancesRest} = advancesResolver;
const { miscQueries, miscMutations, ...miscRest} = miscResolver;

export default {
  Query: {
    ...userQueries,
    ...projectQueries,
    ...enrollmentQueries,
    ...advancesQueries,
    ...miscQueries,
  },
  Mutation: {
    ...userMutations,
    ...projectMutations,
    ...enrollmentMutations,
    ...advancesMutations,
    ...miscMutations,
  },
  ...userRest,
  ...projectRest,
  ...enrollmentRest,
  ...advancesRest,
  ...miscRest,
};
