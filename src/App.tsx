import React, { useEffect } from 'react';
import { useLocalStorage } from '@uidotdev/usehooks';
import { useForm, FormProvider } from "react-hook-form";
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { getJsonSchema, getUiSchema } from './schema.tsx';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert.tsx";
import ChooseLanguage from "@/components/ChooseLanguage.tsx";
import { default as Form } from "@rjsf/core";
import validator from '@rjsf/validator-ajv8';

export const baseApiUrl = import.meta.env.PROD ? `${window.location.origin}/api` : "http://127.0.0.1:8000";

const App: React.FC = () => {
    const { t, i18n } = useTranslation();
    const [step, setStep] = useLocalStorage<number>('step', 0);
    const [lng, setLng] = useLocalStorage<string | undefined>('lng', undefined);
    const [send, setSend] = useLocalStorage<boolean>('send', false);

    const jsonSchema = getJsonSchema(t);
    const uiSchema = getUiSchema(t);


    useEffect(() => {
        i18n.changeLanguage(lng);
    }, [lng, i18n]);

    const methods = useForm({
        defaultValues: {},
    });

    const onSubmit = async (values: Record<string, any>) => {
        try {
            const formData = new FormData();
            if (lng) {
                formData.append('language', lng);
            }

            Object.entries(values).forEach(([key, value]) => {
                if (Array.isArray(value) && value.every((item) => item instanceof File)) {
                    value.forEach((file) => {
                        formData.append(key, file);
                    });
                } else if (value instanceof Date) {
                    formData.append(key, value.toISOString().split('T')[0]);
                } else if (Array.isArray(value)) {
                    value.forEach((item) => {
                        formData.append(key, item);
                    });
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
                methods.reset();
            }
        } catch (error) {
            console.error('Erreur lors de la soumission', error);
        }
    };

    if (lng === undefined) {
        return <ChooseLanguage setLng={setLng} />;
    }

    if (send) {
        return (
            <div className="p-4 mx-auto max-w-xl h-screen flex items-center">
                <Alert variant="default" className="bg-green-50">
                    <AlertTitle>{t("alert.success.title")}</AlertTitle>
                    <AlertDescription>{t("alert.success.description")}</AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="p-4 mx-auto max-w-xl">
            <FormProvider {...methods}>
                <Form
                    schema={jsonSchema}
                    uiSchema={uiSchema}
                    onSubmit={onSubmit}
                    validator={validator}
                >
                    <div className="flex justify-between space-x-4">
                        <Button type="button" variant="secondary" onClick={() => setStep(step - 1)}>
                            {t('previous')}
                        </Button>
                        <Button type="submit" variant="default">
                            {step < Object.keys(jsonSchema.properties).length - 1 ? t('next') : t('submit')}
                        </Button>
                    </div>
                </Form>
            </FormProvider>
        </div>
    );
};

export default App;