import { dirname } from 'path';
import { createFilter } from 'rollup-pluginutils';

require('sass');
function RatSass(config = {}) {
    const filter = createFilter(config.include || ['/**/*.css', '/**/*.scss', '/**/*.sass'], config.exclude);
    const includes = config.includePaths || ['node_modules'];
    includes.push(process.cwd());
    const transform = (code, id) => {
        if (!filter(id)) {
            return;
        }
        includes.push(dirname(id));
        if ('watch' in config) {
            let files = Array.isArray(config.watch) ? config.watch : [config.watch];
            files.forEach((file) => this.addWatchFile(file));
        }
        if (!config.output) {
            return {
                code: '',
                map: { mappings: '' }
            };
        }
        return {
            code: '',
            map: { mappings: '' }
        };
    };
    const generateBundle = (options) => {
        if (config.output === false) {
            return;
        }
        if (config.output === true) ;
        if (typeof config.output === 'string') ;
        if (typeof config.output === 'function') ;
    };
    return {
        name: "rat-sass",
        transform,
        generateBundle
    };
}

function RatSassOutput(config = {}) {
}

function RatSassSkip(config = {}) {
    const filter = createFilter(config.include || ['/**/*.css', '/**/*.scss', '/**/*.sass'], config.exclude);
    return {
        name: 'rat-sass',
        transform(code, id) {
            if (!filter(id)) {
                return;
            }
            return {
                code: '',
                map: { mappings: '' }
            };
        },
        generateBundle(options) {
            return;
        }
    };
}

export { RatSass, RatSassOutput, RatSassSkip };