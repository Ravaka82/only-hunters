import React from "react";
import Flag from "react-world-flags";
import {Button} from "@/components/ui/button.tsx";


interface ChooseLanguageProps {
    setLng: (lng: string) => void;
}


const ChooseLanguage: React.FC<ChooseLanguageProps> = ({ setLng }) => {
    const languages = [
        {
            flag: 'FR',
            lng: 'fr',
            label: 'Français'
        },
        {
            flag: 'GB',
            lng: 'en',
            label: 'English'
        },
        {
            flag: 'ES',
            lng: 'es',
            label: 'Español'
        }
    ];
    return (
        <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-lg text-center">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Choose your language</h1>
                <p className="mt-4 text-muted-foreground">
                </p>
                <div className="mt-6 grid grid-cols-3 gap-4">
                    {languages.map(({ flag, lng, label}) => (
                        <div key={lng}>
                            <Button onClick={() => setLng(lng)} variant="ghost" className="h-auto w-fit">
                            <span className="flex h-14 w-20 overflow-hidden rounded">
                                    <Flag code={flag} title={label} className="object-cover"/>
                                </span>
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
};

export default ChooseLanguage