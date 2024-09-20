import { Core } from '@strapi/strapi';

export default ({ strapi }: { strapi: Core.Strapi }) => {
  strapi.customFields.register({
    name: 'snowflake',
    plugin: 'snowflake',
    type: 'uid',
  })
};
