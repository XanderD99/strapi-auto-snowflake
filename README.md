# Strapi Snowflake Plugin

This plugin provides automatic generation and validation of Snowflake IDs in Strapi, based on a custom epoch. It includes a custom field where Snowflake IDs can be viewed but not modified, and it automatically generates a Snowflake if none is present during creation.

Plugin supports strapi v5 in from v2.0.0. If you are still on v4 use v1.0.0.

> [!IMPORTANT]
> If you want to integrate other services their snowflakes you can. It won't error, BUT do mind that the parse function could return incorrect information then.

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
  snowflake: {
    enabled: true,
    config: {
      epoch: new Date(0),
      // Make sure worker is unique for every instance you run of your api. If not duplicate ids may be created
      worker: 0,
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

| Field      | Bits      | Number of Bits | Description                                                             | Retrieval                            |
|------------|-----------|----------------|-------------------------------------------------------------------------|--------------------------------------|
| Timestamp  | 63 to 22  | 42 bits         | Milliseconds since custom epoch.                                        | (snowflake >> 22) + epoch            |
| Worker ID  | 21 to 12  | 10 bits         | Represents the worker or machine ID where the snowflake was generated.  | (snowflake >> 12) & 0x3FF            |
| Sequence   | 11 to 0   | 12 bits         | Per-machine sequence number to allow multiple IDs within the same millisecond. | snowflake & 0xFFF                    |

The final Snowflake is represented as a decimal number. The timestamp represents the milliseconds since the configured epoch. The worker ID and sequence prevent clashes across multiple processes or machines.

> [!IMPORTANT]  
> Make sure worker is unique for every instance you run of your api. If not duplicate ids may be created. By default the worker is created by the process id `process.pid % 1024`

## 🙏 Contributing

If you want to contribute to this plugin, please follow the standard open-source contribution practices. Open an issue for discussion or submit a pull request with your changes.

## 👮‍♂️ License

This plugin is licensed under the MIT License. See the LICENSE file for more details.
