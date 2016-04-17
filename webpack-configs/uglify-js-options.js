const uglifyJsOptions = {
    minimize: true,
    compress: {
        warnings: false,
        properties: true,
        sequences: true,
        dead_code: true,
        conditionals: true,
        comparisons: true,
        evaluate: true,
        booleans: true,
        unused: true,
        loops: true,
        hoist_funs: true,
        cascade: true,
        if_return: true,
        join_vars: true,
        drop_debugger: true,
        negate_iife: true,
        unsafe: true,
        hoist_vars: true
    },
    mangle: {
        except: ['exports', 'require'],
        toplevel: true,
        sort: true,
        eval: true,
        properties: true
    },
    output: {
        space_colon: false,
        comments: false
    }
};

export default uglifyJsOptions;