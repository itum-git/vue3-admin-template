import type { App, InjectionKey } from 'vue';
import { createStore, Store, useStore as baseUseStore, ModuleTree } from 'vuex';
import { RootState, CommonStore } from './type';

const modules_default: Record<string, { default: object}> = import.meta.glob('./modules/*.ts', { eager: true })

const getModules = ():ModuleTree<RootState> => {
    const obj = {};
    Object.keys(modules_default).forEach((key: string) => {
        const matches = key.match(/.\/modules\/(.*).ts/) || [];
        obj[matches[1]] = modules_default[key].default;
    });
    return obj;
}

export const modules = getModules()

const store: Store<RootState> = createStore<RootState>({
    modules,
    state: {}, // 全局

    mutations: { }, // 全局

    actions: { }, // 全局

    getters: { } // 全局
}) as CommonStore

const key: InjectionKey<Store<RootState>> = Symbol()

export function setupStore(app: App<Element>) {
    app.use(store)
}

export function useStore (): CommonStore {
    return baseUseStore(key) as CommonStore || store
}

export default store;
