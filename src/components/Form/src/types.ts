import { FormSchema } from '@/types/form';

export interface PlaceholderMoel {
    placeholder?: string;
    startPlaceholder?: string;
    endPlaceholder?: string;
    rangeSeparator?: string;
}

export type FormProps = {
    schema?: FormSchema[];
    isCol?: boolean;
    model?: Recordable;
    autoSetPlaceholder?: boolean;
    isCustom?: boolean;
    labelWidth?: string | number;
} & Recordable;

export type RecordableTSX<T = any, K = string> = Recordable<T, K>

export type ComponentRefTSX<T=ElRef> = ComponentRef<T>