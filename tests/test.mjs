
import { test } from 'zora';
import { rollup } from 'rollup';
import { RatSass, RatSassOutput, RatSassSkip } from '../dist/rollup-sass.js';

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
