<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus'
import { useFullscreen } from '@vueuse/core'
import { Icon } from '@/components/Icon';
import BaseTabs from './BaseTabs.vue'
import { toggleDark } from '@/composables';
import { useStore } from '@/store';

const { push } = useRouter();

const store = useStore()

const userInfo = computed(() => store.state.user?.info || {})

const asideFix =  computed(() => store.state.app.asideFix)

const handleCollapse = (collapse = false) => store.dispatch('app/setCollapse', collapse)

const handleCommand = (command: string | number) => {
    switch(command) {
        case 'logout':
            ElMessageBox.alert('您确定要退出登录吗？', '退出', {
                // if you want to disable its autofocus
                // autofocus: false,
                confirmButtonText: '确定',
                callback: (action) => {
                    if (action === 'confirm') {
                        store.dispatch('user/logout').then(() => {
                            push({ name: 'Login' })    
                        })
                    }  
                },
            })
            break
        default:
            ElMessage.info(`Action ${command}`)
            return
    }
}

const { isFullscreen, toggle } = useFullscreen()

const fullScreen = () => {
    toggle()
}

</script>

<template>
	<div class="h-full flex">
		<Icon v-if="asideFix" class="h-full ml-[var(--ba-main-space)]" name="ep-expand" :size="18" @click="handleCollapse()" />
		<BaseTabs v-else class="flex-grow of-x-auto of-y-hidden mr-[var(--ba-main-space)] flex relative" />
		<el-menu :class="[{'header-nav-width': asideFix}, 'h-[inherit] justify-end b-b-none ml-a']" mode="horizontal" :ellipsis="asideFix">
			<el-menu-item index="0" class="w-40px p-0 h-full" @click="toggleDark()">
				<button
					class="border-none w-full bg-transparent cursor-pointer"
					style="height: var(--ep-menu-item-height)"
				>
					<i inline-flex i="dark:ep-moon ep-sunny"></i>
				</button>
			</el-menu-item>
			<el-menu-item index="1" class="w-40px p-0 h-full" @click="fullScreen()">
				<button
					class="border-none w-full bg-transparent cursor-pointer"
					style="height: var(--ep-menu-item-height)"
				>
					<i inline-flex :i="isFullscreen ? 'ant-design-fullscreen-exit' : 'ep-full-screen'"></i>
				</button>
			</el-menu-item>
		</el-menu>
		<el-dropdown @command="handleCommand">
			<span class="inline-flex justify-center items-center pl-[var(--ep-menu-base-level-padding)] pr-[var(--ep-menu-base-level-padding)]">
				{{ userInfo.name }}
				<Icon name="ep:caret-bottom" class="ml-5px" />
			</span>
			<template #dropdown>
				<el-dropdown-menu>
					<el-dropdown-item command="a">
						Action 1
					</el-dropdown-item>
					<el-dropdown-item command="b">
						Action 2
					</el-dropdown-item>
					<el-dropdown-item command="c">
						Action 3
					</el-dropdown-item>
					<el-dropdown-item command="d" disabled>
						Action 4
					</el-dropdown-item>
					<el-dropdown-item command="logout" divided>
						退出登录
					</el-dropdown-item>
				</el-dropdown-menu>
			</template>
		</el-dropdown>
	</div>
</template>

<style>
.header-nav-width {
  width: calc(100% - 150px);
}
</style>