import { Header } from "./header";
import { BackButton } from "./back-button";

import { CardHeader, Card, CardFooter } from "../ui/card";


export const ErrorCard =()=>{
    return(
        <Card className="w-[400px] shadow-md">
            <CardHeader>
                <Header label="Oops! Something went wrong!" />
            </CardHeader>
            <BackButton label="Back to login" href="/auth/login" />
        </Card>
    )
}