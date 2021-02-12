Changelog
=========

Version 0.2.0-alpha
-------------------
-   Update: Update `rollup` dev dependency.
-   Update: Change `rollup-pluginutils` dependency to the new `@rollup/pluginutils`.
-   Update: Move sass constant outside plugin function.
-   Remove: Unused `InputOptions` type declaration on RatSass.
-   Bugfix: Init parent config on RatSassOutput only, if the instance is available.

Version 0.1.3-alpha
-------------------
-   Hotfix: `package.json` - forget to add the `*.mjs` version of the rollup plugin.

Version 0.1.2-alpha
-------------------
-   Update: Adapt `package.json` to just distribute the distribution and typings files.
-   Update: Extend `package.json` with typings index.

Version 0.1.1-alpha
-------------------
-   Add: Use the `fileNames` -applied wildcards on the `banner` and `footer` options too.
-   Bugfix: The sourcemap on minified files were invalid on RatSassOutput.
-   Bugfix: RatSass configuration didn't applied on RatSassOutput.
-   Bugfix: RatSass `banner` and `footer` callback options received an invalid filename.
-   Bugfix: RatSass `footer` attached the css code again if `config.footer` is a function. 
-   Bugfix: RatSass `includePaths` didn't not find their way to RatSassOutput (`concat` failed).

Version 0.1.0-alpha
-------------------
-   Initial Release
