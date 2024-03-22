import { useFormData } from "../../context/FormDataContext"

export default function Result() {
    const { formData } = useFormData();
    return (
        <div>
            <h1>Results</h1>
            <p>Language: {formData.language}</p>
            <p>Text: {formData.text}</p>
        </div>
    )
}
