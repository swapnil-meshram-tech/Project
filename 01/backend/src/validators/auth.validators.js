const { z } = require('zod')

const TEMPORARY_DOMAINS = new Set([
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
            .string({ error: 'Username is required and must be a string.' })
            .min(1, {
                message: 'Username is required.', 
                abort: true
            })
            .min(6, 'Username must be between 6 and 30 characters.')
            .max(30, 'Username must be between 6 and 30 characters.')
            
            // .regex(/^[^A-Z]*$/, 'Username must be lowercase only.')
            .regex(/^\S*$/, 'Username cannot contain spaces, tabs or new lines.')
            .regex(/^[a-z]/, 'Username must start with lowercase letter.')
            .regex(/^[a-z0-9_.-]+$/, 'Username can only contain lowercase letters, numbers, underscores, dots and hyphens.')
            .regex(/[a-z0-9]$/, 'Username cannot end with a special character.')
            .regex(/^(?!.*[_.-]{2}).+$/, 'No consecutive special characters allowed.'),

        email: z
            .string({ error: 'Email is required and must be a string.' })
            .min(1, {
                message:'Email is required.', 
                abort: true
            })
            .min(6, 'Email address is too short.')
            .max(255, 'Email address cannot exceed 255 characters.')

            .regex(/^\S*$/, 'Email cannot contain spaces, tabs or new lines.')
            .regex(/^[^A-Z]*$/, 'Email must be lowercase only.')
            .regex(/^[a-z0-9_.+-]/, 'Email must start with a lowercase letter, number, or valid symbol.')
            
            .refine((val) => !val.includes('..'), {
                message: 'Email cannot contain consecutive dots.'
            })
            
            .pipe(z.email('Enter valid email addresss (e.g. user@domain.com).'))
            
            .refine((val) => {
                const domain = val.split('@')[1] || ''
                return !TEMPORARY_DOMAINS.has(domain) 
            }, { 
                message: 'Temporary email address are not allowed.'
            }),
            // .transform(val => val.toLowerCase()),

        password: z
            .string({ error: 'Password is required and must be a string.' })
            .min(1, {
                message:'Password is required.', 
                abort: true
            })
            .min(8, 'Password must be between 8 and 64 characters.')
            .max(64, 'Password must be between 8 and 64 characters.')
            
            .regex(/^\S/, 'Password cannot start with a space.')
            .regex(/\S$/, 'Password cannot end with a space.')
            
            .regex(/^[^\t\n\r]+$/, 'Password cannot contain tabs or newlines.')
            
            .regex(/[A-Z]/, 'Password must contain at least one uppercase letter.')
            .regex(/[a-z]/, 'Password must contain at least one lowercase letter.')
            .regex(/[0-9]/, 'Password must contain at least one number.')
            .regex(/[^a-zA-Z0-9\s]/, 'Password must contain at least one special character.'),
        
        confirmPassword: z
            .string({ error: 'Confirm password is required and must be a string.' })
            .min(1, {
                message:'Confirm password is required.', 
                abort: true
            })
    })
    .strict()
    // .refine((data) => {
    //    const prefix = data.email.split('@')[0].toLowerCase()
    //    return prefix.length < 3 || !data.password.toLowerCase().includes(prefix)
    // }, {
    //     path: ['password'],
    //     message: 'Password cannot contain email address.'
    // })
    // .refine((data) => data.password === data.confirmPassword, {
    //     message: 'Passwords do not match.',
    //     path: ['confirmPassword']
    // })

    .superRefine((data, ctx) =>{
        if(!data.username || !data.email || !data.password || !data.confirmPassword) return 
  
        const username = data.username.toLowerCase()
        const email = data.email.toLowerCase()
        const password = data.password.toLowerCase()
        const confirmPassword = data.confirmPassword.toLowerCase()

        const [localPart, domain] = email.split('@')

        // if(username === email){
        //     ctx.addIssue({
        //         code: 'custom',
        //         path: ['username'],
        //         message: 'Username cannot be same as email address.'
        //     })
        // }

        // if(username.includes(localPart)){
        //     ctx.addIssue({
        //         code: 'custom',
        //         path: ['username'],
        //         message: 'Username cannot be same as email address.'
        //     })
        // }

        if(domain){
            // const cleanUsername = username.replace(/\./g, '')
            const cleanUsername = username.split('.')
            const domainParts = domain.split('.')
            console.log(cleanUsername)
            console.log(domainParts)
            
            const containsDomainPart = domainParts.find((part) => 
                (part.length >= 2) && cleanUsername.includes(part))
            
            if(username.includes(localPart) || containsDomainPart) {
                ctx.addIssue({
                    code: 'custom',
                    path: ['username'],
                    message: `Username cannot contain specific part from email address.`
                })
            }
        }
        
        if(password.includes(username)){
            ctx.addIssue({
                code: 'custom',
                path: ['password'],
                message: 'Password cannot contain username.'
            })
        }

        // if(password === email){
        //     ctx.addIssue({
        //         code: 'custom',
        //         path: ['password'],
        //         message: 'Password cannot be same as email address.'
        //     })
        // }

        if(domain){
            // const cleanEmail = email.replace(/\./g, '')
            const domainParts = domain.split('.')

            const containsDomainPart = domainParts.find((part) => 
                (part.length >= 4) && password.includes(part))
            
            if(password.includes(localPart) || containsDomainPart) {
                ctx.addIssue({
                    code: 'custom',
                    path: ['password'],
                    message: `Password cannot contain sepecific part from email address.`
                })
            }
        }

        if(password !== confirmPassword){
            ctx.addIssue({
                code: 'custom',
                path: ['confirmPassword'],
                message: 'Passwords do not match.'
            })
        }
    }),

    login: z.object({
        identifier: z
            .string({ error: 'Identifier is required and must be a string.' })
            .min(1, {
                message:'Identifier is required.', 
                abort: true
            })
            .min(6, {
                message:'Invalid credentials.', 
                abort: true
            })
            .max(255, {
                message:'Invalid credentials.', 
                abort: true
            })
            .regex(/^[a-z][a-z0-9]*(?:[._-][a-z0-9]+)*$/, {
                message:'Invalid credentials.', 
                abort: true
            }),

        password: z
            .string({ error: 'Password is required and must be a string.' })
            .min(1, {
                message:'Password is required.', 
                abort: true
            })
            .min(8, {
                message:'Invalid credentials.', 
                abort: true
            })
            .max(64, {
                message:'Invalid credentials.', 
                abort: true
            })
            .regex(/^[^\s\t\n\r]+(?: +[^\s\t\n\r]+)*$/, {
                message:'Invalid credentials.', 
                abort: true
            }),
    })
    .strict()
}

module.exports = {
    authSchema
}