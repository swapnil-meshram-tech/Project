const { z } = require('zod')

const authSchemas = {
    register: z.object({
        username: z.string({ required_error: "Username is required" })
            .refine(val => !/\s/.test(val), { 
                message: "Username cannot contain spaces, tabs, or new lines" 
            })

            .min(4, "Username must be at least 4 characters")
            .max(15, "Username cannot exceed 15 characters")
            
            .regex(/^[a-z][a-z0-9_]*$/, "Username must start with a lowercase and contain no spaces or special characters"),

        email: z.string({ required_error: "Email is required" })
            .refine(val => !/\s/.test(val), { 
                message: "Email cannot contain spaces, tabs, or new lines" 
            })
            
            .regex(/^[a-z][a-z0-9._]*@/, "Email must start with a lowercase and contain only small letters, numbers, dots, or underscores before @")
            
            .email("Enter a valid email")
            .transform(val => val.toLowerCase()),

        password: z.string({ required_error: "Password is required" })
            .min(8, "Password must be at least 8 characters")
            .max(30, "Password cannot exceed 30 characters")
            
            .regex(/^[a-zA-Z]/, "Password must start with a letter")
            .regex(/[^\s]$/, "Password cannot end with a space, tab, or newline")
            .regex(/(?=.*[0-9])/, "Password must contain at least one number")
            .regex(/(?=.*[^a-zA-Z0-9\s])/, "Password must contain at least one special character"),
            
        confirmPassword: z.string({ required_error: "Confirm password is required" })
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"] // Attaches the error to the confirmPassword field
    }),

    login: z.object({
        email: z.string({ required_error: "Email is required" }).email("Invalid email address").trim(),
        password: z.string({ required_error: "Password is required" }).min(1, "Password is required")
    })
}

module.eports = {
    authSchemas
}