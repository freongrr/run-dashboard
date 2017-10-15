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
        styles: {
            bootstrap: ["dist/css/bootstrap.css"],
            c3: ["c3.css"]
        },
        static: [
            "d3.js",
            "c3.js"
        ]
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
