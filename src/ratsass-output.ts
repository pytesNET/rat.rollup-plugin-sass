
/*
 |  ROLLUP PLUGIN
 */
function RatSassOutput(config: RatSassOutputConfig = { }) {

    const transform = function() {
        return;
    }

    const generateBundle = function() {

    };

    // Return Rollup Plugin
    return {
        name: "rat-sass",
        transform,
        generateBundle
    };
}

// Export Module
export default RatSassOutput;
