
import { test } from 'zora';
import { rollup } from 'rollup';
import { RatSass, RatSassOutput, RatSassSkip } from '../dist/rollup-sass.js';


/*
 |  DEFAULT
 */
test('RatSass - Default', async (t) => {
    const bundle = await rollup({
        input: 'tests/default/index.js',
        plugins: [
            RatSass()
        ]
    });
    const { output } = await bundle.generate({
        output: {
            file: 'tests/default/test.js',
            format: 'cjs'
        }
    });
    const expected = 'html, body {\n  color: red;\n}\nhtml div, body div {\n  color: orange;\n}';

    // Compare Result
    t.is(output[1].source, expected);
});


/*
 |  DEFAULT WITH SOURCEMAP
 */
test('RatSass - Default with SourceMap [Rollup]', async (t) => {
    const bundle = await rollup({
        input: 'tests/default/index.js',
        plugins: [
            RatSass()
        ]
    });
    const { output } = await bundle.generate({
        output: {
            file: 'tests/default/test.js',
            format: 'cjs',
            sourcemap: true
        }
    });
    const expected = [
        'html, body {\n  color: red;\n}\nhtml div, body div {\n  color: orange;\n}\n\n/*# sourceMappingURL=index-4cda8f14.css.map */',
        '{"version":3,"sourceRoot":"","sources":["stdin"],"names":[],"mappings":"AACA;EACI;;AAEA;EACI","file":"index-4cda8f14.css"}'
    ];

    // Compare Result
    t.is(output[1].source, expected[0]);
    t.is(output[2].source, expected[1]);
});


/*
 |  DEFAULT WITH SOURCEMAP
 */
test('RatSass - Default with SourceMap [RatSass]', async (t) => {
    const bundle = await rollup({
        input: 'tests/default/index.js',
        plugins: [
            RatSass({
                sourceMap: true
            })
        ]
    });
    const { output } = await bundle.generate({
        output: {
            file: 'tests/default/test.js',
            format: 'cjs'
        }
    });
    const expected = [
        'html, body {\n  color: red;\n}\nhtml div, body div {\n  color: orange;\n}\n\n/*# sourceMappingURL=index-4cda8f14.css.map */',
        '{"version":3,"sourceRoot":"","sources":["stdin"],"names":[],"mappings":"AACA;EACI;;AAEA;EACI","file":"index-4cda8f14.css"}'
    ];

    // Compare Result
    t.is(output[1].source, expected[0]);
    t.is(output[2].source, expected[1]);
});


/*
 |  DEFAULT WITH CUSTOMIZED OUTPUT
 */
test('RatSass - Default with customized output', async (t) => {
    const bundle = await rollup({
        input: 'tests/default/index.js',
        plugins: [
            RatSass({
                banner: '/* Start */',
                prefix: '@import "./tests/global/index.scss";',
                footer: '/* End */',
                sourceMap: true,
                sourceMapUrls: true
            })
        ]
    });
    const { output } = await bundle.generate({
        output: {
            file: 'tests/default/test.js',
            format: 'cjs'
        }
    });
    const expected = [
        '/* Start */\n*,\n*:before,\n*:after {\n  box-sizing: inherit;\n}\n\nhtml, body {\n  color: red;\n}\nhtml div, body div {\n  color: orange;\n}\n\n/* End */\n/*# sourceMappingURL=index-4cda8f14.css.map */',
        '{\"version\":3,\"sourceRoot\":\"\",\"sources\":[\"./tests/global/index.scss\",\"assets/index-4cda8f14.css\"],\"names\":[],\"mappings\":\"AACA;AAAA;AAAA;EAGI;;;ACHJ;EACI;;AAEA;EACI\",\"file\":\"index-4cda8f14.css\"}'
    ];

    // Compare Result
    t.is(output[1].source, expected[0]);
    t.is(output[2].source, expected[1]);
});


/*
 |  MULTIPLE SASS FILES TO BUNDLE
 */
