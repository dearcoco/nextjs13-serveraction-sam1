'use client'

import { experimental_useFormStatus as useFormStatus } from "react-dom";

const SubmitButton = ({value, props}: {value: string, props?: any}) => {
    const {pending} = useFormStatus();
    return (
        <button {...props} disabled={pending} >
            {pending ? 'loading...' : value }
        </button>
    );
}

export default SubmitButton;