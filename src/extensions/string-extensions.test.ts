import './string-extensions';

describe('String Extensions', () => {
    it('Replaces multiple whitespace occurences with only one whitespace', () => {
        expect('  whitespace  '.removeMultipleWhitespaces()).toBe(
            ' whitespace '
        );

        expect('  '.removeMultipleWhitespaces()).toBe(' ');

        expect(' '.removeMultipleWhitespaces()).toBe(' ');

        expect(''.removeMultipleWhitespaces()).toBe('');

        expect(
            '  w  h  i  t  e  s  p  a  c  e  '.removeMultipleWhitespaces()
        ).toBe(' w h i t e s p a c e ');
    });

    it('Removes spaces before and after an equals sign', () => {
        expect(' = '.trimEqualsSignSpacing()).toBe('=');

        expect('= '.trimEqualsSignSpacing()).toBe('=');

        expect(' ='.trimEqualsSignSpacing()).toBe('=');

        expect('  =  '.trimEqualsSignSpacing()).toBe('=');
    });
});
