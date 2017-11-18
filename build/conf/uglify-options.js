Object.defineProperty(module, 'exports', {
  get() {
    return {
      timings:  false,
      ie8:      false,
      ecma:     5,
      compress: {
        dead_code:     true,
        properties:    false,
        drop_debugger: true,
        unsafe_math:   false,
        unsafe_comps:  false,
        conditionals:  true,
        comparisons:   true,
        evaluate:      true,
        booleans:      true,
        typeofs:       true,
        loops:         true,
        unsafe:        false,
        unsafe_Func:   false,
        unsafe_proto:  false,
        unsafe_regexp: false,
        unused:        true,
        drop_console:  true,
        hoist_funs:    false,
        hoist_vars:    false,
        if_return:     true,
        join_vars:     true,
        cascade:       true,
        collapse_vars: true,
        reduce_vars:   true,
        pure_getters:  false,
        keep_fargs:    false,
        keep_fnames:   false,
        passes:        1
      },
      mangle:   {
        safari10:        true,
        keep_classnames: false,
        keep_fnames:     false,
        eval:            false
      }
    };
  }
});
