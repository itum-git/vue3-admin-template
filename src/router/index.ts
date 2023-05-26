import { createRouter, createWebHashHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import type { App } from 'vue';
import constantRoutes from './modules';
import helper from './helper'
import guard from './guard'

const router = createRouter({
    history: createWebHashHistory(),
    strict: true,
    routes: constantRoutes as RouteRecordRaw[],
    scrollBehavior: () => ({ left: 0, top: 0 }),
});

export const resetRouter = (): void => {
    const resetWhiteNameList = ['Redirect', 'Login', 'NoFind', 'Root'];
    router.getRoutes().forEach((route) => {
        const { name } = route;
        if (name && !resetWhiteNameList.includes(name as string)) {
            router.hasRoute(name) && router.removeRoute(name);
        }
    });
};

export const setupRouter = (app: App<Element>) => {
    guard.use(router)
    app.use(router)
};

export const loadRoutes = () => helper.loadRoutes(router)

export const useRouter = () => router

export default router;
