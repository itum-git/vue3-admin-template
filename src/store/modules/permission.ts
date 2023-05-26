import { ActionTree, MutationTree, Module } from 'vuex'

export interface PermissionState {
    permissions: string[];
    routes: AppRouteRecordRaw[],
}

const state: PermissionState = {
    permissions: [], // 权限数组，一般为字符串数组
    routes: [], // 通过权限筛选的所有路由 
}

const mutations: MutationTree<PermissionState> = {
    SET_PERMISSIONS: (state, permissions) => {
        state.permissions = permissions || []
    },
    SET_ROUTES: (state: PermissionState, routes: []) => {
        state.routes = routes
    },
}

const actions: ActionTree<PermissionState, any> = {
    setPermissions({ commit }, permissions) {
        commit('SET_PERMISSIONS', permissions)
    },
    setRoutes({ commit }, routes: []) {
        commit('SET_ROUTES', routes)
    },
}

const store: Module<PermissionState, any> = {
    namespaced: true,
    state,
    mutations,
    actions,
};

export default store