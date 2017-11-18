if (!('WEBPACK_COMPILE_MODE') in process.env) {
  throw new Error('Webpack compile mode not found');
}

const forceUglify = 'WEBPACK_FORCE_UGLIFY' in process.env;

process.chdir(__dirname);
require('tmp').setGracefulCleanup();

const MODE                           = require('./build/util/compile-mode');
const TsConfigFactory                = require('./build/util/tsconfig-factory');
const {CheckerPlugin}                = require('awesome-typescript-loader');
const HtmlWebpackPlugin              = require('html-webpack-plugin');
const ResourceHintWebpackPlugin      = require('resource-hints-webpack-plugin');
const CopyWebpackPlugin              = require('copy-webpack-plugin');
const path                           = require('path');
const webpack                        = require('webpack');
const ExtractTextPlugin              = require('extract-text-webpack-plugin');
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');
const WebpackPwaManifest             = require('webpack-pwa-manifest');
const FaviconsWebpackPlugin          = require('favicons-webpack-plugin');
const WorkboxPlugin                  = require('workbox-webpack-plugin');

class WebpackFactory {
  
  constructor(mode) {
    this.mode = mode;
  }
  
  get banner() {
    const pkg = require('./package.json');
    const _   = require('lodash');
    
    return `
/**
 * ${pkg.name} - ${pkg.description}
 * @version v${pkg.version}
 * @author ${_.get(pkg, 'author.name') || pkg.author}
 * @link ${pkg.homepage}
 * @license ${pkg.license}
 */
`.trim();
  }
  
  get conf() {
    const out = {
      devtool:   this.devtool,
      cache:     true,
      externals: this.externals,
      resolve:   {
        mainFields: ['module', 'browser', 'main'],
        extensions: [
          '.ts',
          '.js',
          '.html',
          '.json',
          '.scss',
          '.pug'
        ]
      },
      plugins:   this.plugins,
      module:    {
        rules: this.rules
      }
    };
    
    if (this.entry) {
      out.entry = this.entry;
    }
    
    if (this.output) {
      out.output = this.output;
    }
    
    if (this.target) {
      out.target = this.target;
    }
    
    return out;
  }
  
  get devtool() {
    return this.mode === MODE.DEMO_JIT ? 'eval' : 'source-map';
  }
  
  get entry() {
    switch (this.mode) {
      case MODE.DIST_UMD:
        return {
          index:       './src/index.ts',
          'index.min': './src/index.ts'
        };
      case MODE.DEMO_JIT:
        return {
          demo: ['./src/demo/demo.ts', './src/demo/demo.scss']
        };
      case MODE.DEMO_AOT:
        return {
          demo: ['./src/demo/demo.aot.ts', './src/demo/demo.scss']
        };
    }
  }
  
  get externals() {
    return this.mode === MODE.DIST_UMD ? [
      'tslib',
      require('webpack-angular-externals')(),
      require('webpack-rxjs-externals')()
    ] : [];
  }
  
  get output() {
    switch (this.mode) {
      case MODE.DIST_UMD:
        return {
          path:          path.join(__dirname, 'dist', 'umd'),
          filename:      '[name].js',
          libraryTarget: 'umd',
          library:       'ngForage'
        };
      case MODE.DEMO_JIT:
        return {
          path:     path.join(__dirname, '.demo'),
          filename: '[name].js'
        };
      case MODE.DEMO_AOT:
        return {
          path:     path.join(__dirname, '.demo'),
          filename: '[name].[chunkhash].js'
        };
    }
  }
  
