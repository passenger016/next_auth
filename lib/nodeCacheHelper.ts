import { cache } from "@/config/node-cache";

// The cache instance is alread created and exported from config/node-cache.ts

// function to get all cache data --> using the cache keys instead of relying on cache.data
// IMPORTANT: this function doesn't work yet so stick to the cache.data implmentation for now
// export const getAllCacheData = () => {
//   const keys = cache.keys();
//   const allData = keys.map((key) => {
//     {
//       acc[key]: cache.get(key);
//       return acc;
//     }
//   });
//   console.log("All cache data:", allData);
// };

// function for SETTING a value in the cache
export const setCache = (key: string, value: any) => {
  const success = cache.set(key, value);
  if (success) console.log(`Cache set for key: ${key}, value: ${value}`);
  else console.log(`Failed to set cache for key: ${key}`);
  console.log(`Current cache data: ${JSON.stringify(cache.data)}`);
};
// function for GETTING a value from the cache
export const getCache = (key: string) => {
  const value = cache.get(key);
  if (value) {
    console.log(`Cache for key: ${key} is value: ${value}`);
    return value;
  }
  if (value === undefined) {
    console.log(
      `No cache found for key: ${key}, it may have expired or does not exist`
    );
    return null;
  }
};
// function for DELETING a value from the cache
export const delCache = (key: string) => {
  const deleted = cache.del(key);
  if (deleted) console.log(`Cache deleted for key: ${key}`);
  else console.log(`No cache found to delete for key: ${key}`);
};
// flush all the cache data
export const flushCache = () => {
  cache.flushAll();
  console.log("All cache data flushed");
  console.log(`Current cache data: ${cache.data}`);
};
