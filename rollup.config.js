// 通过rollup进行打包

// 先引入相关依赖
import ts from 'rollup-plugin-typescript2' // 解析ts
import json from '@rollup/plugin-json' // 解析json
import resolvePlugin from '@rollup/plugin-node-resolve' // 解析第三方模块
import path from 'path' // 解析路径

// 获取打包的文件路径
let packagesDir = path.resolve(__dirname, 'packages')
// 获取需要打包的包
let packageDir = path.resolve(packagesDir, process.env.TARGET)

// 获取每个包的配置
const reslove = (p) => path.resolve(packageDir, p)
const pkg = require(reslove(`package.json`))
const packageOptions = pkg.buildOptions || {}
// 拿到包名
const name = packageOptions.name || path.basename(packageDir)

// 创建一个映射表
const outputOptions = {
    'esm-bundler': {
        file: reslove(`dist/${name}.esm-bundler.js`),
        format: 'es'
    },
    'cjs': {
        file: reslove(`dist/${name}.cjs.js`),
        format: 'cjs'
    },
    'global': {
        file: reslove(`dist/${name}.global.js`),
        format: 'iife'
    }
}

const options = pkg.buildOptions

function createConfig(format, output) {
    // 进行打包
    output.name = options.name
    output.sourcemap = true
    // 生成rollup配置
    return {
        input: reslove('src/index.ts'),
        output,
        plugins: [
            json(),
            ts({
                tsconfig: path.resolve(__dirname, 'tsconfig.json')
            }),
            resolvePlugin()
        ]
    }
}
export default options.formats.map(format => createConfig(format, outputOptions[format]))
