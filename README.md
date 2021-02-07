@RAT - SASS Rollup Plugin
=========================

A SASS / SCSS Compiler and Bundler Plugin for [rollup](https://rollupjs.org), which is especially 
designed for all pytesNET developed rat products.


Usage
-----

The @rat.md/rollup-plugin-sass package exports 3 rollup plugins: 

-   `RatSass`, the main SASS compiler / handler
-   `RatSassOutput`, an additional output plugin handler
-   `RatSassSkip`, an SASS import skipper / ignore handler

The `RatSass` plugin can only be used in the outer space `plugins` configuration object and will 
take over the whole SASS handling including the output generation / bundling, unless `RatSassOutput` 
is passed in the inner scoped `output.plugins` configuration. This allows to generate different 
CSS stylesheets - on different outputs - for example a minified and unminfied version.

The additional `RatSassSkip` handler can also only be used in the outer space `plugins` object and 
allows to just strip all respective style-imports.


### Usage of RatSass

```javascript
export default {
    input: 'src/index.ts',
    output: {
        file: 'dist/rollup-sass.js',
        format: 'cjs'
    },
    plugins: [
        RatSass()
    ]
};
```

### Usage of RatSassOutput

```javascript
export default {
    input: 'src/index.ts',
    output: [
        {
            file: 'dist/rollup-sass.js',
            format: 'cjs',
            plugins: [
                RatSassOutput()
            ]
        },
        {
            file: 'dist/rollup-sass.js',
            format: 'cjs',
            plugins: [
                RatSassOutput()
            ]
        }
    ],
    plugins: [
        RatSass()
    ]
};
```


### Usage of RatSassSkip

```javascript
export default {
    input: 'src/index.ts',
    output: {
        file: 'dist/rollup-sass.js',
        format: 'cjs'
    },
    plugins: [
        RatSassSkip()
    ]
};
```


Copyright & License
-------------------

Written by SamBrishes (sam@pytes.net) and Lenivyy (lenivyy@pytes.net).<br />
This is a highly adapted fork from [thgh/rollup-plugin-scss](https://github.com/thgh/rollup-plugin-scss).

Published under the MIT license, Coypright &copy; 2020 - 2021 pytesNET.