test('RatSass - Multiple as Bundle', async (t) => {
    const bundle = await rollup({
        input: 'tests/multiple/index.js',
        plugins: [
            RatSass({
                bundle: true
            })
        ]
    });
    const { output } = await bundle.generate({
        output: {
            file: 'tests/multiple/test.js',
            format: 'cjs'
        }
    });
    if (output[1].source.indexOf('black') < output[1].source.indexOf('white')) {
        var expected = 'html, body {\n  color: red;\n  background-color: black;\n}\nhtml div, body div {\n  color: orange;\n  background-color: black;\n}\n\nhtml, body {\n  color: red;\n  background-color: white;\n}\nhtml div, body div {\n  color: orange;\n  background-color: white;\n}';
    } else {
        var expected = 'html, body {\n  color: red;\n  background-color: white;\n}\nhtml div, body div {\n  color: orange;\n  background-color: white;\n}\n\nhtml, body {\n  color: red;\n  background-color: black;\n}\nhtml div, body div {\n  color: orange;\n  background-color: black;\n}';
    }

    // Compare Result
    t.is(output[1].source, expected);
});


/*
 |  MULTIPLE SASS FILES SEPARATELY
 */
test('RatSass - Multiple store separately', async (t) => {
    const bundle = await rollup({
        input: 'tests/multiple/index.js',
        plugins: [
            RatSass({
                bundle: false
            })
        ]
    });
    const { output } = await bundle.generate({
        output: {
            file: 'tests/multiple/test.js',
            format: 'cjs'
        }
    });
    if (/\: black/.test(output[1].source)) {
        var expected = ['html, body {\n  color: red;\n  background-color: black;\n}\nhtml div, body div {\n  color: orange;\n  background-color: black;\n}', 'html, body {\n  color: red;\n  background-color: white;\n}\nhtml div, body div {\n  color: orange;\n  background-color: white;\n}'];
    } else {
        var expected = ['html, body {\n  color: red;\n  background-color: white;\n}\nhtml div, body div {\n  color: orange;\n  background-color: white;\n}', 'html, body {\n  color: red;\n  background-color: black;\n}\nhtml div, body div {\n  color: orange;\n  background-color: black;\n}'];
    }

    // Compare Result
    t.is(output[1].source, expected[0]);
    t.is(output[2].source, expected[1]);
});


/*
 |  MULTIPLE SASS FILES TO BUNDLE
 */
test('RatSass/Output - Multiple as Bundle with two outputs', async (t) => {
    const bundle = await rollup({
        input: 'tests/multiple/index.js',
        plugins: [
            RatSass({
                output: true,
                bundle: true
            })
        ]
    });
    const { output } = await bundle.generate({
        output: {
            file: 'tests/multiple/test.js',
            format: 'cjs',
            plugins: [
                RatSassOutput({
                    
                })
            ]
        }
    });

    t.equal(1, 0);
});


/*
 |  MULTIPLE SASS FILES SEPARATELY
 */
test('RatSass/Output - Multiple store separately with two outputs', async (t) => {
    const bundle = await rollup({
        input: 'tests/multiple/index.js',
        plugins: [
            RatSass({
                output: true
            })
        ]
    });
    const { output } = await bundle.generate({
        output: {
            file: 'tests/multiple/test.js',
            format: 'cjs',
            plugins: [
                RatSassOutput({
                    
                })
            ]
        }
    });

    t.equal(1, 0);
});


/*
 |  TEST SKIPPER
 */
test('RatSassSkip - Skip all stylesheets', async (t) => {
    const bundle = await rollup({
        input: 'tests/skip/index.js',
        plugins: [
            RatSassSkip()
        ]
    });
    const { output } = await bundle.generate({
        output: {
            file: 'tests/skip/test.js',
            format: 'cjs'
        }
    });
    const expected = "'use strict';\n"
                   + '\n'
                   + "document.addEventListener('DOMContentLoaded', () => {\r\n"
                   + "    console.log('The above index.scss part should not be included in the test.js file.');\r\n"
                   + '});\n';

    // Compare Result
    t.equal(output[0].code, expected, 'The CSS imports should be skipped without any errors.');
});


/*
 |  HANDLE INVALID SASS
 */
test('RatSass - Invalid SASS', async (t) => {
    const bundle = await rollup({
        input: 'tests/sass-error/index.js',
        plugins: [
            RatSass({
                output: true
            })
        ]
    });
    
    try{
        const { output } = await bundle.generate({
            output: {
                file: 'tests/sass-error/test.js',
                format: 'cjs'
            }
        });

        t.fail('The above code MUST throw an error!');
    } catch (e) {
        t.throws(() => {
            throw new Error();
        });
    }
});
