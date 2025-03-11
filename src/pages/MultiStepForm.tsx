import { useState } from "react";
import Form from "@rjsf/core"; 
import validator from '@rjsf/validator-ajv8'; 
import { RJSFSchema } from "@rjsf/utils"; 
import formSchema from './formSchema.json'; 

interface FormData {
  [key: string]: string | number | boolean | string[] | undefined;
}

const MultiStepForm = () => {
  const [step, setStep] = useState<number>(0); 

 
  const nextStep = (): void => {
    if (step < formSchema.steps.length - 1) setStep(step + 1);
  };

 
  const prevStep = (): void => {
    if (step > 0) setStep(step - 1);
  };

  const handleSubmit = (formData: FormData): void => {
    console.log(formData); 
  };

  const currentStepSchema = formSchema.steps[step];

  if (!currentStepSchema || !currentStepSchema.title || !currentStepSchema.description) {
    return <div>Le schéma pour cette étape est invalide.</div>;
  }

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-xl font-bold">{currentStepSchema.title}</h2>
      <p>{currentStepSchema.description}</p>

      <Form
        schema={currentStepSchema as unknown as RJSFSchema} 
        onSubmit={({ formData }) => handleSubmit(formData)}
        validator={validator}
      />

      <div className="mt-4 flex justify-between">
        <button
          onClick={prevStep}
          disabled={step === 0}
          className="bg-gray-500 text-white py-2 px-4 rounded"
        >
          Previous
        </button>
        <button
          onClick={nextStep}
          disabled={step === formSchema.steps.length - 1}
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default MultiStepForm;
