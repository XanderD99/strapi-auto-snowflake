# Strapi Snowflake Plugin

This Strapi plugin provides a custom field to handle Discord-style snowflakes. It automatically generates new snowflakes for entries if not present and validates snowflakes provided in the request body. Additionally, you can configure a custom epoch timestamp for generating snowflakes, with the default set to `Date(0)` (January 1, 1970).

> [!CAUTION]
> If you set a custom epoch timestamp, for example Janaury 1, 2024. Snowflakes from Discord will throw errors. Since discord snowflakes are generated from an epoch January 1, 2015. This will then throw validation errors since some discord snowflakes will have a timestamp that is before your custom set epoch date.

## ✨ Features

- **Custom Field**: Adds a read-only field to display the snowflake.
- **Automatic Snowflake Generation**: Automatically generates a new snowflake if one is not provided during entry creation.
- **Snowflake Validation**: Validates provided snowflakes to ensure they are correctly formatted and within acceptable ranges.
- **Custom Epoch Configuration**: Allows setting a custom epoch timestamp for snowflake generation.

## ⌛ Installation

```bash
npm i strapi-plugin-auto-snowflake
# or
yarn add strapi-plugin-auto-snowflake
```

### ⚙️ Configuration

```ts
export default {
  'auto-snowflake': {
    enabled: true,
    config: {
      epoch: new Date(0)
    }
  }
}
```

### 💻 Usage

Most cases you don't need to do anything other than adding the plugin to your plugin config.

However if you ever need to use the snowflakes in other parts of your code, the package also provides a service that generates and validates snowflakes.

```ts
/**
 * navigation controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::navigation.navigation', {
  findOne(ctx) {
    // ... your code
    const { service } = strapi.plugin('strapi-auto-snowflake');

    const { generate, validate } = service('snowflake')

    const snowflake: string = generate();
    const isValid: boolean = validate(snowflake);

    // ... your code
  }
});

```

## ❄️ Snowflake generation

A snowflake is a 64-bit identifier used to uniquely represent a resource. It consists of several parts, each occupying a specific number of bits:

| field     | bits  | number of bits | description                  |   |
|-----------|-------|----------------|------------------------------|---|
| timestamp | 63-22 | 42             | Milliseconds since set Epoch |   |
| random    | 21-0  | 22             |                              |   |

## 🙏 Contributing

If you want to contribute to this plugin, please follow the standard open-source contribution practices. Open an issue for discussion or submit a pull request with your changes.

## 👮‍♂️ License

This plugin is licensed under the MIT License. See the LICENSE file for more details.
