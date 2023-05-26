import { createProdMockServer } from 'vite-plugin-mock/es/createProdMockServer'

// "import.meta" is not available in the configured target environment ("es2015") and will be empty，目前还没有修复方案，只能手动引入
// const modules_default: Record<string, { default: object[]}> = import.meta.glob('./modules/*.ts', { eager: true })

// const loadMockModules = () => {
//     const mockMethods = []
//     Object.keys(modules_default).forEach((key) => {
//         mockMethods.push(...modules_default[key].default)
//     })
//     return mockMethods
// }

import user from './modules/user'
import vip from './modules/vip'

const mockMethods = [...user, ...vip]

export function setupProdMockServer() {
    // const mockMethods = loadMockModules()
    createProdMockServer(mockMethods)
}