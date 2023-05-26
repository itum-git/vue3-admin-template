import Layout from '@/layout/layout.vue';

export default {
    path: '/permission-manage',
    component: Layout,
    redirect: '/permission-manage/user-manage',
    name: 'PermissionManage',
    meta: {
        title: '权限管理',
        icon: 'fa:group',
    },
    children: [
        {
            path: 'user-manage',
            component: () => import('@/views/PermissionManage/UserManage.vue'),
            name: 'UserManage',
            meta: {
                title: '用户管理',
                icon: 'ant-design:appstore-add-outlined',
                permission: 'user-manage',
                wrapContent: true
            },
        },
        {
            path: 'role-manage',
            component: () => import('@/views/PermissionManage/RoleManage.vue'),
            name: 'RoleManage',
            meta: {
                title: '角色管理',
                icon: 'ant-design:appstore-add-outlined',
                permission: 'role-manage',
                wrapContent: true
            },
        },
    ],
} as AppRouteRecordRaw;
