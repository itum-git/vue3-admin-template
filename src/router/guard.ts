import NProgress from 'nprogress';
import { RouteLocationNormalized, Router } from 'vue-router';
import { ElMessageBox } from 'element-plus'
import { useStore } from '@/store';
import helper from './helper';

// const NProgress = useNProgress()
const store = useStore();

const userStore = store.state.user
const permissionStore = store.state.permission

class Guard {
    constructor(private router) {
        this.router = router
    }

    public run() {
        this.router.beforeEach(this.beforeEach.bind(this));
        this.router.afterEach(this.afterEach.bind(this));
    }

    private async beforeEach(
        to: RouteLocationNormalized,
        from: RouteLocationNormalized
    ) {
        NProgress.start();

        if (!userStore.token && to.name !== 'Login') {
            return { name: 'Login' };
        }

        if ((from.name === 'Login' || userStore.token) && userStore.isEmpty) {
            await store.dispatch('user/getUserInfo')
            await helper.loadRoutes(this.router)

            return to
        }

        // 如果有配置用户权限，则验证权限
        if (permissionStore.permissions.length > 0) {
            const permission = to.meta.permission as string[];

            // 检查权限字符串数组中是否包含跳转路由 `meta.permission` 字符串
            if (permission && !permissionStore.permissions.includes(permission)) {
                ElMessageBox.alert('您暂无权限访问', '访问限制', {
                    // if you want to disable its autofocus
                    // autofocus: false,
                    confirmButtonText: '好的',
                    callback: () => {},
                })
                return from
            }
        }
    }

    private async afterEach() {
        NProgress.done();
    }
}

export default {
    use: (router: Router) => {
        new Guard(router).run();
    }
}
