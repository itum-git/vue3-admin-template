<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes';
import { useStore } from '@/store';


const store = useStore()

// 菜单折叠状态
const collapse = computed(() => store.state.app.collapse)
// logo 旁边标题
const title =  computed(() => store.state.app.title)

const handleCollapse = (collapse) => {
    store.dispatch('app/setCollapse', collapse)
}

const props = defineProps({
    show: propTypes.bool.def(true),
})


</script>


<template>
	<div class="w-full h-[var(--logo-height)] flex items-center p-[var(--logo-padding)] box-border justify-center transition-inherit">
		<Transition>
			<router-link
				v-if="props.show"
				to="/"
			>
				<img class="w-[var(--logo-image-width)]" src="@/assets/imgs/logo.png" />
			</router-link>
		</Transition>
		<Transition>
			<div v-if="props.show" class="w-0 lh-[100%] transition-initial flex-grow flex-shrink font-600 text-[var(--ep-font-size-extra-large)] ml mr truncate">
				{{ title }}
			</div>
		</Transition>
		<!-- <Transition> -->
		<Icon v-if="collapse" name="ep-expand" :size="18" @click="handleCollapse(false)" />
		<Icon v-else name="ep-fold" :size="18" @click="handleCollapse(true)" />
		<!-- </Transition> -->
	</div>
</template>