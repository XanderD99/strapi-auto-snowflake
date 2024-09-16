import register from './register';
import bootstrap from './bootstrap';
import config from './config';
import services from './services';

export const DEFAULTS = {
  TIMESTAMP_BITS: 22,
  WORKER_ID_BITS: 10,
  SEQUENCE_BITS: 12,
};

export default {
  config,
  register,
  bootstrap,
  services,
};
