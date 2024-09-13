/**
 * snowflake service
 */

import { Strapi } from "@strapi/strapi";
import pluginId from "../../utils/pluginId";

const SNOWFLAKE_TIMESTAMP_SHIFT = 22;

export default ({ strapi }: { strapi: Strapi }) => {
  const { config } = strapi.plugin(pluginId);

  const epoch: Date = config('epoch');
  const millis = epoch.getTime();

  return {
    generate: (ts = new Date()) => {
      const timestamp = ts.getTime();

      const timestampPart = BigInt((timestamp - millis) << SNOWFLAKE_TIMESTAMP_SHIFT);
      const randomPart = BigInt(Math.floor(Math.random() * (2 ** SNOWFLAKE_TIMESTAMP_SHIFT)));

      const snowflake = timestampPart | randomPart;

      return snowflake.toString()
    },
    validate: (snowflake: string | number) => {
      // Ensure the snowflake is a string or number and of reasonable length (18-19 digits typical)
      if (typeof snowflake !== 'string' && typeof snowflake !== 'number') return false;

      // Convert the snowflake to BigInt for 64-bit operations
      const snowflakeBigInt = BigInt(snowflake);
      // Ensure the snowflake is a valid 64-bit number (positive)
      if (snowflakeBigInt < 0) {
        return false;
      }

      // Calculate mask for random part using the bit offset
      const randomMask = BigInt((1 << SNOWFLAKE_TIMESTAMP_SHIFT) - 1);

      // Extract timestamp part (first bits up to bitOffset)
      const timestampPart = snowflakeBigInt >> BigInt(SNOWFLAKE_TIMESTAMP_SHIFT);

      // Extract the random part (last bitOffset bits)
      const randomPart = snowflakeBigInt & randomMask;

      // Calculate the actual timestamp from the snowflake
      const timestamp = timestampPart + BigInt(millis);

      const creationDate = new Date(Number(timestamp));

      // Get current date for validation
      const now = new Date();

      // Check if the date is in the future or too far in the past
      if (creationDate > now || creationDate < epoch) {
        return false;
      }

      // Ensure randomPart fits within the bitOffset range
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
