import { FunctionParam } from './function-param';

export class FunctionDefinition {
    constructor(public functionName: string, public params: FunctionParam[]) {}
}
