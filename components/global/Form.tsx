'use client'

import { ReactElement, ReactNode, useRef } from "react";

type Props = {
    children: ReactNode | ReactElement;
    action: any;
} & any;

const Form = (props: Props) => {
    const formRef = useRef<HTMLFormElement>(null);
    async function handleAction(formData: FormData) {
        await props.action(formData);
        formRef.current!.reset();
    }
    return (
        <form {...props} ref={formRef} action={handleAction}>
            {props.children}
        </form>
    );
}

export default Form;