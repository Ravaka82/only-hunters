import MultiCheckboxField from "@/components/fields/MultiCheckboxField.tsx";
import React, { useState, useEffect } from 'react';
import { useLocalStorage } from '@uidotdev/usehooks';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider, type UseFormHandleSubmit, useWatch } from "react-hook-form";
import { z } from "zod";
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { createSchema } from '@/schema';
import {DefaultTypes, Step} from '@/types';
import CheckboxField from "@/components/fields/CheckboxField";
import SelectField from "@/components/fields/SelectField";
import RadioGroupField from "@/components/fields/RadioGroupField";
import SwitchField from "@/components/fields/SwitchField";
import TextareaField from "@/components/fields/TextareaField";
import ComboboxField from "@/components/fields/ComboboxField";
import TextField from "@/components/fields/TextField";
import BirthdateField from "@/components/fields/BirthdateField";
import FileField from "@/components/fields/FileField.tsx";
import PhoneField from "@/components/fields/PhoneField.tsx";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.tsx";
import ChooseLanguage from "@/components/ChooseLanguage.tsx";

export const baseApiUrl = import.meta.env.PROD ? `${window.location.origin}/api` : "http://127.0.0.1:8000";

const filterOptionalValues = (schema: Step[], values: Record<string, DefaultTypes>): Record<string, DefaultTypes> => {
    return schema.reduce((acc, step) => {
        step.fields.forEach(field => {
            const { name, dependsOn, condition } = field;

            if (dependsOn && values[dependsOn] !== condition) {
                acc[name] = undefined;
            } else {
                acc[name] = values[name];
            }
        });

        return acc;
    }, {} as Record<string, DefaultTypes>);
};

const getDefaultValues = (schema: Step[], storedWatchedValues: Record<string, DefaultTypes>) => {
    return schema.reduce((acc, step) => {
        step.fields.forEach(field => {
            let value = storedWatchedValues[field.name] ?? field.default ?? undefined;

            if (field.as === 'birthdate' && typeof value === 'string' && value) {
                value = new Date(value);
            }

            acc[field.name] = value;
        });
        return acc;
    }, {} as Record<string, DefaultTypes>);
};

const getValidationSchema = (schema: Step[], values: Record<string, DefaultTypes>) => {
    return schema.reduce((acc, step) => {
        step.fields.forEach(field => {
            if (!field.dependsOn || values[field.dependsOn] === field.condition) {
                acc[field.name] = field.rules;
            } else {
                acc[field.name] = z.any();
            }
        });
        return acc;
    }, {} as Record<string, z.ZodTypeAny>);
};

