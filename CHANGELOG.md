Changelog
=========

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
