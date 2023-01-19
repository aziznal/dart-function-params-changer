abstract class ParamConverter {
    abstract convert(fn: string): string;
}

class ParamConverterImpl implements ParamConverter {
    convert(fn: string): string {
        return fn;
    }
}
