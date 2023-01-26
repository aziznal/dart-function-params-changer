import { FunctionParam } from '../models/function-param';
import { ParamConverter, ParamConverterImpl } from './param-converter';

// prettier-ignore
describe('Param Converter', () => {
    let paramConverter: ParamConverter;

    beforeEach(() => {
        paramConverter = new ParamConverterImpl();
    });

    it('Converts params to positional params', () => {
        // Single param with type
        expect(
            paramConverter.toPositionalParams(
                [
                    new FunctionParam('param1', 'int'),
                ]
            ),
        ).toEqual(
            'int param1'
        );
        
        // Two params with type
        expect(
            paramConverter.toPositionalParams(
                [
                    new FunctionParam('param1', 'int'),
                    new FunctionParam('param2', 'string'),
                ]
            ),
        ).toEqual(
                'int param1, string param2',
        );

        // One param with default value
        expect(
            paramConverter.toPositionalParams(
                [
                    new FunctionParam('param1', undefined, '"foo"'),
                ]
            ),
        ).toEqual(
                '[param1 = "foo"]',
        );

        // Two params with default value
        expect(
            paramConverter.toPositionalParams(
                [
                    new FunctionParam('param1', undefined, '"foo"'),
                    new FunctionParam('param2', undefined, '"bar"'),
                ]
            ),
        ).toEqual(
                '[param1 = "foo", param2 = "bar"]',
        );

        // Mix of required and optional params
        expect(
            paramConverter.toPositionalParams(
                [
                    new FunctionParam('param1', 'string'),
                    new FunctionParam('param2', 'string'),
                    new FunctionParam('param3', undefined, '"Foo"'),
                    new FunctionParam('param4', undefined, '"Foo"'),
                ]
            ),
        ).toEqual(
                'string param1, string param2, [param3 = "Foo", param4 = "Foo"]'
        );

        // One param with no type and no default value (i.e dynamic)
        expect(
            paramConverter.toPositionalParams(
                [
                    new FunctionParam('param1'),
                ]
            ),
        ).toEqual(
                'param1',
        );

        // Mix of param with no type, param with type, param with default value, and param with type and default value
        expect(
            paramConverter.toPositionalParams(
                [
                    new FunctionParam('param1'),
                    new FunctionParam('param2', 'int'),
                    new FunctionParam('param3', undefined, '"Foo"'),
                    new FunctionParam('param4', "string", '"Foo"'),
                ]
            ),
        ).toEqual(
                'param1, int param2, [param3 = "Foo", param4 = "Foo"]',
        );
    });

    it('Converts params to named params', () => {
        // Single param
        expect(
            paramConverter.toNamedParams(
                [
                    new FunctionParam('param1'),
                ]
            ),
        ).toEqual(
            '{required param1}'
        );

        // Single param with type
        expect(
            paramConverter.toNamedParams(
                [
                    new FunctionParam('param1', 'int'),
                ]
            ),
        ).toEqual(
            '{required int param1}'
        );
        
        // // Two params with type
        expect(
            paramConverter.toNamedParams(
                [
                    new FunctionParam('param1', 'int'),
                    new FunctionParam('param2', 'string'),
                ]
            ),
        ).toEqual(
                '{required int param1, required string param2}',
        );

        // // One param with default value
        expect(
            paramConverter.toNamedParams(
                [
                    new FunctionParam('param1', undefined, '"foo"'),
                ]
            ),
        ).toEqual(
                '{param1 = "foo"}',
        );

        // // Two params with default value
        expect(
            paramConverter.toNamedParams(
                [
                    new FunctionParam('param1', undefined, '"foo"'),
                    new FunctionParam('param2', undefined, '"bar"'),
                ]
            ),
        ).toEqual(
                '{param1 = "foo", param2 = "bar"}',
        );

        // // Mix of required and optional params
        expect(
            paramConverter.toNamedParams(
                [
                    new FunctionParam('param1', 'string'),
                    new FunctionParam('param2', 'string'),
                    new FunctionParam('param3', undefined, '"Foo"'),
                    new FunctionParam('param4', undefined, '"Foo"'),
                ]
            ),
        ).toEqual(
                '{required string param1, required string param2, param3 = "Foo", param4 = "Foo"}'
        );

        // // One param with no type and no default value (i.e dynamic)
        expect(
            paramConverter.toNamedParams(
                [
                    new FunctionParam('param1'),
                ]
            ),
        ).toEqual(
                '{required param1}',
        );

        // // Mix of param with no type, param with type, param with default value, and param with type and default value
        expect(
            paramConverter.toNamedParams(
                [
                    new FunctionParam('param1'),
                    new FunctionParam('param2', 'int'),
                    new FunctionParam('param3', undefined, '"Foo"'),
                    new FunctionParam('param4', "string", '"Foo"'),
                ]
            ),
        ).toEqual(
                '{required param1, required int param2, param3 = "Foo", param4 = "Foo"}',
        );
    });
});
