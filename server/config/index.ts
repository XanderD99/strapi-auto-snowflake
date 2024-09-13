export default {
  default: ({ env }) => ({
    epoch: new Date(0),
  }),
  validator: (config) => {
    console.log(config)
    if (config.epoch.getTime() > Date.now()) throw Error('epoch date is in the future');
  }
};
