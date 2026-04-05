import React, { forwardRef } from "react";
import Select from "react-select";
import type { FieldProps } from "formik";
import type { SelectDto } from "../../presentation/general/SelectDto";

interface Props {
    options: SelectDto[];
    disabled?: boolean;
    className?: string;
    onKeyDown?: (e: any) => void;
}

const FormikSelect = forwardRef<any, Props & FieldProps>(
    ({ field, form, options, disabled, className, onKeyDown }, ref) => {

        const selectOptions = options.map(o => ({
            value: o.value,
            label: o.descript
        }));

        const selected =
            selectOptions.find(o => o.value === field.value) ?? null;

        return (
            <Select
                ref={ref}
                name={field.name}
                options={selectOptions}
                value={selected}
                isDisabled={disabled}
                className={className}
                classNamePrefix="react-select"

                onChange={(option) => {
                    form.setFieldValue(field.name, option?.value ?? null);
                }}

                onKeyDown={(e) => {
                    onKeyDown?.(e);
                }}
            />
        );
    });

export default FormikSelect;