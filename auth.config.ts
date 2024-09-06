import GitHub from "next-auth/providers/github"
import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcryptjs from "bcryptjs"

import { LoginSchema } from "@/schema"
import { getUserByEmail } from "./data/user"
 
export default { providers: [Credentials({ 
    async authorize(credentials){
        const validatedFields = LoginSchema.safeParse(credentials);

        // if validation of the fields was successful only then we will proceed
        if (validatedFields.success){
            // destructure the email and password from validatedFields data
            const {email,password} = validatedFields.data;

            const user = await getUserByEmail(email);
            // the user might exist but they might have logged in using google or github in that case they won't have a password data
            if(!user || !user.password) return null;

            // comparing if the password entered matches with the user.password in the dstabase by hashing them back
            const passwordMatch = await bcryptjs.compare(password, user.password);

            if(passwordMatch) return user
        }

        return null
    }})] } satisfies NextAuthConfig