import React, { forwardRef } from "react";
import Select from "react-select";
import type { FieldProps } from "formik";
import type { SelectDto } from "../../presentation/general/SelectDto";
import "../../app/styles/selectPerso.css";

interface Props {
    options: SelectDto[];
    disabled?: boolean;
    className?: string;
    placeholder?: string;
    onKeyDown?: (e: any) => void;
}

const FormikSelect = forwardRef<any, Props & FieldProps>(
    ({ field, form, options, disabled, className, placeholder, onKeyDown }, ref) => {

        const selectOptions = options.map(o => ({
            value: o.value,
            label: o.descript
        }));

        const selected =
            selectOptions.find(o => o.value === field.value) ?? null;

        const customStyles = {
            option: (base: any, state: any) => ({
                ...base,
                color: state.isSelected ? "#fff" : "#212529",
                backgroundColor: state.isSelected
                    ? "#0d6efd"       // azul bootstrap
                    : state.isFocused
                        ? "#e9ecef"
                        : "#fff",
            }),

            singleValue: (base: any) => ({
                ...base,
                color: "#212529", // texto seleccionado
            }),

            control: (base: any, state: any) => ({
                ...base,
                borderColor: state.isFocused ? "#86b7fe" : "#ced4da",
                boxShadow: state.isFocused
                    ? "0 0 0 .25rem rgba(13,110,253,.25)"
                    : "none",
            }),
        };

        return (
            <Select
                ref={ref}
                name={field.name}
                options={selectOptions}
                value={selected}
                isDisabled={disabled}
                classNamePrefix="react-select"
                className={className}
                styles={customStyles}
                placeholder={placeholder}
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