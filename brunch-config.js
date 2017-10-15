module.exports = {

    paths: {
        public: "dist",
        watched: ["src/main/webapp"]
    },

    files: {
        javascripts: {
            joinTo: {
                "app.js": /^src/,
                "vendor.js": /^node_modules/
            }
        },
        stylesheets: {
            joinTo: {
                "app.css": /^src/,
                "vendor.css": /^node_modules/
            }
        }
    },

    npm: {
        enabled: true,
        globals: {
            d3: "d3",
            c3: "c3"
        },
        styles: {
            bootstrap: ["dist/css/bootstrap.css"],
            c3: ["c3.css"]
        }
    },

    plugins: {
        babel: {presets: ["es2015", "react"]}
    },

    modules: {
        autoRequire: {
            "app.js": ["src/main/webapp/initialize.js"]
        }
    },

    server: {
        hostname: "0.0.0.0",
        port: 4321,
        noPushState: true
    }
};

// TODO : eslint
// TODO : flow with https://www.npmjs.com/package/flow-brunch
// TODO : integration with travis