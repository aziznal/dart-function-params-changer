import { FunctionParam } from '../models/function-param';

export abstract class ParamConverter {
    abstract toNamedParams(params: FunctionParam[]): string[];

    abstract toPositionalParams(params: FunctionParam[]): string[];
}

export class ParamConverterImpl implements ParamConverter {
    toNamedParams(params: FunctionParam[]): string[] {
        params;
        return [];
    }

    toPositionalParams(params: FunctionParam[]): string[] {
        return params.map((param) => {
            if (param.defaultValue !== undefined) {
                return `${param.name}=${param.defaultValue}`;
            }

            return `required ${param.type} ${param.name}`;
        });
    }
}