const App: React.FC = () => {
    const { t, i18n } = useTranslation();
    const [step, setStep] = useLocalStorage<number>('step', 0);
    const schema = createSchema(t);
    const [formSchema, setFormSchema] = useState(z.object(getValidationSchema(schema, {})));
    const [lng, setLng] = useLocalStorage<string | undefined>('lng', undefined);
    const [storedWatchedValues, setStoredWatchedValues] = useLocalStorage<Record<string, DefaultTypes>>('watchedValues', {});
    const [send, setSend] = useLocalStorage<boolean>('send', false);


    useEffect(() => {
        i18n.changeLanguage(lng);
    }, [lng, i18n]);

    const methods = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: getDefaultValues(schema, storedWatchedValues),
    });

    const { trigger, formState, control, reset } = methods;
    const { errors } = formState;

    // Utilisation de useWatch pour surveiller les changements de valeurs
    const watchedValues = useWatch({ control });

    useEffect(() => {
        setFormSchema(z.object(getValidationSchema(schema, watchedValues)));
    }, [watchedValues]);

    // Utilisation de useEffect pour stocker les watchedValues dans le localStorage
    useEffect(() => {
        setStoredWatchedValues(watchedValues);
    }, [watchedValues, setStoredWatchedValues]);


    const handleWizardSubmit: UseFormHandleSubmit<z.infer<typeof formSchema>> = (onSubmit, onError) => async (e) => {
        e?.preventDefault();

        const isStepValid = await trigger(schema[step].fields.map(field => field.name));

        if (isStepValid) {
            if (step < schema.length - 1) {
                setStep(step + 1);
            } else {
                onSubmit(filterOptionalValues(schema, watchedValues));
            }
        } else {
            if (onError) onError(errors, e);
        }
    };

    const handlePrevious = () => {
        setStep(step - 1);
    };

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const formData = new FormData();
            if (lng) {
                formData.append('language', lng);
            }

            Object.entries(values).forEach(([key, value]) => {
                if (value instanceof FileList) {
                    Array.from(value).forEach((file) => {
                        formData.append(key, file);
                    });
                } else if (value instanceof Date) {
                    formData.append(key, value.toISOString().split('T')[0]);
                } else if (value instanceof Array) {
                    Array.from(value).forEach((item) => {
                        formData.append(key, item);
                    })
                } else {
                    if (value !== undefined) {
                        formData.append(key, value);
                    }
                }
            });

            const response = await fetch(`${baseApiUrl}/`, {
                method: 'POST',
                body: formData,
            });

            if (200 <= response.status && response.status <= 299) {
                setSend(true);
                reset();
            }
        } catch (error) {
            console.error('Erreur lors de la soumission', error);
        }
    };

    if (lng === undefined) {
        return (
            <ChooseLanguage setLng={setLng} />
        )
    }

    if (send) {
        return (
            <div className="p-4 mx-auto max-w-xl h-screen flex items-center">
                <Alert variant="default" className="bg-green-50">
                    <AlertTitle>{t("alert.success.title")}</AlertTitle>
                    <AlertDescription>{t("alert.success.description")}</AlertDescription>
                </Alert>
            </div>
        )
    }

    return (
      <div className="p-4 mx-auto max-w-xl">
          <FormProvider {...methods}>
              <form onSubmit={handleWizardSubmit(onSubmit)} className="space-y-8">
                  <div className="space-y-2">
                      {schema[step].title &&
                        <h2
                          className="text-3xl leading-9 font-bold tracking-tight text-foreground">{t(schema[step].title)}</h2>}
                      {schema[step].description &&
                        <p className="text-md leading-7 text-foreground/70">{t(schema[step].description)}</p>}
                  </div>
                  {schema[step].fields.map((field) => {
                      const { dependsOn, condition, ...rest } = field;

                      const shouldDisplay = !dependsOn || methods.getValues(dependsOn) === condition;

                      if (!shouldDisplay) {
                          return null;
                      }

                      switch (field.as) {
                          case 'multicheckbox':
                              return <MultiCheckboxField key={field.name} {...rest} />;
                          case 'checkbox':
                              return <CheckboxField key={field.name} {...rest} />;
                          case 'select':
                              return <SelectField key={field.name} {...rest} />;
                          case 'radio':
                              return <RadioGroupField key={field.name} {...rest} />;
                          case 'switch':
                              return <SwitchField key={field.name} {...rest} />;
                          case 'textarea':
                              return <TextareaField key={field.name} {...rest} />;
                          case 'combobox':
                              return <ComboboxField key={field.name} {...rest} />;
                          case 'birthdate':
                              return <BirthdateField key={field.name} {...rest} />;
                          case 'file':
                              return <FileField key={field.name} {...rest} />;
                          case 'phone':
                              return <PhoneField key={field.name} {...rest} />;
                          default:
                              return <TextField key={field.name} {...rest} />;
                      }
                  })}
                  <div className="text-xs">
                      <span className="text-destructive text-lg">&nbsp;*</span> {t("required_fields")}
                  </div>
                  <div className="flex justify-between space-x-4">
                      <div className="w-full">
                          <Button type="button" variant="secondary" onClick={handlePrevious}
                                  className={`${step > 0 ? "w-full" : "hidden"}`}>
                              {t('previous')}
                          </Button>
                      </div>
                      <div className="w-full">
                          <Button type="submit" variant="default" className="w-full">
                              {step < schema.length - 1 ? t('next') : t('submit')}
                          </Button>
                      </div>
                  </div>
                  <div className="text-xs text-center">
                      <hr/>
                      <div className="mt-2 flex justify-between">
                          <a href="#" onClick={() => setLng(undefined)}>Choose your language</a>
                          <a href="#" onClick={() => {
                              reset(getDefaultValues(schema, {}));
                              setStep(0)
                          }}>Reset</a>
                      </div>
                  </div>
              </form>
          </FormProvider>
      </div>
    );
}

export default App;
