import type { Config } from 'jest';

const config: Config = {
    verbose: true,
    modulePathIgnorePatterns: [
        'test/suite', // leave this one to vscode
    ],
    preset: 'ts-jest',
    testEnvironment: 'node',
};

export default config;
