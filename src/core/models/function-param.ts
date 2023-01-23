/**
 * Stores the name of a function parameter and optionally its type and default value
 */
export class FunctionParam {
    constructor(
        public name: string,
        public type?: string,
        public defaultValue?: string
    ) {}
}
