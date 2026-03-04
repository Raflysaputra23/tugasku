"use client"

import { useFormStatus } from "react-dom"
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";



const ButtonForm = ({ children }: { children: React.ReactNode }) => {
    const { pending } = useFormStatus();

    return (
        <Button type="submit" className="w-full flex items-center gap-2 cursor-pointer" disabled={pending}>
            {children}{pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        </Button>
    )
}

export default ButtonForm
