import { Dispatch, SetStateAction, createContext, useContext, useState } from "react";

type FormData = {
    language: string;
    text: string;
}

type FormDataContextType = {
    formData: FormData;
    setFormData: Dispatch<SetStateAction<FormData>>
}

const defaultContextValue: FormDataContextType = {
    formData: { language: '', text: '' },
    setFormData: () => {},
}

const FormDataContext = createContext<FormDataContextType>(defaultContextValue);

export function FormDataProvider({ children }) {
    const [formData, setFormData] = useState<FormData>(defaultContextValue.formData);

    return (
        <FormDataContext.Provider value={{ formData, setFormData }}>
            {children}
        </FormDataContext.Provider>
    );
};

export const useFormData = () => useContext(FormDataContext);