<script setup lang="ts">
import { Error } from '@/components/Error';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

const { push } = useRouter();

const store = useStore();

const errorClick = () => {
    push(store.state.permission.routes[0]?.path as string);
};
</script>

<template>
	<Error type="403" @error-click="errorClick" />
</template>
