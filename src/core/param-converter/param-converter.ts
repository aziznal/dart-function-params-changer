import { FunctionParam } from '../models/function-param';

export abstract class ParamConverter {
    abstract toNamedParams(params: FunctionParam[]): string;

    abstract toPositionalParams(params: FunctionParam[]): string;
}

export class ParamConverterImpl implements ParamConverter {
    toNamedParams(params: FunctionParam[]): string {
        const parsedParams = this.#parseAsNamedParams(params);

        return `{${parsedParams}}`;
    }

    toPositionalParams(params: FunctionParam[]): string {
        const isOptional = (param: FunctionParam) =>
            param.defaultValue !== undefined;

        const parsedOptionalParams = this.#parseAsOptionalParams(
            params.filter(isOptional)
        );

        const parsedPositionalParams = this.#parseAsPositionalParams(
            params.filter((param) => !isOptional(param))
        );

        if (parsedPositionalParams) {
            if (parsedOptionalParams) {
                return `${parsedPositionalParams}, [${parsedOptionalParams}]`;
            }

            return `${parsedPositionalParams}`;
        }

        if (parsedOptionalParams) {
            if (parsedPositionalParams) {
                return `${parsedPositionalParams}, [${parsedOptionalParams}]`;
            }

            return `[${parsedOptionalParams}]`;
        }

        return '';
    }

    /**
     * Returns a string of optional params. Square brackets **[NOT]** included.
     */
    #parseAsOptionalParams(params: FunctionParam[]): string {
        return params
            .map((param) => `${param.name} = ${param.defaultValue}`)
            .join(', ');
    }

    /**
     * Returns a string of positional params
     */
    #parseAsPositionalParams(params: FunctionParam[]): string {
        return params
            .map((param) => {
                if (!param.type) {
                    return `${param.name}`;
                }

                return `${param.type} ${param.name}`;
            })
            .join(', ');
    }

    /**
     * Returns a string of named params. Curly braces **{NOT}** included
     */
    #parseAsNamedParams(params: FunctionParam[]): string {
        return params
            .map((param) => {
                if (param.defaultValue) {
                    return `${param.name} = ${param.defaultValue}`;
                }

                if (param.type) {
                    return `required ${param.type} ${param.name}`;
                }

                return `required ${param.name}`;
            })
            .join(', ');
    }
}
