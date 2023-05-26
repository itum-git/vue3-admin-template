import Layout from '@/layout/layout.vue';

export default {
    path: '/error',
    component: Layout,
    redirect: '/error/404',
    name: 'Error',
    meta: {
        title: '路由错误',
        icon: 'ci:error',
        hidden: true
    },
    children: [
        {
            path: '404',
            component: () => import('@/views/Error/404.vue'),
            name: '404',
            meta: {
                hidden: true,
                title: '404',
            },
        },
        {
            path: '403',
            component: () => import('@/views/Error/403.vue'),
            name: '403',
            meta: {
                hidden: true,
                title: '403',
            },
        },
        {
            path: '500',
            component: () => import('@/views/Error/500.vue'),
            name: '500',
            meta: {
                hidden: true,
                title: '500',
            },
        },
    ],
} as AppRouteRecordRaw;
