
### 开始

项目包管理工具推荐使用 `yarn`

项目依赖安装
```ts
yarn install
npm install
```
项目开发环境启动
```ts
yarn dev
npm run dev
```
项目开发环境启动，开启本地 mock
```ts
yarn dev:mock
npm run dev:mock
```
项目开发环境打包
```ts
yarn build:dev
npm run build:dev
```
项目生产环境打包
```ts
yarn build:pro
npm run build:pro
```

加入其他环境启动、打包方式注意 `vite.config.js` 关于 env 的配置，以免报错

### 主要依赖库
- `vue: ^3.2.36`
- `typescript: ^4.7.2`
- `vite: 4.0.4`
- `element-plus: ^2.2.13`
- `vuex: ^4.1.0`，没有使用 `pinia`，`pinia` 文档少，社区目前不够活跃，与其它插件兼容性较差

### 关于样式
全局 css 都在 `@/styles` 文件中，其中大部分都是全局变量
- `styles/index.scss` 自定义样式入口
- `styles/vars.scss` 所有的全局自定义变量
- `styles/element/index.scss` element-plus 样式引入，正常模式变量覆盖
- `styles/element/dark.scss` element-plus 暗黑样式引入，暗黑模式变量覆盖

所有组件样式都采用 `unocss` 原子化 css，所有组件标签都用 class 属性配置样式，特殊的配置请使用全局变量，如 `padding: 10px`，`width: 50px`，`color: #efefef` 等
    
uno 官网 https://uno.antfu.me/ 可快速查找对应样式的 className

#### element plus 问题

`<el-input/>` 组件开启 `clearable` 属性时，组件宽度会因为 hover/active 而改变，因此加入了 `is-col` 属性，使用网格布局避免此问题

### 关于图标（icon）
icon 使用第三方库
- `@iconify/iconify` Iconify 核心库，可以访问 80 多个流行的开源图标集
- `@iconify/json` Iconify 所有图标集
- `vite-plugin-purge-icons` 提取使用的图标名称，然后将图标的数据 (SVG) 捆绑到代码中
- `vite-plugin-svg-icons` 自动生成本地文件或者指定图标库中的 icon html 内容

element-plus 图标不适合动态使用，所以未使用官方推荐的自动导入方案。参考：https://juejin.cn/post/7169485227188813860 最后的进阶方案

如果使用 `assets/svgs` 中的图标，可以直接配置 `name` 属性为 { 前缀 `svg-icon` + 图标文件名 `logo` }，例： `<Icon name="svg-icon:logo"/>`；
`icon-[name]`，读取svgs文件下的`[name].svg`；`icon-[dir]-[name]`，读取svgs/\[dir\]文件下的`[name].svg`；

### 关于状态管理

#### vuex store
- 状态管理跟 vue2 项目区别不大，主要是使用了 useStore() hook
- 本地存储数据也作为状态由 store 管理，对本地存储的修改过程统一都放在了 store `mutations` 中，后续便于同时更新 store 状态和 storage。
- store 未初始化阶段，可以用 `useCache` 直接读取本地数据

#### 关于 Web Storage 会话存储和本地存储

- 使用了 `@vueuse/core` 库，封装代码在 `hooks/useCache` 中
- 使用方法：
    ```ts
    import { useCache } from '@/hooks/useCache';

    // 默认 sessionStorage
    const { cache } = useCache();
    // 使用 localStorage 
    const { cache } = useCache('local'); // 或 'localStorage'
    
    cache.set('Auth-Token', 'aaaa')
    cache.get('Auth-Token')
    ```

### 关于 eslint

配置可见 `.eslintrc.js`

```js
// script
{
    "lint": "eslint --ext .js,.ts,.jsx,.tsx,.vue src/",
    "lint:fix": "eslint --ext .js,.ts,.jsx,.tsx,.vue src/ --fix"
}
```

**eslint 无法自动解析 .vue 文件中的 tsx 语法**
```ts
// 在 .vue 文件中无法使用全局 types，目前采用手动引入，先在文件同级目录 types.ts 中引入全局类型定义，然后 .vue 文件单独引入类型
// types.ts
export type RecordableTSX<T = any, K = string> = Recordable<T, K>
export type ComponentRefTSX<T> = ComponentRef<T>

// Form.vue
import { FormProps, RecordableTSX, ComponentRefTSX } from './types'
```

**同时使用 prettier 和 eslint 问题**

prettier 和 eslint 以及 typescript 之间的格式冲突是极难解决的，除非项目必须使用 prettier 格式化

**如果 eslint 无法解析和格式化 .tsx 文件**

可以在编辑器中将 Language Mode 改成 jsx

### 常见问题

**@vitejs/plugin-vue-jsx**，只有 yarn 可以安装 @vitejs/plugin-vue-jsx

**tsx 中 vuex.useStore() 会返回 undefined**，所以使用全局 `@/store` 中封装的 useStore()






