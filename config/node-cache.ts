import NodeCache from "node-cache";

export const cache = new NodeCache({
  stdTTL: 60 * 60, // standard time to live of 1 hour --> Time to live for each key
  checkperiod: 60 * 5, // check for expired keys every 5 minutes --> How often expired keys are cleared
});