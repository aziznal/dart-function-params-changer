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
     * results in `' white space '`
     */
    removeMultipleWhitespaces(): string;

    /**
     * Removes empty spaces before and after an equals sign
     */
    trimEqualsSignSpacing(): string;
}

String.prototype.removeMultipleWhitespaces = function (this: string) {
    return this.replace(/ +(?= )/g, '');
};

String.prototype.trimEqualsSignSpacing = function (this: string) {
    return this.replace(' =', '=').replace('= ', '=').replace(' = ', '=');
};