  get plugins() {
    const out = [
      new webpack.LoaderOptionsPlugin({
                                        options: {
                                          progress: true
                                        }
                                      })
    ];
    
    if (this.mode === MODE.DIST_UMD || forceUglify) {
      out.push(this.uglifyJSPlugin);
    }
    
    if (this.mode === MODE.DIST_UMD) {
      out.push(new webpack.BannerPlugin({
                                          banner:    this.banner,
                                          raw:       true,
                                          entryOnly: true
                                        }));
    }
    
    if (this.mode !== MODE.DEMO_AOT) {
      out.push(new CheckerPlugin());
    }
    
    if (this.mode !== MODE.DEMO_JIT) {
      out.push(new webpack.DefinePlugin({
                                          'process.env': {
                                            'NODE_ENV': JSON.stringify('production')
                                          }
                                        }));
    }
    
    if ([MODE.DEMO_JIT, MODE.DEMO_AOT].includes(this.mode)) {
      out.push(
        new webpack.optimize.CommonsChunkPlugin({
                                                  name:     'vendor',
                                                  filename: `[name]${this.mode ===
                                                                     MODE.DEMO_AOT ?
                                                                     '.[chunkhash]' :
                                                                     ''}.js`,
                                                  minChunks(module, count) {
                                                    return module.context &&
                                                           module.context.indexOf('node_modules') !==
                                                           -1;
                                                  }
                                                }),
        new CopyWebpackPlugin([
                                {
                                  from:  path.join(__dirname, 'documentation', '**', '*'),
                                  force: true
                                }
                              ]),
        new ExtractTextPlugin(`[name]${this.mode === MODE.DEMO_JIT ? '' : '.[contenthash]'}.css`),
        new WebpackPwaManifest({
                                 name:             'NgForage demo and documentation',
                                 short_name:       'NgForage',
                                 description:      'NgForage demo and documentation',
                                 background_color: '#ffffff',
                                 'theme_color':    '#673ab7',
                                 ios:              true,
                                 fingerprints:     this.mode !== MODE.DEMO_JIT,
                                 icons:            (() => {
                                   const fs  = require('fs');
                                   const dir = path.join(__dirname, 'src', 'demo', 'img');
            
                                   return fs.readdirSync(dir, 'utf8')
                                            .filter(p => /\d+x\d+\.png$/.test(p))
                                            .map(f => {
                                              const match = f.match(/(\d+x\d+)/);
                                              return {
                                                src:  path.join(dir, f),
                                                size: match[1] || match[0]
                                              };
                                            });
                                 })()
                               }),
        new FaviconsWebpackPlugin({
                                    logo:            require.resolve('./src/demo/img/48x45.png'),
                                    inject:          true,
                                    prefix:          this.mode === MODE.DEMO_JIT ? 'ico-' : 'ico-[hash]-',
                                    persistentCache: true,
                                    icons:           {
                                      android:      false,
                                      appleIcon:    false,
                                      appleStartup: false,
                                      coast:        false,
                                      favicons:     true,
                                      firefox:      false,
                                      opengraph:    false,
                                      twitter:      false,
                                      yandex:       false,
                                      windows:      false
                                    }
                                  }),
        new HtmlWebpackPlugin({
                                filename: 'index.html',
                                template: require.resolve('./src/demo/demo.pug'),
                                minify:   false,
                                inject:   'body',
                                preload:  ['**/*'],
                                prefetch: []
                              }),
        new HtmlWebpackIncludeAssetsPlugin({
                                             assets: {
                                               path: '',
                                               glob: '**demo.css'
                                             },
                                             append: true
                                           }),
        new ResourceHintWebpackPlugin(),
        new WorkboxPlugin({
                            globDirectory:                 path.join(__dirname, '.demo'),
                            globPatterns:                  ['**/*.{html,js,css,png,json,svg,ico,otf,eot,ttf,woff,woff2}'],
                            maximumFileSizeToCacheInBytes: Number.MAX_VALUE,
                            directoryIndex:                'index.html',
                            globIgnores:                   [
                              '**/bootstrap.min.css',
                              '**/bootstrap-card.css',
                              '**/compodoc.css',
                              '**/font-awesome.min.css',
                              '**/original.css',
                              '**/postmark.css',
                              '**/prism.css',
                              '**/readthedocs.css',
                              '**/reset.css',
                              '**/stripe.css',
                              '**/tablesort.css',
                              '**/vagrant.css'
                            ],
                            runtimeCaching:                (() => {
                              const _      = require('lodash');
                              const caches = {
                                cacheFirst:           [
                                  /cdn\.polyfill\.io/i,
                                  /fonts\.googleapis\.com/i
                                ],
                                staleWhileRevalidate: [
                                  /fonts\.gstatic\.com/i
                                ],
                                networkFirst:         [
                                  /travis-ci\.org\/Alorel\/ngforage/i,
                                  /img\.shields\.io/i,
                                  /coveralls\.io/i,
                                  /badges\.greenkeeper\.io/i
                                ]
                              };
            
                              return _.reduce(caches, (out, urls, handler) => {
                                for (const urlPattern of urls) {
                                  out.push({urlPattern, handler});
                                }
                                return out;
                              }, []);
                            })(),
                            swDest:                        path.join(__dirname, '.demo', 'sw.js')
                          })
      );
    }
    
    if ([MODE.TEST, MODE.DEMO_JIT, MODE.DEMO_AOT].includes(this.mode)) {
      out.push(
        new webpack.ContextReplacementPlugin(
          /angular[\/\\]core/,
          path.join(__dirname, 'src')
        )
      );
    }
    
    if (this.mode === MODE.TEST) {
      out.push(
        new webpack.SourceMapDevToolPlugin({
                                             filename: null,
                                             test:     /\.(ts|js)($|\?)/i
                                           })
      );
      
      out.push(new webpack.NoEmitOnErrorsPlugin());
    }
    
    return out;
  }
  
