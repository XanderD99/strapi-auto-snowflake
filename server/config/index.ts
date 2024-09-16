export default {
  default: ({ env }) => ({
    epoch: new Date(0),
    worker: process.pid % 1024,
  }),
  validator: (config) => {
    if (config.epoch.getTime() > Date.now()) throw Error('epoch date is in the future');
  }
};
