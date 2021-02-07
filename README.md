@RAT - SASS Rollup Plugin
=========================

A SASS / SCSS Compiler and Bundler Plugin for [rollup](https://rollupjs.org), which is especially designed for all 
pytesNET developed rat products. Of course, you can use this rollup plugin for your own packages as well, just keep in 
mind, that the functionality is designed specifically for your own product lines.

This is a highly adapted, TypeScript-written and sourceMap supporting fork from [thgh/rollup-plugin-scss](https://github.com/thgh/rollup-plugin-scss). 


Differences to [thgh/rollup-plugin-scss](https://github.com/thgh/rollup-plugin-scss)
----------------------------------------

-   Support for SourceMaps.
-   Support for bundled and separate stylesheets.
-   Uses the Rollup Native assets emit management.
-   Requires node.js version 14.13.0 or above.
-   Does not support postcss and (pre-) processors in general.
-   Does not support using other SASS libraries (DartSASS is the only supported lib).
-   Fails on error per default (not changable).
-   Skipping SASS imports must be done with `RatSassSkip`.
-   Provided functions are not (really) compatible.


Usage
-----

The `@rat.md/rollup-plugin-sass` package exports 3 rollup plugins: 

-   `RatSass`, the main SASS compiler / handler
-   `RatSassOutput`, an additional output plugin handler
-   `RatSassSkip`, an SASS import skipper / ignore handler

The `RatSass` plugin can only be used in the outer scoped `plugins` configuration object and will take over the whole 
SASS handling including the output generation / bundling, unless the additional `RatSassOutput` plugin is available in 
the inner scoped `output.plugins` configuration set. This allows you to generate different CSS stylesheets on all your 
defined outputs, ex.: creating a minified and unminified stylesheet.

The additional `RatSassSkip` handler can also only be used in the outer space `plugins` object and allows to just strip 
all respective style-imports.


### Usage of RatSass

```javascript
import { RatSass } from '@rat.md/rollup-plugin-sass';

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

The `RatSassOutput` plugin can only be used with `RatSass` together.

```javascript
import { RatSass, RatSassOutput } from '@rat.md/rollup-plugin-sass';

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
import { RatSassSkip } from '@rat.md/rollup-plugin-sass';

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


Configuration
-------------

### exclude
> Available for: `RatSass` and `RatSassSkip`

Rollup filter configuration: A valid [picomatch](https://github.com/micromatch/picomatch#globbing-features) pattern, or 
array of patterns. If options.include is omitted or has zero length, filter will return true by default. Otherwise, an 
ID must match one or more of the picomatch patterns, and must not match any of the options.exclude patterns.


### include
> Available for: `RatSass` and `RatSassSkip`

Rollup filter configuration: A valid [picomatch](https://github.com/micromatch/picomatch#globbing-features) pattern, or 
array of patterns. If options.include is omitted or has zero length, filter will return true by default. Otherwise, an 
ID must match one or more of the picomatch patterns, and must not match any of the options.exclude patterns.


### SASS Configuration
> Available for: `RatSass` and `RatSassOutput`

The following SASS options are available on the latest published version, keep in mind that RatSass uses DartSass and 
is not compatible nor configurable for the NodeSass, LibSass or RubySass packages.


#### includePaths

Check out the [related SASS Docs](https://sass-lang.com/documentation/js-api#includepaths) for more information.


#### indentedSyntax

Check out the [related SASS Docs](https://sass-lang.com/documentation/js-api#indentedsyntax) for more information.


#### indentType

Check out the [related SASS Docs](https://sass-lang.com/documentation/js-api#indenttype) for more information.


#### indentWidth

Check out the [related SASS Docs](https://sass-lang.com/documentation/js-api#indentwidth) for more information.


#### linefeed

Check out the [related SASS Docs](https://sass-lang.com/documentation/js-api#linefeed) for more information.


#### omitSourceMapUrl

Check out the [related SASS Docs](https://sass-lang.com/documentation/js-api#omitsourcemapurl) for more information.


#### outFile

This option should be avoided whenever possible, since RatSass pushs this option based on the used rollup configuration. 
Check out the [related SASS Docs](https://sass-lang.com/documentation/js-api#outfile) for more information.


#### outputStyle

The default value for this option is based on the [`output.compact`](https://rollupjs.org/guide/en/#outputcompact) 
rollup configuration. Check out the [related SASS Docs](https://sass-lang.com/documentation/js-api#outputstyle) for more 
information.


#### sourceComments

Check out the [related SASS Docs](https://sass-lang.com/documentation/js-api#sourcecomments) for more information.


#### sourceMap

The default value for this option is based on the [`output.sourcemap`](https://rollupjs.org/guide/en/#outputsourcemap) 
rollup configuration. Check out the [related SASS Docs](https://sass-lang.com/documentation/js-api#sourcemap) for more 
information.


#### sourceMapContents

The default value for this option is based on the [`output.sourcemapExcludeSources`](https://rollupjs.org/guide/en/#outputsourcemapexcludesources) 
rollup configuration. Check out the [related SASS Docs](https://sass-lang.com/documentation/js-api#sourcemapcontents) 
for more information.


#### sourceMapEmbed

The default value for this option is based on the [`output.sourcemap`](https://rollupjs.org/guide/en/#outputsourcemap) 
rollup configuration. Check out the [related SASS Docs](https://sass-lang.com/documentation/js-api#sourcemapembed) for 
more information.


#### sourceMapRoot

Check out the [related SASS Docs](https://sass-lang.com/documentation/js-api#sourcemaproot) for more information.


Copyright & License
-------------------

Written by SamBrishes (sam@pytes.net) and Lenivyy (lenivyy@pytes.net).<br />
This is a highly adapted fork from [thgh/rollup-plugin-scss](https://github.com/thgh/rollup-plugin-scss).

Published under the MIT license, Copyright &copy; 2020 - 2021 pytesNET.
