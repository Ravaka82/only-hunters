import React from 'react';
import BaseField from "@/components/fields/BaseField.tsx";
import {FileField as FileFieldType} from "@/types.tsx";
import {useFormContext} from 'react-hook-form';
import {Input} from "@/components/ui/input.tsx";

export const FileField: React.FC<FileFieldType> = (props) => {
    const {name} = props;
    const {setValue, watch} = useFormContext();

    const files = watch(name) as FileList;

    const handleFilesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(name, event.target.files);
    };

    return (
        <BaseField {...props}>
            {() => (
                <div>
                    <Input
                        className="h-auto text-wrap
                        relative p-4
                        file:float-right file:mb-4
                        border
                        file:w-full
                        file:rounded-md file:text-sm file:font-medium
                        file:bg-primary file:text-primary-foreground hover:file:bg-primary/90
                        file:h-10 file:px-4 file:py-2"
                        type="file"
                        accept={props.accept}
                        multiple
                        onChange={handleFilesChange}
                    />
                    <div className="grid grid-cols-3 gap-2 my-4">
                        {files && Array.from(files).map((file, index) => (
                            <img
                                key={index}
                                src={URL.createObjectURL(file)}
                                className="w-full aspect-auto rounded"
                                alt={`Preview of ${file.name}`}
                            />
                        ))}
                    </div>
                </div>
            )}
        </BaseField>
    );
};

export default FileField;
