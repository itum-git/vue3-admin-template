<template>
	<el-main ref="appViewRef">
		<el-scrollbar class="w-full relative of-hidden bg-[var(--main-bg-color-1)]">
			<router-view v-slot="{ Component }">
				<div :class="{ 'p-[var(--common-space-10)] bg-[var(--main-bg-color-1)] box-border': state.componentTitle }">
					<div v-if="state.componentTitle" class="mb-1em text-left">
						<h3 class="mt-0 mb-0">
							{{ state.componentTitle }}
						</h3>
					</div>
					<transition name="slide-right" mode="out-in">
						<keep-alive :include="Array.from(state.keepAliveComponentNameSet)">
							<component :is="Component" :key="state.componentKey" />
						</keep-alive>
					</transition>
				</div>
			</router-view>
		</el-scrollbar>
		
		<!-- <router-view>
			<template #default="{ Component, route }">
				<keep-alive :include="getAliveViewss">
					<component :is="Component" :key="route.fullPath" />
				</keep-alive>
			</template>
		</router-view> -->
	</el-main>
</template>

<script lang="ts" setup>

import { useRoute, useRouter, RouteLocationNormalized } from 'vue-router'
import { useStore } from '@/store'
import { useElementSize } from '@vueuse/core'

const route = useRoute()
const router = useRouter()
const store = useStore()

// const navTabs = store.state.navTabs

const state: {
	componentTitle: string | undefined
    componentKey: string
    keepAliveComponentNameSet: Set<string>
} = reactive({
    componentTitle: route.meta?.title,
    componentKey: route.path,
    keepAliveComponentNameSet: new Set(),
})

const appViewRef = ref(null)

const { width, height } = useElementSize(appViewRef)
watch([width, height], () => store.dispatch('app/setAppView', { width: unref(width), height: unref(height) }))

store.subscribeAction((action) => {

    if (action.type == 'navTabs/addAliveViews') {
        const { name } = action.payload
        state.keepAliveComponentNameSet.add(name)
        return
    }
    if (action.type == 'navTabs/delAliveViews') {
        const { name } = action.payload
        state.keepAliveComponentNameSet.delete(name)
    }
})

const updateState = () => {

    const { fullPath } = route

    state.componentKey = fullPath
    // 路由改变之后调用
    router.isReady().then(() => {
        state.componentTitle = route.meta?.wrapContent ? route.meta?.title : undefined
    })
}

const updateTab = (newRoute: RouteLocationNormalized) => {
    // 添加缓存页面路由
    store.dispatch('navTabs/addAliveViews', newRoute)
    // 激活当前页面路由页签
    store.dispatch('navTabs/setActiveView', newRoute)
}
// 实时监听路由变化
watch(
    route,
    (to) => {
        updateTab(to)
        updateState()
    }
)
// 初始化时，将当前页面路由缓存下来（防止页面刷新导致路由丢失）
onMounted(() => {
    updateTab(route)
    updateState()
})

</script>
