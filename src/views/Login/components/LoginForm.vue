<script setup lang="ts">
import { reactive, ref, unref, watch } from 'vue';
import { Form } from '@/components/Form';
import { useForm } from '@/hooks/useForm';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import type { RouteLocationNormalizedLoaded } from 'vue-router';
import { useValidator } from '@/hooks/useValidator';
import { FormSchema } from '@/types/form';
import { Md5 } from 'ts-md5'

const { required } = useValidator();

const emit = defineEmits(['to-register']);

const store = useStore();

const { currentRoute, push } = useRouter();

const rules = {
    username: [required()],
    password: [required()],
};

const schema = reactive<FormSchema[]>([
    {
        field: 'title',
        colProps: {
            span: 24,
        },
    },
    {
        field: 'username',
        label: '用户名',
        value: 'admin',
        component: 'Input',
        colProps: {
            span: 24,
        },
        componentProps: {
            placeholder: '请输入用户名',
        },
    },
    {
        field: 'password',
        label: '密码',
        value: 'admin',
        component: 'InputPassword',
        colProps: {
            span: 24,
        },
        componentProps: {
            style: {
                width: '100%',
            },
            placeholder: '请输入密码',
        },
    },
    {
        field: 'tool',
        colProps: {
            span: 24,
        },
    },
    {
        field: 'login',
        colProps: {
            span: 24,
        },
    },
    {
        field: 'other',
        component: 'Divider',
        label: '其他登录方式',
        componentProps: {
            contentPosition: 'center',
        },
    },
    {
        field: 'otherIcon',
        colProps: {
            span: 24,
        },
    },
]);

const iconSize = 30;

const remember = ref(false);

const { register, elFormRef, methods } = useForm();

const loading = ref(false);

const iconColor = '#999';

const redirect = ref<string>('');

watch(
    () => currentRoute.value,
    (route: RouteLocationNormalizedLoaded) => {
        redirect.value = route?.query?.redirect as string;
    },
    {
        immediate: true,
    }
);

// 登录
const signIn = async () => {
    const formRef = unref(elFormRef);
    await formRef?.validate(async (isValid) => {
        if (isValid) {
            loading.value = true;
            const { getFormData } = methods;
            const formData = await getFormData<{ username: string, password: string }>();

            try {

                const { username, password } = formData

                const res = await store.dispatch('user/login', { username, password: Md5.hashStr(password) });

                if (res) {
                    push({ path: redirect.value || '/' });
                }
            } finally {
                loading.value = false;
            }
        }
    });
};

// 去注册页面
const toRegister = () => {
    emit('to-register');
};
</script>

<template>
	<Form
		:schema="schema"
		:rules="rules"
		label-position="top"
		hide-required-asterisk
		size="large"
		class="dark:(border-1 border-[var(--el-border-color)] border-solid)"
		@register="register"
	>
		<template #title>
			<h2 class="text-2xl font-bold text-center w-[100%]">
				登录
			</h2>
		</template>

		<template #tool>
			<div class="flex justify-between items-center w-[100%]">
				<el-checkbox v-model="remember" label="记住密码" size="small" />
				<el-link type="primary" :underline="false">
					忘记密码
				</el-link>
			</div>
		</template>

		<template #login>
			<div class="w-[100%]">
				<el-button
					:loading="loading"
					type="primary"
					class="w-[100%]"
					@click="signIn"
				>
					登录
				</el-button>
			</div>
			<div class="w-[100%] mt-15px">
				<el-button class="w-[100%]" @click="toRegister">
					注册
				</el-button>
			</div>
		</template>

		<template #otherIcon>
			<div class="flex justify-between w-[100%]">
				<Icon
					name="ant-design:github-filled"
					:size="iconSize"
					class="cursor-pointer anticon"
					:color="iconColor"
				/>
				<Icon
					name="ant-design:wechat-filled"
					:size="iconSize"
					class="cursor-pointer anticon"
					:color="iconColor"
				/>
				<Icon
					name="ant-design:alipay-circle-filled"
					:size="iconSize"
					:color="iconColor"
					class="cursor-pointer anticon"
				/>
				<Icon
					name="ant-design:weibo-circle-filled"
					:size="iconSize"
					:color="iconColor"
					class="cursor-pointer anticon"
				/>
			</div>
		</template>
	</Form>
</template>

