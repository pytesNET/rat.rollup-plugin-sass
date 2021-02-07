
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
    t.equals(output[1].source, expected);
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
    t.equals([output[1].source, output[2].source], expected);
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
    t.equals([output[1].source, output[2].source], expected);
});


/*
 |  DEFAULT WITH CUSTOMIZED OUTPUT
 */
test('RatSass - Default with customized Output', async (t) => {
    const bundle = await rollup({
        input: 'tests/default/index.js',
        plugins: [
            RatSass({
                outDir: './dist/css',
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
    t.equals([output[1].source, output[2].source], expected);
});


/*
 |  MULTIPLE SASS FILES TO BUNDLE
 *
test('RatSass - Multiple as Bundle', async (t) => {
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
            format: 'cjs'
        }
    });

    t.equal(1, 0);
});


/*
 |  MULTIPLE SASS FILES SEPARATELY
 *
test('RatSass - Multiple store separately', async (t) => {
    const bundle = await rollup({
        input: 'tests/multiple/index.js',
        plugins: [
            RatSass({
                output: true,
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

    t.equal(1, 0);
});


/*
 |  HANDLE INVALID SASS
 *
test('RatSass - Invalid SASS', async (t) => {
    const bundle = await rollup({
        input: 'tests/sass-error/index.js',
        plugins: [
            RatSass({
                output: true
            })
        ]
    });
    const { output } = await bundle.generate({
        output: {
            file: 'tests/sass-error/test.js',
            format: 'cjs'
        }
    });

    t.equal(1, 0);
});


/*
 |  MULTIPLE SASS FILES TO BUNDLE
 *
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
 *
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
 *
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
*/
