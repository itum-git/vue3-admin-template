import { useStore } from '@/store';
import { isArray } from '@/utils/is';

// 路由顺序
const ROUTE_ORDER = ['/permission-manage']

const store = useStore();

function loadModuleRoutes() {
    const modules: Record<
        string,
        {
            [key: string]: any;
        }
    > = import.meta.glob('./modules/*.ts', { eager: true });

    const routes = [] as AppRouteRecordRaw[];

    let errorRoute, indexRoutes

    Object.keys(modules).forEach((key) => {
        // 跳过 error 路由
        if (/\/modules\/error.ts/.test(key)) {
            errorRoute = modules[key].default
            return
        }
        // 跳过 index 路由
        if (/\/modules\/index.ts/.test(key)) {
            indexRoutes = modules[key].default
            return
        }

        routes.push(modules[key].default);
    });

    // 给路由排序，此处会影响菜单的显示顺序
    sortRoutes(routes)

    // error 路由加入到最后
    errorRoute && routes.push(errorRoute);

    return [routes, indexRoutes];
}

/**
 * 获取远程路由元数据
 * @returns 远程路由
 */
async function fetchRemoteRoute() {
    return [];
}

/**
 * 路由自动装配
 * @param router 路由实例
 */
async function loadRoutes(router) {
    const remoteFlag = !!store.state.user.token;
    // eslint-disable-next-line prefer-const
    let [routes, indexRoutes] = loadModuleRoutes();

    if (remoteFlag) {
        const remoteRoutes = await fetchRemoteRoute();
        routes = [...routes, ...remoteRoutes];
    }
    // 按照权限过滤路由
    routes = routes.map((route) => {
        route.children = filterNestedChildren(route.children!);
        return route;
    });

    // 设置通过权限筛选的路由 + index 路由
    store.dispatch('permission/setRoutes', [...indexRoutes, ...routes])

    // index 路由已经在 router 中，无需重新加入
    routes.forEach((r: AppRouteRecordRaw) => router.addRoute(r));
}

/**
 * 收集嵌套路由元信息并组装
 * @param children 嵌套的子路由
 * @returns 路由元信息
 */
function filterNestedChildren(children: AppRouteRecordRaw[]) {
    const permissions = store.state.permission.permissions;
    if (permissions.length === 0) return children;

    return children.filter((r) => {
        const permission = r.meta?.permission

        if (r.children) {
            r.children = filterNestedChildren(r.children)
        }

        return permission && isArray(permissions) && permissions.length > 0
            ? permissions.includes(permission)
            : true;
    });
}

function sortRoutes(routes) {
    routes.sort((a, b) => ROUTE_ORDER.indexOf(a.path) - ROUTE_ORDER.indexOf(b.path))
}

export default { loadRoutes };
