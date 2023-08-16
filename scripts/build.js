// 进行打包 monerepo

const fs = require('fs');
const path = require('path');
const execa = require('execa');
// 读取打包目录并过滤不需要打包的文件
const dirs = fs.readdirSync(path.resolve(__dirname, '../packages')).filter(dir => {
    return fs.statSync(path.resolve(__dirname, `../packages/${dir}`)).isDirectory()
})

// 进行打包， 并发打包
runParaller(dirs, build).then(() => {
    console.log('成功打包')
})

// 打包方法
async function build(target) {
    // 注意execa -c 执行rollup配置， 环境变量 -env 子进程在父包中输出
    await execa('rollup', ['-c', "--environment", `TARGET:${target}`], {stdio: 'inherit'})
}

async function runParaller(dirs, fn) {
    // 遍历
    const result = []
    for (const item of dirs) {
        result.push(fn(item))
    }
    return Promise.all(result)
}