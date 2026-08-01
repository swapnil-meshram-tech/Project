const { z } = require('zod')

const authSchema = {
    register: z.object({
        username: z.string({ required_error: "Username is required" })
            // .refine(val => !/\s/.test(val), { 
            //     message: "Username cannot contain spaces, tabs, or new lines" 
            // })

            .min(4, "Username must be at least 4 characters")
            .max(15, "Username cannot exceed 15 characters")
            
            .regex(/^[a-z][a-z0-9_]*$/, "Username must start with a lowercase and contain no spaces or special characters"),

        email: z.string({ required_error: "Email is required" })
            .refine(val => !/\s/.test(val), { 
                message: "Email cannot contain spaces, tabs, or new lines" 
            })
            
            .regex(/^[a-z][a-z0-9._]*@[a-z0-9.-]+\.[a-z]{2,}$/, "Email must start with a lowercase and contain only letters, numbers, dots, or underscores before @")
            
            .pipe(z.email("Enter a valid email")),
            // .transform(val => val.toLowerCase()),

        password: z.string({ required_error: "Password is required" })
            .min(8, "Password must be at least 8 characters")
            .max(30, "Password cannot exceed 30 characters")
            
            .regex(/^[^\t\n]*$/, "Password cannot contain tabs or newlines")
            .regex(/^[a-zA-Z]/, "Password must start with a letter")
            .regex(/[^ ]$/, "Password cannot end with a space")
            .regex(/(?=.*[a-z])/, "Password must contain at least one lowercase letter")
            .regex(/(?=.*[A-Z])/, "Password must contain at least one uppercase letter")
            .regex(/(?=.*[0-9])/, "Password must contain at least one number")
            .regex(/(?=.*[^a-zA-Z0-9 ])/, "Password must contain at least one special character"),
            
        confirmPassword: z.string({ required_error: "Confirm password is required" })
    })
    .strict()
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"]
    }),

    login: z.object({
        email: z.string({ required_error: "Email is required" })
            .refine(val => !/\s/.test(val), { 
                 message: "Email cannot contain spaces, tabs, or new lines" 
            })
            .email("Enter a valid email"),
            
        password: z.string({ required_error: "Password is required" })
            .min(1, "Password is required")
    })
    .strict()
}

module.exports = {
    authSchema
}