import { Parser, ParserImpl, FunctionDefinition } from './parser';

describe('Parser', () => {
    let parser: Parser;

    beforeEach(() => {
        parser = new ParserImpl();
    });

    // NOTE: this test is sensitive to tabs and spaces
    it('Parses a basic function definition', () => {
        expect(parser.parseFunctionFromRaw(`void foo() {}`)).toEqual(
            new FunctionDefinition('foo', [])
        );

        expect(parser.parseFunctionFromRaw(`foo() {}`)).toEqual(
            new FunctionDefinition('foo', [])
        );

        expect(parser.parseFunctionFromRaw(`foo1() {}`)).toEqual(
            new FunctionDefinition('foo1', [])
        );

        expect(parser.parseFunctionFromRaw(`Future<void> foo1() {}`)).toEqual(
            new FunctionDefinition('foo1', [])
        );

        expect(
            parser.parseFunctionFromRaw(
                `Future<void> functionWithALongName() {}`
            )
        ).toEqual(new FunctionDefinition('functionWithALongName', []));

        expect(
            parser.parseFunctionFromRaw(
                `Future<void> foo(

                ) {}`
            )
        ).toEqual(new FunctionDefinition('foo', []));

        expect(
            parser.parseFunctionFromRaw(
                `void foo   (   

                ) {}`
            )
        ).toEqual(new FunctionDefinition('foo', []));
    });
});
