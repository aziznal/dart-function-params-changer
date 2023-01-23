interface String {
    /**
     * Replaces multiple whitespace occurences with a single whitespace.
     *
     * Example
     *
     * ```typescript
     * '   white   space    '.removeMultipleWhitespaces()
     * ```
     *
     * reults in `' white space '`
     */
    removeMultipleWhitespaces(): string;
}

String.prototype.removeMultipleWhitespaces = function (this: string) {
    return this.replace(/ +(?= )/g, '');
};