  get rules() {
    const scssLoaderBase = [
      {
        loader:  'postcss-loader',
        options: {
          plugins: () => [require('autoprefixer')({
                                                    browsers: 'last 1000 versions',
                                                    grid:     true
                                                  })]
        }
      },
      {
        loader:  'sass-loader',
        options: {outputStyle: 'compressed'}
      }
    ];
    
    const rules = [
      {
        test: /\.svg$/,
        use:  'raw-loader'
      },
      {
        test: /\.pug$/,
        use:  [
          'raw-loader',
          {
            loader:  'pug-html-loader',
            options: {
              doctype: 'html'
            }
          }
        ]
      },
      {
        test:   /demo\.scss$/,
        loader: ExtractTextPlugin.extract({
                                            use: ['css-loader'].concat(scssLoaderBase)
                                          })
      },
      {
        test: path => /\.s?css$/i.test(path) && !path.endsWith('demo.scss'),
        use:  ['raw-loader'].concat(scssLoaderBase)
      },
      {
        test:    /\.ts$/,
        use:     [
          `awesome-typescript-loader?configFileName=${this.tsConfigFileName}`,
          'angular2-template-loader',
          'angular-router-loader'
        ],
        exclude: [
          /node_modules/,
          this.mode === MODE.TEST ? /\.e2e\.ts$/ : /\.(spec|e2e)\.ts$/
        ]
      }
    ];
    
    if (this.mode === MODE.TEST) {
      rules.push({
                   test:    /.ts$/,
                   exclude: [
                     /node_modules/,
                     /\.spec\.ts/,
                     /\.e2e\.ts/,
                     /karma\.conf\.ts/,
                     /karma-test-entry\.ts/
                   ],
                   loader:  'istanbul-instrumenter-loader',
                   enforce: 'post'
                 });
    }
    
    return rules;
  }
  
  get target() {
    if (this.mode !== MODE.DIST_UMD) {
      return 'web';
    }
  }
  
  get tsConfigFileName() {
    return this.mode === MODE.TEST ? 'tsconfig.json' : new TsConfigFactory(this.mode).file;
  }
  
  get uglifyJSPlugin() {
    const include = this.mode === MODE.DEMO_AOT ? /\.js$/ : /\.min\.js$/;
    
    return new webpack.optimize.UglifyJsPlugin({
                                                 include,
                                                 sourceMap:     true,
                                                 cache:         true,
                                                 parallel:      require('os').cpus().length,
                                                 uglifyOptions: require('./build/conf/uglify-options')
                                               });
  }
}

module.exports = new WebpackFactory(parseInt(process.env.WEBPACK_COMPILE_MODE)).conf;
