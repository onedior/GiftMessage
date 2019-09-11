import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
export default {
    input: 'example/example.js',
    output: {
        file: 'example/example.build.js',
        format: 'iife',
    },
    external: [
        'react',
        'prop-types'
    ],
    plugins: [
        resolve({
            extensions: ['.js', '.jsx']
        }),
        babel({
            exclude: 'node_modules/**'
        })
    ]
}
