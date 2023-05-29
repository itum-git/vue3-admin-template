<script setup lang="ts">
import { Error } from '@/components/Error';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

const { push } = useRouter();

const store = useStore();

const errorClick = () => {
    console.log(store.state.permission.routes[0]?.name)
    push({ name: store.state.permission.routes[0]?.name as string });
};
</script>

<template>
	<Error @error-click="errorClick" />
</template>
