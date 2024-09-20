/**
 * snowflake service
 */

import { Core } from "@strapi/strapi";
import { DEFAULTS } from "..";

const one = BigInt(1)

export const waitUntilNextTimestamp = (currentTimestamp: number) => {
  let nextTimestamp = Date.now();
  while (nextTimestamp <= currentTimestamp) {
    nextTimestamp = Date.now();
  }
  return nextTimestamp;
};

export default ({ strapi }: { strapi: Core.Strapi }) => {
  let lastTimestamp = -1;
  let sequence = 0;
  const maxSequence = (1 << DEFAULTS.SEQUENCE_BITS) - 1;

  const { config } = strapi.plugin('snowflake');

  const epoch: number = (config('epoch') as Date).getTime();
  const worker: number = config('worker')

  return {
    generate: () => {
      // Get the current timestamp in milliseconds
      let timestamp = Date.now();

      // If the current timestamp is less than the last timestamp, it means the clock is moving backward
      if (timestamp < lastTimestamp) throw new Error('Clock is moving backwards!');

      // If the timestamp is the same as the last one (still within the same millisecond)
      if (timestamp === lastTimestamp) {
        // Increment the sequence number and apply a bitwise AND with maxSequence to ensure it wraps around
        sequence = (sequence + 1) & maxSequence;

        // If sequence exceeds its limit (i.e., we reached the max value), we wait until the next millisecond
        if (sequence === 0) timestamp = waitUntilNextTimestamp(timestamp);
      } else {
        // If the timestamp has changed, reset the sequence number to 0
        sequence = 0;
      }

      // Update the last timestamp to the current one
      lastTimestamp = timestamp;

      // Calculate the offset between the current timestamp and the epoch (the reference starting point)
      const timestampOffset = timestamp - epoch;

      // Convert the timestamp offset to a binary string and pad it to the required length (SNOWFLAKE_TIMESTAMP_SHIFT)
      const timestampBits = timestampOffset.toString(2).padStart(DEFAULTS.TIMESTAMP_BITS, '0');

      // Convert the worker ID to a binary string and pad it to the required length (WORKER_ID_BITS)
      const workerIdBits = worker.toString(2).padStart(DEFAULTS.WORKER_ID_BITS, '0');

      // Convert the sequence number to a binary string and pad it to the required length (SEQUENCE_BITS)
      const sequenceBits = sequence.toString(2).padStart(DEFAULTS.SEQUENCE_BITS, '0');

      // Concatenate the timestamp, worker ID, and sequence bits to form the binary representation of the snowflake ID
      const idBinary = `${timestampBits}${workerIdBits}${sequenceBits}`;

      // Convert the binary string to a decimal string (BigInt handles large numbers safely)
      const idDecimal = BigInt('0b' + idBinary).toString();

      // Return the snowflake ID as a string (to avoid issues with large numbers in JavaScript)
      return idDecimal.toString();
    },
    parse: (snowflake: string | number) => {
      const snowflakeBigInt = BigInt(snowflake);

      // Constants for bit-shifting
      const workerIdShift = BigInt(DEFAULTS.SEQUENCE_BITS); // Worker ID is shifted by sequence bits
      const timestampShift = BigInt(DEFAULTS.WORKER_ID_BITS + DEFAULTS.SEQUENCE_BITS); // Timestamp is shifted by worker + sequence bits

      // Bitmask for worker ID and sequence parts
      const workerIdMask = (one << BigInt(DEFAULTS.WORKER_ID_BITS)) - one;
      const sequenceMask = (one << BigInt(DEFAULTS.SEQUENCE_BITS)) - one;

      // Extract the individual parts
      const timestampOffset = Number(snowflakeBigInt >> timestampShift); // Extract timestamp part
      const workerId = Number((snowflakeBigInt >> workerIdShift) & workerIdMask); // Extract worker ID
      const sequence = Number(snowflakeBigInt & sequenceMask); // Extract sequence number

      // Add back the epoch to get the actual timestamp
      const timestamp = timestampOffset + epoch;

      // Return an object with the parts
      return {
        timestamp: new Date(timestamp), // Convert to Date object for readability
        workerId,
        sequence,
      };
    }
  }
};
