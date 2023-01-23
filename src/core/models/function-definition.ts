import { FunctionParam } from './function-param';

/**
 * Contains the name of a function and its parameters' names and types.
 */
export class FunctionDefinition {
    constructor(public functionName: string, public params: FunctionParam[]) {}
}
