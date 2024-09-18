import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcryptjs from "bcryptjs"

import { LoginSchema } from "@/schema"
import { getUserByEmail } from "./data/user"
 
export default { providers: [GitHub,Google, Credentials({ 
    async authorize(credentials){
        // LoginSchema defines the expected structure and constraints for the login fields (e.g., email, password). It's a way to ensure that the data conforms to specific types, formats, and rules.
        // safeParse is a method provided by Zod (or other validation libraries). It attempts to validate the credentials object against the schema (LoginSchema in this case).
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