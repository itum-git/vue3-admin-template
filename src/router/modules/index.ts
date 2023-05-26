import Layout from '@/layout/layout.vue';

const routes: AppRouteRecordRaw[] = [
    {
        path: '/',
        component: Layout,
        redirect: '/analysis',
        name: '首页',
        meta: {},
        children: [
            {
                path: 'analysis',
                component: () => import('@/views/Dashboard/Analysis.vue'),
                name: 'Analysis',
                meta: {
                    title: '首页',
                    icon: 'ep:platform',
                },
            },
        ],
    },
    {
        path: '/login',
        component: () => import('@/views/Login/Login.vue'),
        name: 'Login',
        meta: {
            hidden: true,
            title: '登录',
            noTagsView: true,
        },
    },
];

export default routes;
