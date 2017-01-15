[![Build Status](https://travis-ci.org/freongrr/run-dashboard.svg)](https://travis-ci.org/freongrr/run-dashboard) [![Coverage Status](https://coveralls.io/repos/github/freongrr/run-dashboard/badge.svg)](https://coveralls.io/github/freongrr/run-dashboard)

An other experiment with React, using my running data, and maybe graphs.

Running
=======

Build the WAR file:

    mvn clean deploy

Debug using Jetty:

    mvn clean jetty:run-war -DdatabaseUrl=jdbc:sqlite:file:///path/to/run.sqlite3

Watch for changes in the JS code and static resources:

    npm start

Links
=====

* React: https://facebook.github.io/react/
* React components for bootstrap: http://react-bootstrap.github.io/
* React Router for routing: https://github.com/ReactTraining/react-router/
* ESLint plugin for React: https://github.com/yannickcr/eslint-plugin-react
* Test runner: https://mochajs.org/
* BDD API: http://chaijs.com/api/bdd/
* Test react components: http://airbnb.io/enzyme/docs/api/shallow.html
* Code coverage: https://istanbul.js.org/
