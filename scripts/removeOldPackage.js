const fs = require('fs')
const path = require('path')
/**
 * @param { delPath：String } （需要删除文件的地址）
 * @param { direct：Boolean } （是否需要处理地址）
 */
function deleteFile(delPath, direct) {
    delPath = direct ? delPath : path.join(__dirname, delPath)
    try {
        /**
         * @des 判断文件或文件夹是否存在
         */
        if (fs.existsSync(delPath)) {
            fs.unlinkSync(delPath)
        } else {
            console.log('inexistence path：', delPath)
        }
    } catch (error) {
        console.log('del error', error)
    }
}

function deleteFolder(delPath) {
    try {
        if (fs.existsSync(delPath)) {
            const delFn = function (address) {
                const files = fs.readdirSync(address)
                for (let i = 0; i < files.length; i++) {
                    const dirPath = path.join(address, files[i])
                    if (fs.statSync(dirPath).isDirectory()) {
                        delFn(dirPath)
                    } else {
                        deleteFile(dirPath, true)
                    }
                }
                /**
                 * @des 只能删空文件夹
                 */
                fs.rmdirSync(address)
            }
            delFn(delPath)
        } else {
            console.log('do not exist: ', delPath)
        }
    } catch (error) {
        console.log('del folder error', error)
    }
}

deleteFolder(
    path.join(
        process.cwd(),
        'node_modules/react-scripts/node_modules/@typescript-eslint',
    ),
)
