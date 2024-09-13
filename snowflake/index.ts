const SNOWFLAKE_EPOCH = Date.UTC(2021, 0, 1);
const UNSIGNED_23BIT_MAX = 8388607; // (Math.pow(2, 23) - 1) >> 0

const SNOWFLAKE_TIMESTAMP_SHIFT = BigInt(23);

export default (ts = Date.now(), randomBits?: number, epoch = SNOWFLAKE_EPOCH) => `${(BigInt(ts - epoch) << SNOWFLAKE_TIMESTAMP_SHIFT) + BigInt(randomBits || Math.round(Math.random() * UNSIGNED_23BIT_MAX))}`

export const validate = (snowflake: string | number, epoch = BigInt(0), timestampBits = BigInt(41)) => {
  // Ensure the snowflake is a string or number and of reasonable length (18-19 digits typical)
  if (typeof snowflake !== 'string' && typeof snowflake !== 'number') return false;
  if (String(snowflake).length < 18 || String(snowflake).length > 19) return false;

  // Convert the snowflake to BigInt for 64-bit operations
  const snowflakeBigInt = BigInt(snowflake);

  // Extract timestamp by shifting right (64 - timestampBits)
  const timestampShift = BigInt(64) - timestampBits;
  const timestamp = (snowflakeBigInt >> timestampShift) + epoch;

  // Convert the timestamp to a Date object (assuming milliseconds since epoch)
  const creationDate = new Date(Number(timestamp));

  // Check if the date is in the future
  const now = new Date();
  if (creationDate > now) return false;

  // Optional: Check if the date is not too far in the past (based on epoch)
  if (creationDate < new Date(Number(epoch))) return false;

  return true;
}
