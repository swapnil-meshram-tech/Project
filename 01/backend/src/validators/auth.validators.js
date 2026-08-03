const { z } = require('zod')

const authSchema = {
    register: z.object({
        username: z.string({ required_error: 'Username is required' })
            .min(6, 'Username must be between 6 and 30 characters.')
            .max(30, 'Username must be between 6 and 30 characters.')
            
            .regex(/^[a-z]/, 'Username must start with a lowercase letter.')
            .regex(/^[a-z0-9_-]*$/, 'Username can only contain lowercase letters, numbers, underscores and hyphens.'),

        email: z.string({ required_error: 'Email is required' })
            .refine(val => !/\s/.test(val), { 
                message: 'Email cannot contain spaces, tabs, or new lines' 
            })

            .regex(/^[a-z0-9]/, 'Email must start with a letter or number.')
            
            // .regex(/^[a-z][a-z0-9._]*@[a-z0-9.-]+\.[a-z]{2,}$/, 'Email must start with a lowercase and contain only letters, numbers, dots, or underscores before @')
            .regex(/^[a-z0-9](?:[a-z0-9._+-]*[a-z0-9])?$/, 'Email must start with a lowercase and contain only letters, numbers, dots, or underscores before @')
            
            .pipe(z.email('Enter a valid email')),
            // .transform(val => val.toLowerCase()),

        password: z.string({ required_error: 'Password is required' })
            .min(8, 'Password must be between 8 and 64 characters.')
            .max(64, 'Password must be between 8 and 64 characters.')
            
            .regex(/^\S/, 'Password cannot start with a space.')
            .regex(/\S$/, 'Password cannot end with a space.')
            .regex(/^[^\t\n]*$/, 'Password cannot contain tabs or newlines.')
            .regex(/[A-Z]/, 'Password must contain at least one uppercase letter.')
            .regex(/[a-z]/, 'Password must contain at least one lowercase letter.')
            .regex(/[0-9]/, 'Password must contain at least one number.')
            .regex(/[^a-zA-Z0-9\s]/, 'Password must contain at least one special character.'),
        
        confirmPassword: z.string({ required_error: 'Confirm password is required' })
    })
    .strict()
    .refine((data) => data.username !== data.email, {
        message: 'Username cannot be the same as email.',
        path: ['username']  
    })
    .refine((data) => !data.password.toLowerCase().includes(data.username.toLowerCase()), {
        message: 'Password cannot contain username.',
        path: ['password']
    })
    .refine((data) => {
       const emailLocalPart = data.email.split('@')[0].toLowerCase()
       return !data.password.toLowerCase().includes(emailLocalPart)
       }, {
       message: 'Password cannot contain part of email address.',
       path: ['password']
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match.',
        path: ['confirmPassword']
    }),

    login: z.object({
        email: z.string({ required_error: 'Email is required' })
            .refine(val => !/\s/.test(val), { 
                 message: 'Email cannot contain spaces, tabs, or new lines' 
            })
            .email('Enter a valid email'),
            
        password: z.string({ required_error: 'Password is required' })
            .min(1, 'Password is required')
    })
    .strict()
}

module.exports = {
    authSchema
}