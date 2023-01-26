import { FunctionDefinition } from '../models/function-definition';
import { FunctionParam } from '../models/function-param';
import {
    ParamConverter,
    ParamConverterImpl,
} from '../param-converter/param-converter';
import { Parser, ParserImpl } from '../parser/parser';

describe('Parser and Converter Integration', () => {
    let parser: Parser;
    let converter: ParamConverter;

    beforeEach(() => {
        parser = new ParserImpl();
        converter = new ParamConverterImpl();
    });

    it('Parses a function and converts it from named to positional', () => {
        const rawFunction =
            'void foo({required param1, required int param2, param3 = "Foo", param4 = "Foo"}) {}';

        const parsedFunction = parser.parseFunction(rawFunction);

        expect(parsedFunction).toEqual(
            new FunctionDefinition('foo', [
                new FunctionParam('param1', undefined, undefined),
                new FunctionParam('param2', 'int', undefined),
                new FunctionParam('param3', undefined, '"Foo"'),
                new FunctionParam('param4', undefined, '"Foo"'),
            ])
        );

        expect(converter.toPositionalParams(parsedFunction.params)).toBe(
            'param1, int param2, [param3 = "Foo", param4 = "Foo"]'
        );
    });

    it('Parses a function and converts it from positional to named', () => {
        const rawFunction =
            'void foo(param1, int param2, [param3 = "Foo", param4 = "Foo"]) {}';

        const parsedFunction = parser.parseFunction(rawFunction);

        expect(parsedFunction).toEqual(
            new FunctionDefinition('foo', [
                new FunctionParam('param1', undefined, undefined),
                new FunctionParam('param2', 'int', undefined),
                new FunctionParam('param3', undefined, '"Foo"'),
                new FunctionParam('param4', undefined, '"Foo"'),
            ])
        );

        expect(converter.toNamedParams(parsedFunction.params)).toBe(
            '{required param1, required int param2, param3 = "Foo", param4 = "Foo"}'
        );
    });
});
