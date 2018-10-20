// @flow

export default class RegExpMatcher {

    _input: string;
    _lastMatches: ?string[];

    constructor(input: string) {
        this._input = input;
        this._lastMatches = null;
    }

    input(): string {
        return this._input;
    }

    length(): number {
        return this._input.length;
    }

    match(regexp: RegExp): boolean {
        this._lastMatches = regexp.exec(this._input);
        return this._lastMatches !== null;
    }

    group(index: number): ?string {
        return this._lastMatches ? this._lastMatches[index] : null;
    }

    replace(regexp: RegExp, replacement: string): RegExpMatcher {
        this._input = this._input.replace(regexp, replacement);
        return this;
    }

    trim(): RegExpMatcher {
        this._input = this._input.trim();
        return this;
    }
}
