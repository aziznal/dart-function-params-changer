import { Parser, ParserImpl, FunctionDefinition } from './parser';
describe('Parser', () => {
    let parser: Parser;

    beforeEach(() => {
        parser = new ParserImpl();
    });

    it('Parses a basic function definition', () => {
        const functionDef = `
        void foo() {
            
        }
        `;

        expect(parser.parseFunctionFromRaw(functionDef)).toBe(
            new FunctionDefinition('foo', [])
        );
    });
});
