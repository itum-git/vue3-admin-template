import path from 'path'
import type { UserConfig, ConfigEnv } from 'vite'
import { loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueJsx from '@vitejs/plugin-vue-jsx'
import EslintPlugin from 'vite-plugin-eslint'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { visualizer } from 'rollup-plugin-visualizer';
import Unocss from 'unocss/vite'
import {
    presetAttributify,
    presetIcons,
    presetUno,
    transformerDirectives,
    transformerVariantGroup
} from 'unocss'
import PurgeIcons from 'vite-plugin-purge-icons'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { viteMockServe } from 'vite-plugin-mock'

const pathSrc = path.resolve(__dirname, 'src')

export default ({ mode }: ConfigEnv): UserConfig => {

    const isMock = mode === 'base:mock'

    const env = process.env = { ...process.env, ...loadEnv(isMock ? 'base' : mode, process.cwd()) };

    log(mode, env)

    // https://vitejs.dev/config/
    return {
        base: env.VITE_BASE_PATH,
        resolve: {
            alias: {
                '@/': `${pathSrc}/`
            }
        },
        plugins: [
            vue(),
            VueJsx(),
            AutoImport({
                // 自动导入 Vue 相关函数，如：ref, reactive, toRef 等，对 ts tsx 无效
                imports: ['vue'],
                resolvers: [
                    // 自动导入 Element Plus 相关函数，如：ElMessage, ElMessageBox... (带样式)
                    ElementPlusResolver(),
                ],
                eslintrc: {
                    enabled: false, // 只有需要生成 .eslintrc-auto-import.json 文件时为 true，生成之后改为 false
                    filepath: './config/.eslintrc-auto-import.json'
                },
                dts: './config/auto-imports.d.ts'
            }),
            Components({
                // allow auto load markdown components under `./src/components/`
                extensions: ['vue', 'md'],
                // allow auto import and register components used in markdown
                // include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
                resolvers: [
                    // 自动导入 Element Plus 组件
                    ElementPlusResolver({
                        importStyle: false
                    }),
                ],
                dts: 'types/elcomponents.d.ts'
            }),
            PurgeIcons(),
            createSvgIconsPlugin({
                iconDirs: [pathSrc + '/assets/svgs'],
                symbolId: 'icon-[dir]-[name]',
                svgoOptions: true
            }),
            EslintPlugin({
                cache: false,
                include: ['src/**/*.vue', 'src/**/*.ts', 'src/**/*.tsx'] // 检查的文件
            }),

            // https://github.com/antfu/unocss
            // see unocss.config.ts for config
            Unocss({
                presets: [
                    presetUno(),
                    presetAttributify(),
                    presetIcons({
                        scale: 1.2,
                        warn: true
                    })
                ],
                transformers: [transformerDirectives(), transformerVariantGroup()]
            }),
            viteMockServe({
                // default
                mockPath: 'mock',
                localEnabled: isMock,
            }),
            visualizer()
        ],
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: '@use "@/styles/element/index.scss" as *;',
                }
            },
        },
        build: {
            outDir: env.VITE_OUT_DIR,
            rollupOptions: {
                output: {
                    manualChunks(id: any): string {  
                        if (id.includes('node_modules')) {
                            return id
                                .toString()
                                .split('node_modules/')[1]
                                .split('/')[0]
                                .toString();
                        }
                    }
                }
            }
        },
        server: {
            port: 9000,
            // proxy: {
            //     '/api/sworder-server/': {
            //         target: 'http://172.16.0.3:8010/api/sworder-server/',
            //         changeOrigin: true,
            //         // rewrite: path => path.replace(/^\/api/, '')
            //     }
            // },
            // middlewareMode: 'html',
            host: '0.0.0.0'
        },
    }
}


function log(mode, env) {
    console.info('\x1B[36m[mode]：\x1B[0m\x1B[3m\x1B[32m%s\x1B[0m\x1B[0m', mode)
    
    Object.keys(env).forEach(key => {
        if (/^VITE/.test(key) || /^NODE/.test(key)) {
            console.info('\x1B[36m[%s]：\x1B[0m\x1B[32m%s\x1B[0m', key, env[key])
        }
    })
}