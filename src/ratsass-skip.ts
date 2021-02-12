
import { OutputOptions, SourceDescription } from 'rollup';
import { createFilter } from '@rollup/pluginutils';

/*
 |  ROLLUP PLUGIN
 */
function RatSassSkip(config: RatSassBasicConfig = { }) {
    const filter = createFilter(config.include || ['**/*.css', '**/*.scss', '**/*.sass'], config.exclude);

    // Return Rollup Plugin
    return {
        name: 'rat-sass-skip',

        // Transform Function
        transform(code: string, id: string): SourceDescription {
            if (!filter(id)) {
                return;
            }
            return {
                code: '',
                map: { mappings: '' }
            };
        },

        // Generate Bundle Function
        generateBundle(options: OutputOptions) {
            return;
        }
    };
}

// Export Module
export default RatSassSkip;
