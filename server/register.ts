import { Strapi } from '@strapi/strapi';
import pluginId from '../utils/pluginId';

export default ({ strapi }: { strapi: Strapi }) => {
  strapi.customFields.register({
    name: 'snowflake',
    plugin: pluginId,
    type: 'uid',
  })
};
