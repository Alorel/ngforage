module.exports = function() {
  const seq$ = require('gulp-sequence');

  return seq$.apply(seq$, arguments);
};
