// @flow
/* global global */
"use strict";

import {configure} from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({adapter: new Adapter()});

// The Console class in NodeJS does not have a console.debug(...) method
global.console.debug = jest.fn();
