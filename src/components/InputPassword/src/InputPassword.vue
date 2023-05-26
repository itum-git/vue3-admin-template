<script setup lang="ts">
import { ref, unref, computed, watch } from 'vue';
import { ElInput } from 'element-plus';
import { propTypes } from '@/utils/propTypes';
import { useConfigGlobal } from '@/hooks/useConfigGlobal';

const props = defineProps({
    // 是否显示密码强度
    strength: propTypes.bool.def(false),
    modelValue: propTypes.string.def(''),
});

watch(
    () => props.modelValue,
    (val: string) => {
        if (val === unref(valueRef)) return;
        valueRef.value = val;
    }
);

const { configGlobal } = useConfigGlobal();

const emit = defineEmits(['update:modelValue']);

// 设置input的type属性
const textType = ref<'password' | 'text'>('password');

const changeTextType = () => {
    textType.value = unref(textType) === 'text' ? 'password' : 'text'
};

// 输入框的值
const valueRef = ref(props.modelValue);

// 监听
watch(
    () => valueRef.value,
    (val: string) => {
        emit('update:modelValue', val);
    }
);

// 获取密码强度
const getPasswordStrength = computed(() => {
    const value = unref(valueRef);
    const zxcvbnRef = /* zxcvbn(unref(valueRef)) as ZxcvbnResult */ {
        score: 0,
    };
    return value ? zxcvbnRef.score : -1;
});

const getIconName = computed(() =>
    unref(textType) === 'password'
        ? 'ant-design:eye-invisible-outlined'
        : 'ant-design:eye-outlined'
);
</script>

<template>
	<div :class="configGlobal?.size">
		<ElInput v-bind="$attrs" v-model="valueRef" :type="textType">
			<template #suffix>
				<Icon
					class="el-input__icon cursor-pointer"
					:name="getIconName"
					@click="changeTextType"
				/>
			</template>
		</ElInput>
		<div
			v-if="strength"
			class="relative h-6px mt-10px mb-6px mr-auto ml-auto"
		>
			<div :data-score="getPasswordStrength"></div>
		</div>
	</div>
</template>

<!-- <style lang="sass" scoped>
$prefix-cls: #{namespace}-input-password;

.#{prefix-cls} {
    :deep(.#{elNamespace}-input__clear) {
        margin-left: 5px;
    }
}
</style> -->
