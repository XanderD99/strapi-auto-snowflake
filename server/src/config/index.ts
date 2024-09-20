export interface SnowflakeConfig {
  epoch: Date,
  worker: number
}

export default {
  default: ({ env }): SnowflakeConfig => ({
    epoch: new Date(0),
    worker: process.pid % 1024,
  }),
  validator: (config: SnowflakeConfig) => {
    if (config.epoch.getTime() > Date.now()) throw Error('epoch date is in the future');
  }
};
