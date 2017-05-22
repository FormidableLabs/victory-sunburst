const _ = require("lodash");
const base = require("./webpack.config.dev");

// Update our own module version.
const mod = _.cloneDeep(base.module);

// First loader needs react hot.
mod.loaders[0].loaders = ["react-hot"].concat(mod.loaders[0].loaders);

module.exports = _.merge({}, _.omit(base, "entry", "module"), {
  entry: {
    app: ["webpack/hot/dev-server", "./demo/app.jsx"]
  },
  module: mod
});
