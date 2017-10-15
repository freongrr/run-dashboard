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
        babel: {
            presets: [
                "latest",
                "react",
                "flow"
            ],
            plugins: [
                "transform-class-properties",
                "transform-flow-strip-types"
            ]
        }
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

// TODO : integration with jest and travis
