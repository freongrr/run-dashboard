[![Build Status](https://travis-ci.org/freongrr/run-dashboard.svg)](https://travis-ci.org/freongrr/run-dashboard) [![Coverage Status](https://coveralls.io/repos/github/freongrr/run-dashboard/badge.svg)](https://coveralls.io/github/freongrr/run-dashboard)

An other experiment with React, using my running data, and maybe graphs.

Running
=======

Build the WAR file:

    mvn clean deploy

Debug using Spring Boot in your IDE, or with Maven:

    mvn clean spring-boot:run -DdatabaseUrl=jdbc:sqlite:file:///path/to/run.sqlite3

Watch for changes in the JS code and static resources:

    npm run start

Links
=====

(TODO : update)

* Assembled with Webpack: https://webpack.js.org/
* Static typing with Flow: https://flow.org/
* Front-end with React: https://facebook.github.io/react/
* Bootstrap implementation for React: http://react-bootstrap.github.io/
* Routing with React Router: https://github.com/ReactTraining/react-router/
* Charts with C3.js: http://c3js.org/
* Linting with ESLint for React: https://github.com/yannickcr/eslint-plugin-react
* Unit test and coverage with Jest: https://facebook.github.io/jest/
* React tests with Enzyme: http://airbnb.io/enzyme/docs/api/shallow.html
