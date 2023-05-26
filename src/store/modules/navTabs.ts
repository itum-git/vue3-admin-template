import { ActionTree, MutationTree, GetterTree, Module } from 'vuex';
import type { RouteLocationNormalized } from 'vue-router'
import { RootState } from '../type';
// import { getRawRoute } from '@/utils/routerHelper'
// import router from '@/router'

export interface TabsState {
    aliveViews: RouteLocationNormalized[],
    activeIndex: number,
}

const state: TabsState = {
    aliveViews: [], // tabs 需要缓存的页面路由（长度与顶部标签的数量一致）
    activeIndex: 0, // tabs 中当前处于激活状态的页面路由（用index是因为方便定位tab位置，更改样式）
}

const mutations: MutationTree<TabsState> = {
    ADD_ALIVE: (state: TabsState, view: RouteLocationNormalized) => {
        state.aliveViews.push(view)
    },
    DEL_ALIVE: (state: TabsState, index: number) => {
        state.aliveViews.splice(index, 1)
    },
    SET_ACTIVE: (state: TabsState, index: number) => {
        state.activeIndex = index
    },
}

const actions: ActionTree<TabsState, any> = {
    // 新增tag 暂定，后续需要解决同一个 view 多个 tab 的问题
    addAliveViews({ state, commit }, view: RouteLocationNormalized) {
        
        if (state.aliveViews.some((v) => v.fullPath === view.fullPath)) return
        
        if (view.meta?.noTagsView) return

        commit('ADD_ALIVE', Object.assign({}, view, {
            title: view.meta?.title || 'no-name'
        }))
    },
    delAliveViews({ state, commit }, view: RouteLocationNormalized) {
        const  idx = state.aliveViews.findIndex((v) => v.fullPath === view.fullPath)

        commit('DEL_ALIVE', idx)
    },
    setActiveView({ state, commit }, view) {
        const  idx = state.aliveViews.findIndex((v) => v.fullPath === view.fullPath)

        commit('SET_ACTIVE', idx)
    },
};

const getters: GetterTree<TabsState, RootState> = {
    getAliveViewss: (state) => Array.from(state.aliveViews)
}

const store: Module<TabsState, RootState> = {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
};

export default store