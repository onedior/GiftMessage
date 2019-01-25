import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
export default {
    input: 'src/index.js',
    output: {
        file: 'dist/index.js',
        format: 'umd',
        name: 'giftmessage'
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
