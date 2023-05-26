import { ActionTree, MutationTree, Module, GetterTree } from 'vuex';
import { ElMessage } from 'element-plus';
import { RootState } from '../type';

type AppView = {
    width: number,
    height: number
}

export interface AppState {
    title: string;
    layout: string;
    size: 'default' | 'small' | 'large';
    appView: AppView,
    collapse: boolean;
    asideFix: boolean;
    mobile: boolean;
    tagsView: boolean;
    dynamicRouter: boolean;
}

const state: AppState = {
    title: 'Vue3AdminTemplate', // 标题<title></title>
    layout: 'classic', // 整体布局layout
    size: 'default', // element plus 组件全局默认 size
    appView: { // <AppView> 组件的宽高，即主要内容区域
        width: 0,
        height: 0
    },
    collapse: false, // 菜单折叠状态
    asideFix: false, // 侧边菜单栏是否固定，脱离布局，折叠时没有宽度，默认在 window width < 1200px 时开启
    mobile: false, // 是否是移动端
    tagsView: true, // 是否采用多页签
    dynamicRouter: false, // 是否动态路由
};

const mutations: MutationTree<AppState> = {
    SET_TITLE: (state: AppState, title: string) => {
        state.title = title;
    },
    SET_LAYOUT: (state: AppState, layout: string) => {
        state.layout = layout;
    },
    SET_COLLAPSE(state: AppState, collapse: boolean) {
        state.collapse = collapse;
    },
    SET_ASIDE_FIX(state: AppState, fixed: boolean) {
        state.asideFix = fixed
    },
    SET_MOBILE(state: AppState, mobile: boolean) {
        state.mobile = mobile
    },
    SET_APPVIEW(state: AppState, { width, height }) {
        if (typeof width === 'number') state.appView.width = width
        if (typeof height === 'number') state.appView.height = height
    }
};

const actions: ActionTree<AppState, any> = {
    setAppTitle({ commit }, title: string) {
        commit('SET_TITLE', title);
    },
    setLayout({ commit, state }, layout: string) {
        if (state.mobile && layout !== 'classic') {
            ElMessage.warning('移动端模式下不支持切换其他布局');
            return;
        }
        commit('SET_LAYOUT', layout);
    },
    setCollapse({ commit }, collapse: boolean) {
        commit('SET_COLLAPSE', collapse);
    },
    setAsideFix({ commit }, fixed: boolean) {
        commit('SET_ASIDE_FIX', fixed);
    },
    setMobile({ commit }, mobile: boolean) {
        commit('SET_MOBILE', mobile)
    },
    setAppView({ commit }, appView: AppView) {
        commit('SET_APPVIEW', appView)
    }
};

const getters: GetterTree<AppState, RootState> = {
    title: (state) => state.title,
    layout: (state) => state.layout,
    collapse: (state) => state.collapse,
    mobile: (state) => state.mobile,
}

const store: Module<AppState, RootState> = {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
};

export default store