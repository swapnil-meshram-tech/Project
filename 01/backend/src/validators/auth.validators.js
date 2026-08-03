const { z } = require('zod')

const DISPOSABLE_DOMAINS = new Set([
  'tempmail.com',
  'temp-mail.xyz',
  'throwawaymail.com',
  'mailinator.com',
  'yopmail.com',
  '10minutemail.com'
])

const authSchema = {
    register: z.object({
        username: z
            .string({ required_error: 'Username is required' })
            .trim() 
            .min(6, 'Username must be between 6 and 30 characters.')
            .max(30, 'Username must be between 6 and 30 characters.')
            
            .regex(/^[a-z]/, 'Username must start with lowercase letter.')
            .regex(/^[a-z0-9_-]+$/, 'Username can only contain lowercase letters, numbers, underscores and hyphens.'),

        email: z
            .string({ required_error: 'Email is required' })
            .trim() 
            .min(6, 'Email address is too short.')
            .max(255, 'Email address cannot exceed 255 characters.')

            // .regex(/^\S*$/, 'Email cannot contain spaces, tabs, or new lines.')
            .regex(/^[^A-Z]*$/, 'Email must be lowercase only.')
            .regex(/^[a-z0-9_.\+\-]/, 'Email must start with a lowercase letter, number, or valid symbol.')
            
            .refine((val) => !val.includes('..'), {
                message: 'Email cannot contain consecutive dots.'
            })
            
            .pipe(z.email('Enter valid email addresss format (e.g., name@example.com).'))
            
            .refine((val) => {
                const domain = val.split('@')[1] || ''
                return !DISPOSABLE_DOMAINS.has(domain) 
            }, { 
                message: 'Disposable or temporary email addresses are not allowed.'
            }),
            // .transform(val => val.toLowerCase()),

        password: z
            .string({ required_error: 'Password is required' })
            .min(8, 'Password must be between 8 and 64 characters.')
            .max(64, 'Password must be between 8 and 64 characters.')
            
            .regex(/^\S/, 'Password cannot start with a space.')
            .regex(/\S$/, 'Password cannot end with a space.')
            
            .regex(/^[^\t\n]+$/, 'Password cannot contain tabs or newlines.')
            
            .regex(/[A-Z]/, 'Password must contain at least one uppercase letter.')
            .regex(/[a-z]/, 'Password must contain at least one lowercase letter.')
            .regex(/[0-9]/, 'Password must contain at least one number.')
            .regex(/[^a-zA-Z0-9\s]/, 'Password must contain at least one special character.'),
        
        confirmPassword: z
            .string({ required_error: 'Confirm password is required' })
    })
    .strict()
    .refine((data) => data.username !== data.email, {
        message: 'Username cannot be the same as email address.',
        path: ['username']  
    })
    .refine((data) => !data.password.toLowerCase().includes(data.username.toLowerCase()), {
        message: 'Password cannot contain username.',
        path: ['password']
    })
    .refine((data) => {
       const prefix = data.email.split('@')[0].toLowerCase()
       return prefix.length < 3 || !data.password.toLowerCase().includes(prefix)
       }, {
       message: 'Password cannot contain email address.',
       path: ['password']
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match.',
        path: ['confirmPassword']
    }),

    login: z.object({
        identifier: z
            .string({ required_error: 'Email is required' })
            .min(6, 'Invalid credentials.') 
            .max(255, 'Invalid credentials.')
            .regex(/^[^A-Z]+$/, 'Invalid credentials.')
            .regex(/^\S+$/, 'Invalid credentials.'),
            
        password: z
            .string({ required_error: 'Password is required' })
            .min(8, 'Invalid credentials.')
            .max(64, 'Invalid credentials.'),
    })
    .strict()
}

module.exports = {
    authSchema
}