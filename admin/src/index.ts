import { getTranslation } from './utils/getTranslation';
import { PLUGIN_ID } from './pluginId';
import { Initializer } from './components/Initializer';
import { PluginIcon } from './components/PluginIcon';

export default {
  register(app: any) {
    app.customFields.register({
      name: 'snowflake',
      pluginId: PLUGIN_ID,
      type: "string",
      intlLabel: {
        id: getTranslation("form.label"),
        defaultMessage: "snowflake",
      },
      intlDescription: {
        id: getTranslation("form.description"),
        defaultMessage: "Generates a unique snowflake",
      },
      icon: PluginIcon,
      components: {
        Input: async () => import("./components/SnowflakeField"),
      },
      options: {
        advanced: [
          {
            sectionTitle: {
              id: 'global.settings',
              defaultMessage: 'Settings',
            },
            items: [
              {
                name: 'private',
                type: 'checkbox',
                intlLabel: {
                  id: 'form.attribute.item.privateField',
                  defaultMessage: 'Private field',
                },
                description: {
                  id: 'form.attribute.item.privateField.description',
                  defaultMessage: 'This field will not show up in the API response',
                },
              },
            ],
          },
        ],
        validator: () => {},
      },
    });


    app.registerPlugin({
      id: PLUGIN_ID,
      initializer: Initializer,
      isReady: false,
      name: PLUGIN_ID,
    });
  },

  async registerTrads(app: any) {
    const { locales } = app;

    const importedTranslations = await Promise.all(
      (locales as string[]).map((locale) => {
        return import(`./translations/${locale}.json`)
          .then(({ default: data }) => {
            return {
              data: getTranslation(data),
              locale,
            };
          })
          .catch(() => {
            return {
              data: {},
              locale,
            };
          });
      })
    );

    return importedTranslations;
  },
};
