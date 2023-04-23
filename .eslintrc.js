module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: './tsconfig.json',
    },
    plugins: ['@typescript-eslint', 'prettier'],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:import/recommended',
        'airbnb-typescript/base', // 启用 prettier 要是有报错，可尝试关闭airbnb
        'prettier',
    ],
    rules: {
        // '@typescript-eslint/no-var-requires':0
        'prettier/prettier': 'error',
    },
};
