import { FunctionDefinition } from '../models/function-definition';
import { FunctionParam } from '../models/function-param';

import '../../extensions/string-extensions';

/**
 * Parses given raw string to extract a function definition
 */
export abstract class Parser {
    abstract parseFunction(raw: string): FunctionDefinition;
}

export class ParserImpl implements Parser {
    parseFunction(raw: string): FunctionDefinition {
        const regex =
            /(?<functionName>\w+)\t*[ ]*\([ ]*[\r\n]?\t*[ ]*(?<functionParams>.*)[\r\n]?.*\)/;

        const extracted = raw.match(regex);

        if (extracted === null) {
            throw Error('could not parse function');
        }

        const [_, functionName, rawFunctionParams] = extracted;

        const parsedParams = this.#parseParams(rawFunctionParams);

        return new FunctionDefinition(functionName, parsedParams);
    }

    /**
     * Finds type of params and returns a parsed param array.
     *
     * For optional params, It's assumed that it's always a mix of positional
     * and optional params. They are parsed by first parsing the positional
     * params, then the optional params, then combining the two arrays.
     */
    #parseParams(rawParams: string): FunctionParam[] {
        const paramsType = this.#detectParamsType(rawParams);

        if (paramsType === 'positional') {
            return this.#parsePositionalParams(rawParams);
        }

        if (paramsType === 'positional-with-optional') {
            return this.#parsePositionalParams(rawParams).concat(
                this.#parseOptionalParams(rawParams)
            );
        }

        return this.#parseNamedParams(rawParams);
    }

    /**
     * Detects type of params from given string.
     *
     * - **named** params always include left and right curly braces `{}`
     * - **positional** params can mixed together with **optional** params,
     *   which always include left and right square brackets `[]`
     */
    #detectParamsType(
        rawParams: string
    ): 'positional' | 'positional-with-optional' | 'named' {
        if (rawParams.includes('{')) {
            return 'named';
        }

        if (rawParams.includes('[')) {
            return 'positional-with-optional';
        }

        return 'positional';
    }

    #parsePositionalParams(rawParams: string): FunctionParam[] {
        if (rawParams.length === 0) {
            return [];
        }

        return rawParams
            .replace(/\[.*/g, '') // remove any optional params
            .trim()
            .removeMultipleWhitespaces()
            .split(',')
            .filter((param) => param.length > 0) // to account for trailing commas
            .map((param) => param.trim())
            .map((param) => param.split(' '))
            .map(
                (splitParam) => new FunctionParam(splitParam[1], splitParam[0])
            );
    }

    #parseOptionalParams(rawParams: string): FunctionParam[] {
        if (rawParams.length === 0) {
            return [];
        }

        return rawParams
            .replace(/.*\[/g, '') // remove everything before the optional params
            .replace(/\]/g, '')
            .trim()
            .removeMultipleWhitespaces()
            .split(',')
            .filter((param) => param.length > 0) // to account for trailing commas
            .map((param) => param.trim())
            .map((param) => param.split(' ')) // get type-name pairs
            .map((typeNamePair) => {
                // if no type given
                if (typeNamePair.length === 1) {
                    return new FunctionParam(
                        typeNamePair[0].split('=')[0],
                        undefined,
                        typeNamePair[0].split('=')[1]
                    );
                }

                return new FunctionParam(
                    typeNamePair[1].split('=')[0],
                    typeNamePair[0],
                    typeNamePair[1].split('=')[1]
                );
            });
    }

    #parseNamedParams(rawParams: string): FunctionParam[] {
        if (rawParams.length === 0) {
            return [];
        }

        return rawParams
            .replace(/{|}/g, '') // remove curly braces
            .replace(/required /g, '')
            .trim()
            .removeMultipleWhitespaces()
            .split(',')
            .filter((param) => param.length > 0) // to account for trailing commas
            .map((param) => param.trim())
            .map((param) => param.split(' '))
            .map((typeNamePair) => {
                // if no type given
                if (typeNamePair.length === 1) {
                    return new FunctionParam(
                        typeNamePair[0].split('=')[0],
                        undefined,
                        typeNamePair[0].split('=')[1]
                    );
                }

                return new FunctionParam(
                    typeNamePair[1].split('=')[0],
                    typeNamePair[0],
                    typeNamePair[1].split('=')[1]
                );
            });
    }
}
