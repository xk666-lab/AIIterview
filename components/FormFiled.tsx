import { Controller, Control, FieldValues, Path } from "react-hook-form";
// // 从 react-hook-form 导入必要的类型和组件
// 导入自定义的 UI 组件
import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface FormFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  type?: "text" | "email" | "password";
}
// / 使用泛型来确保类型安全
const FormField = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  type = "text",// 默认类型为 text
}: FormFieldProps<T>) => {
  return (
    // / Controller 是 react-hook-form 的组件，用于控制表单字段
    <Controller
      control={control}// 传入表单控制器
      name={name} // 字段名
      render={({ field }) => ( // 渲染函数，接收字段属性
        <FormItem>
           {/* 标签 */}
          <FormLabel className="label">{label}</FormLabel>
          {/* 输入控件包装器 */}
          <FormControl>
             {/* 实际的输入框 */}
            <Input
              className="input"
              type={type}
              placeholder={placeholder}
              {...field}// 展开字段属性（value, onChange 等）
            />
          </FormControl>
           {/* 错误消息显示 */}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormField;
