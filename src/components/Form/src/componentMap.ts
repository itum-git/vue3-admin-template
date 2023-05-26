import type { Component } from 'vue';
import {
    ElCascader,
    ElCheckboxGroup,
    ElColorPicker,
    ElDatePicker,
    ElInput,
    ElInputNumber,
    ElRadioGroup,
    ElRate,
    ElSelect,
    ElSelectV2,
    ElSlider,
    ElSwitch,
    ElTimePicker,
    ElTimeSelect,
    ElTransfer,
    ElAutocomplete,
    ElDivider,
    ElCascaderPanel,
} from 'element-plus';
import { InputPassword } from '@/components/InputPassword';
import { ComponentName } from 'types/components';

const componentMap: Recordable<Component, ComponentName> = {
    Radio: ElRadioGroup,
    Checkbox: ElCheckboxGroup,
    CheckboxButton: ElCheckboxGroup,
    Input: ElInput,
    Autocomplete: ElAutocomplete,
    InputNumber: ElInputNumber,
    Select: ElSelect,
    Cascader: ElCascader,
    CascaderPanel: ElCascaderPanel,
    Switch: ElSwitch,
    Slider: ElSlider,
    TimePicker: ElTimePicker,
    DatePicker: ElDatePicker,
    Rate: ElRate,
    ColorPicker: ElColorPicker,
    Transfer: ElTransfer,
    Divider: ElDivider,
    TimeSelect: ElTimeSelect,
    SelectV2: ElSelectV2,
    RadioButton: ElRadioGroup,
    InputPassword: InputPassword,
};

export { componentMap };
