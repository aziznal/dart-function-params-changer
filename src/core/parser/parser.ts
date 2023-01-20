class FunctionParam {
    constructor(
        public name: string,
        public type: string,
        public defaultValue?: string
    ) {}
}

export class FunctionDefinition {
    constructor(
        public functionName: string,

        public params: FunctionParam[]
    ) {}
}

export abstract class Parser {
    abstract parseFunctionFromRaw(raw: string): FunctionDefinition;
}

export class ParserImpl implements Parser {
    parseFunctionFromRaw(raw: string): FunctionDefinition {
        const regex =
            /(?<functionName>\w+)\t*[ ]*\([ ]*[\r\n]?\t*[ ]*(?<functionParams>.*)[\r\n]?.*\)/;

        const extracted = raw.match(regex);

        if (extracted === null) {
            throw Error('could not parse function');
        }

        const [_, functionName, functionParams] = extracted;

        return new FunctionDefinition(functionName, []);
    }
}
