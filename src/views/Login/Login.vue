<script setup lang="ts">
import { LoginForm, RegisterForm } from './components'
import { ref } from 'vue'

const isLogin = ref(true)

const toRegister = () => {
    isLogin.value = false
}

const toLogin = () => {
    isLogin.value = true
}
</script>

<template>
	<div class="w-full h-full">
		<Transition appear enter-active-class="animate__animated animate__bounceInRight">
			<div
				class="h-full flex items-center m-auto w-[100%] @2xl:max-w-500px @xl:max-w-500px @md:max-w-500px @lg:max-w-500px">
				<LoginForm
					v-if="isLogin"
					class="w-[var(--login-form-width)] bg-[var(--login-form-bg-color)] p-20px h-auto m-auto <xl:(rounded-3xl light:bg-white)"
					@to-register="toRegister" />
				<RegisterForm v-else class="p-20px h-auto m-auto <xl:(rounded-3xl light:bg-white)" @to-login="toLogin" />
			</div>
		</Transition>
	</div>
</template>
