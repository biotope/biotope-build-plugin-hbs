# biotope-build-plugin-hbs

## Options
| Property          | Type     | Optional | Default                                                   | Description                            |
|-------------------|----------|----------|-----------------------------------------------------------|----------------------------------------|
| `srcPatterns`     | string[] | yes      | `['src/components/**/scaffolding/*.hbs']`                 | The handlebars templates to compile    |
| `partialPatterns` | string[] | yes      | `['src/components/**/*.hbs']`                             | The partials to register for compiling |
| `dataPatterns`    | string[] | yes      | `['src/components/**/*.json', 'src/resources/**/*.json']` | The data to use to fill the partials.  |