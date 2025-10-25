import { AlertCircleIcon } from "lucide-react";

interface FormInfoProps {
  message?: string;
}

export const FormInfo = ({message}:FormInfoProps)=>{
    if(!message)
        return null;
    else
        return <div className="bg-blue-200/30 p-3 rounded-md flex items-center gap-x-2 text-sm text-blue-600">
            <AlertCircleIcon className="h-4 w-4" />
            <p>{message}</p>
        </div>
}