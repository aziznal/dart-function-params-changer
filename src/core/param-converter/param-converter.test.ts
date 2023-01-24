import { FunctionParam } from '../models/function-param';
import { ParamConverter, ParamConverterImpl } from './param-converter';

// prettier-ignore
describe('Param Converter', () => {
    let paramConverter: ParamConverter;

    beforeEach(() => {
        paramConverter = new ParamConverterImpl();
    });

    it('Converts a function from positional params to named params', () => {
        // Single param with type
        expect(
            paramConverter.toPositionalParams(
                [
                    new FunctionParam('param1', 'int'),
                ]
            ),
        ).toEqual(
            [
                'required int param1'
            ],
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
            [
                'required int param1',
                'required string param2'
            ],
        );

        // One param with default value
        expect(
            paramConverter.toPositionalParams(
                [
                    new FunctionParam('param1', undefined, '"foo"'),
                ]
            ),
        ).toEqual(
            [
                'param1="foo"',
            ],
        );

        // Two params with default value
        expect(
            paramConverter.toPositionalParams(
                [
                    new FunctionParam('param1', undefined, '"foo"'),
                    new FunctionParam('param2', undefined, '42'),
                ]
            ),
        ).toEqual(
            [
                'param1="foo"',
                'param2=42',
            ],
        );

        // Multiple params with types and / or default values
        expect(
            paramConverter.toPositionalParams(
                [
                    new FunctionParam('param1', undefined, '"foo"'),
                    new FunctionParam('param2', undefined, '42'),
                    new FunctionParam('param3', 'int', '123'),
                    new FunctionParam('param4', 'int'),
                ]
            ),
        ).toEqual(
            [
                'param1="foo"',
                'param2=42',
                'param3=123',
                'required int param4',
            ],
        );
    });
});
