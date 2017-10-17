// @flow

// TODO : improve or find the flow declarations somewhere...

// noinspection ES6ConvertVarToLetConst
declare var jest: any;

declare function describe(name: string, fn: () => void): void;

declare function test(name: string, fn: (done: (?Error) => void) => ?Promise<*>): void;

declare function beforeEach(fn: (done: (?Error) => void) => void): void;

declare function afterEach(fn: (done: (?Error) => void) => void): void;

declare function beforeAll(fn: (done: (?Error) => void) => void): void;

declare function afterAll(fn: (done: (?Error) => void) => void): void;
