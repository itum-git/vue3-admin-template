<script setup lang="ts">
import { Form } from '@/components/Form';
import { reactive, ref, unref } from 'vue';
import { useForm } from '@/hooks/useForm';
import { ElButton, ElInput, FormRules } from 'element-plus';
import { useValidator } from '@/hooks/useValidator';
import { FormSchema } from '@/types/form';
import { ElMessage } from 'element-plus';

const emit = defineEmits(['to-login']);

const { register, elFormRef } = useForm();

const { required } = useValidator();

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
        value: '',
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
        value: '',
        component: 'InputPassword',
        colProps: {
            span: 24,
        },
        componentProps: {
            style: {
                width: '100%',
            },
            strength: true,
            placeholder: '请输入密码',
        },
    },
    {
        field: 'check_password',
        label: '确认密码',
        value: '',
        component: 'InputPassword',
        colProps: {
            span: 24,
        },
        componentProps: {
            style: {
                width: '100%',
            },
            strength: true,
            placeholder: '请再次输入密码',
        },
    },
    {
        field: 'code',
        label: '验证码',
        colProps: {
            span: 24,
        },
    },
    {
        field: 'register',
        colProps: {
            span: 24,
        },
    },
]);

const rules: FormRules = {
    username: [required()],
    password: [required()],
    check_password: [required()],
    code: [required()],
};

const toLogin = () => {
    emit('to-login');
};

const loading = ref(false);

const loginRegister = async () => {
    ElMessage.info('暂无注册功能')
    // eslint-disable-next-line no-constant-condition
    if (true) return
    const formRef = unref(elFormRef);

    formRef?.validate(async (valid) => {
        if (valid) {
            try {
                // todo 补充注册逻辑
                loading.value = true;
                toLogin();
            } finally {
                loading.value = false;
            }
        }
    });
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
				注册
			</h2>
		</template>

		<template #code="form">
			<div class="w-[100%] flex">
				<ElInput v-model="form['code']" placeholder="请输入验证码" />
			</div>
		</template>

		<template #register>
			<div class="w-[100%]">
				<ElButton
					type="primary"
					class="w-[100%]"
					:loading="loading"
					@click="loginRegister"
				>
					注册
				</ElButton>
			</div>
			<div class="w-[100%] mt-15px">
				<ElButton class="w-[100%]" @click="toLogin">
					已有账号？去登录
				</ElButton>
			</div>
		</template>
	</Form>
</template>
