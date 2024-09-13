/**
 * snowflake service
 */

import { Strapi } from "@strapi/strapi";
import pluginId from "../../utils/pluginId";

const SNOWFLAKE_TIMESTAMP_SHIFT = BigInt(22);

export default ({ strapi }: { strapi: Strapi }) => {
  const { config } = strapi.plugin(pluginId);

  const epoch: Date = config('epoch');
  const epochBigInt = BigInt(epoch.getTime());

  return {
    generate: (ts = new Date()) => {
      const timestamp = BigInt(ts.getTime());

      // Calculate the time difference between now and the Discord Epoch
      const timestampPart = (timestamp - epochBigInt) << SNOWFLAKE_TIMESTAMP_SHIFT;

      // Generate a random number with SNOWFLAKE_TIMESTAMP_SHIFT bits
      const randomPart = BigInt(Math.floor(Math.random() * (2 ** Number(SNOWFLAKE_TIMESTAMP_SHIFT))));

      // Combine the timestamp part and the random part to form the snowflake
      const snowflake = timestampPart | randomPart;

      return snowflake.toString();  // Return as a string to avoid precision issues
    },
    validate: (snowflake: string | number) => {
      // Ensure the snowflake is a string or number
      if (typeof snowflake !== 'string' && typeof snowflake !== 'number') return false;

      // Ensure the snowflake is a BigInt (for 64-bit precision)
      const snowflakeBigInt = BigInt(snowflake);

      // Ensure the snowflake is a valid 64-bit number (positive)
      if (snowflakeBigInt < 0) {
        return false;
      }

      // Calculate mask for random part using the bit offset
      const one = BigInt(1)
      const randomMask = (one << SNOWFLAKE_TIMESTAMP_SHIFT) - one;

      // Extract timestamp part (first bits up to SNOWFLAKE_TIMESTAMP_SHIFT)
      const timestampPart = snowflakeBigInt >> SNOWFLAKE_TIMESTAMP_SHIFT;

      // Extract the random part (last SNOWFLAKE_TIMESTAMP_SHIFT bits)
      const randomPart = snowflakeBigInt & randomMask;

      // Calculate the actual timestamp from the snowflake
      const timestamp = timestampPart + epochBigInt;

      // Convert timestamp to a Date object
      const creationDate = new Date(Number(timestamp));

      // Get current date for validation
      const now = new Date();

      // Check if the date is in the future or too far in the past
      if (creationDate > now || creationDate < epoch) {
        return false;
      }

      // Ensure randomPart fits within the SNOWFLAKE_TIMESTAMP_SHIFT range
      if (randomPart < 0 || randomPart > randomMask) {
        return false;
      }
      return true;
    }
  }
};


// export default (strapi: Strapi) => {
//   const { config } = strapi.plugin(pluginId)

//   return {
//     generate:  (ts = Date.now(), randomBits?: number, epoch = SNOWFLAKE_EPOCH) => `${(BigInt(ts - epoch) << SNOWFLAKE_TIMESTAMP_SHIFT) + BigInt(randomBits || Math.round(Math.random() * UNSIGNED_23BIT_MAX))}`
//   };
// }
