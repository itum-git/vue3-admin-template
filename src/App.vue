<template>
	<el-config-provider namespace="ep" :size="size" :locale="zhCn">
		<RouterView />
	</el-config-provider>
</template>

<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'
import { useStore } from './store';
// element-plus 组件默认显示中文
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

const store = useStore()
const appState = store.state.app

const size = computed(() => store.state.app.size)


const { width } = useWindowSize()

// 监听窗口变化
watch(
    () => width.value,
    (width: number) => {
        
        if (width < 1200) {
            if (!appState.collapse) store.dispatch('app/setCollapse', true)
            if (!appState.asideFix) store.dispatch('app/setAsideFix', true)
        } else {
            if (appState.collapse) store.dispatch('app/setCollapse', false)
            if (appState.asideFix) store.dispatch('app/setAsideFix', false)
        }

        if (width < 768) {
            !appState.mobile ? store.dispatch('app/setMobile', true) : undefined
        }
    },
    {
        immediate: true
    }
)


</script>

<style>
#app {
    text-align: center;
    color: var(--ep-text-color-primary);
}

.element-plus-logo {
    width: 50%;
}
</style>
