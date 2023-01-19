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
        console.log(raw.split('(')[0].split(' '));
        const functionName = raw.split('(')[0].split(' ')[1];

        console.log(functionName);

        return new FunctionDefinition(functionName, []);
    }
}
