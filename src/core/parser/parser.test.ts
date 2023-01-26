import { FunctionDefinition } from '../models/function-definition';
import { FunctionParam } from '../models/function-param';
import { Parser, ParserImpl } from './parser';

describe('Parser', () => {
    let parser: Parser;

    beforeEach(() => {
        parser = new ParserImpl();
    });

    // NOTE: this test is sensitive to tabs and spaces
    it('Parses a basic function definition', () => {
        // most basic form
        expect(parser.parseFunction(`foo() {}`)).toEqual(
            new FunctionDefinition('foo', [])
        );

        // with return type
        expect(parser.parseFunction(`void foo() {}`)).toEqual(
            new FunctionDefinition('foo', [])
        );

        // with number in name
        expect(parser.parseFunction(`foo1() {}`)).toEqual(
            new FunctionDefinition('foo1', [])
        );

        // with more complex return type
        expect(parser.parseFunction(`Future<void> foo1() {}`)).toEqual(
            new FunctionDefinition('foo1', [])
        );

        // with long name
        expect(
            parser.parseFunction(`Future<void> functionWithALongName() {}`)
        ).toEqual(new FunctionDefinition('functionWithALongName', []));

        // multiline with tabs
        expect(
            parser.parseFunction(
                `Future<void> foo(

                ) {}`
            )
        ).toEqual(new FunctionDefinition('foo', []));

        // multiline with tabs in weird place
        expect(
            parser.parseFunction(
                `void foo   (   

                ) {}`
            )
        ).toEqual(new FunctionDefinition('foo', []));
    });

    it('Throws an error when no function could be parsed', () => {
        expect(() => parser.parseFunction('')).toThrowError();

        expect(() => parser.parseFunction('void')).toThrowError();

        expect(() => parser.parseFunction('foo')).toThrowError();

        expect(() => parser.parseFunction('foo {}')).toThrowError();

        expect(() => parser.parseFunction('()')).toThrowError();

        expect(() => parser.parseFunction('() {}')).toThrowError();

        expect(() => parser.parseFunction('   () {}')).toThrowError();
    });

    it("Parses a function's positional params", () => {
        // no params
        expect(parser.parseFunction('foo() {}')).toEqual(
            new FunctionDefinition('foo', [])
        );

        // with one non-typed param
        expect(parser.parseFunction('foo(param1) {}')).toEqual(
            new FunctionDefinition('foo', [new FunctionParam('param1')])
        );

        // with one typed param
        expect(parser.parseFunction('foo(int param1) {}')).toEqual(
            new FunctionDefinition('foo', [new FunctionParam('param1', 'int')])
        );

        // with two basic params
        expect(parser.parseFunction('foo(int param1, int param2) {}')).toEqual(
            new FunctionDefinition('foo', [
                new FunctionParam('param1', 'int'),
                new FunctionParam('param2', 'int'),
            ])
        );

        // with two basic params and a trailing comma
        expect(parser.parseFunction('foo(int param1, int param2,) {}')).toEqual(
            new FunctionDefinition('foo', [
                new FunctionParam('param1', 'int'),
                new FunctionParam('param2', 'int'),
            ])
        );

        // with three basic params
        expect(
            parser.parseFunction('foo(int param1, int param2, int param3) {}')
        ).toEqual(
            new FunctionDefinition('foo', [
                new FunctionParam('param1', 'int'),
                new FunctionParam('param2', 'int'),
                new FunctionParam('param3', 'int'),
            ])
        );

        // with three params of different types
        expect(
            parser.parseFunction(
                'foo(string param1, bool param2, int param3) {}'
            )
        ).toEqual(
            new FunctionDefinition('foo', [
                new FunctionParam('param1', 'string'),
                new FunctionParam('param2', 'bool'),
                new FunctionParam('param3', 'int'),
            ])
        );

        // with three params of different types, badly formatted
        expect(
            parser.parseFunction(
                'foo (          string           param1,              bool param2,     int param3         )     {}'
            )
        ).toEqual(
            new FunctionDefinition('foo', [
                new FunctionParam('param1', 'string'),
                new FunctionParam('param2', 'bool'),
                new FunctionParam('param3', 'int'),
            ])
        );

        // with one optional param
        expect(
            parser.parseFunction('foo(int param1, int param2, [int foo=1]) {}')
        ).toEqual(
            new FunctionDefinition('foo', [
                new FunctionParam('param1', 'int'),
                new FunctionParam('param2', 'int'),
                new FunctionParam('foo', 'int', '1'),
            ])
        );

        // with multiple optional params
        expect(
            parser.parseFunction(
                'foo(int param1, int param2, [int foo=1, string foo2="2"]) {}'
            )
        ).toEqual(
            new FunctionDefinition('foo', [
                new FunctionParam('param1', 'int'),
                new FunctionParam('param2', 'int'),
                new FunctionParam('foo', 'int', '1'),
                new FunctionParam('foo2', 'string', '"2"'),
            ])
        );

        // with optional params without a default value and without a type
        expect(
            parser.parseFunction('foo(int param1, int param2, [foo]) {}')
        ).toEqual(
            new FunctionDefinition('foo', [
                new FunctionParam('param1', 'int'),
                new FunctionParam('param2', 'int'),
                new FunctionParam('foo'),
            ])
        );

        // with optional params with a default value but without a type
        expect(
            parser.parseFunction(
                'foo(int param1, int param2, [foo=1, foo2="2"]) {}'
            )
        ).toEqual(
            new FunctionDefinition('foo', [
                new FunctionParam('param1', 'int'),
                new FunctionParam('param2', 'int'),
                new FunctionParam('foo', undefined, '1'),
                new FunctionParam('foo2', undefined, '"2"'),
            ])
        );
    });

    // prettier-ignore
    it("Parses a function's named params", () => {
        // with one param
        expect(parser.parseFunction('foo({param1}) {}')).toEqual(
            new FunctionDefinition(
                'foo',
                [
                    new FunctionParam('param1')
                ]
            )
        );

        // with one typed param
        expect(parser.parseFunction('foo({int param1}) {}')).toEqual(
            new FunctionDefinition(
                'foo',
                [
                    new FunctionParam('param1', 'int')
                ]
            )
        );

        // with two params
        expect(parser.parseFunction('foo({int param1, string param2}) {}')).toEqual(
            new FunctionDefinition(
                'foo',
                [
                    new FunctionParam('param1', 'int'),
                    new FunctionParam('param2', 'string'),
                ]
            )
        );

        // with two params and a trailing comma
        expect(parser.parseFunction('foo({int param1, string param2,}) {}')).toEqual(
            new FunctionDefinition(
                'foo',
                [
                    new FunctionParam('param1', 'int'),
                    new FunctionParam('param2', 'string'),
                ]
            )
        );

        // with two params prefixed by 'required' keyword
        expect(parser.parseFunction('foo({required int param1, required string param2,}) {}')).toEqual(
            new FunctionDefinition(
                'foo',
                [
                    new FunctionParam('param1', 'int'),
                    new FunctionParam('param2', 'string'),
                ]
            )
        );

        // with two params with default values (with types)
        expect(parser.parseFunction('foo({int param1=3, string param2="3",}) {}')).toEqual(
            new FunctionDefinition(
                'foo',
                [
                    new FunctionParam('param1', 'int', "3"),
                    new FunctionParam('param2', 'string', '"3"'),
                ]
            )
        );

        // with two params with default values (without types)
        expect(parser.parseFunction('foo({param1=3, param2="3",}) {}')).toEqual(
            new FunctionDefinition(
                'foo',
                [
                    new FunctionParam('param1', undefined, "3"),
                    new FunctionParam('param2', undefined, '"3"'),
                ]
            )
        );

        // with two params with default values (without types) and spaces before and after equals sign
        expect(parser.parseFunction('foo({param1 = 3, param2 = "3",}) {}')).toEqual(
            new FunctionDefinition(
                'foo',
                [
                    new FunctionParam('param1', undefined, "3"),
                    new FunctionParam('param2', undefined, '"3"'),
                ]
            )
        );
    });
});
