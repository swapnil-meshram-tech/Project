const otpEmailTemplate = (otp) =>{
    return `
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" align="center" style="background-color: #f3f4f6; width: 100%;">
            <tr>
                <td align="center" valign="top" style="padding: 40px 16px;">

                    <!--[if mso]>
                    <table role="presentation" width="460" cellpadding="0" cellspacing="0" border="0" align="center">
                    <tr>
                    <td>
                    <![endif]-->

                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="width: 100%; max-width: 460px; margin: 0 auto; background-color: #ffffff; border-radius: 18px; border: 1px solid #e5e7eb;">
                        <tr>
                            <td align="center" style="padding: 40px 32px; text-align: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">

                                <h2 style="margin: 0 0 12px 0; color: #111827; font-size: 24px; line-height: 1.3; font-weight: 700; white-space: nowrap;">
                                    Verify your email
                                </h2>

                                <p style="margin: 0 0 28px 0; color: #4b5563; font-size: 15px; line-height: 1.6; white-space: nowrap;">
                                    Use the following verification code to complete your request.
                                </p>

                                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f9fafb; border-radius: 14px; border: 1px solid #e5e7eb; margin-bottom: 24px;">
                                    <tr>
                                        <td align="center" style="padding: 22px 16px;">
                                            <span style="font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace; font-size: 34px; font-weight: 700; letter-spacing: 8px; color: #111827; white-space: nowrap;">
                                                ${otp}
                                            </span>
                                        </td>
                                    </tr>
                                </table>

                                <p style="margin: 0; color: #9ca3af; font-size: 13px; line-height: 1.5; white-space: nowrap;">
                                    This code expires in 2 minutes. If you didn't request this, you can safely ignore.
                                </p>

                            </td>
                        </tr>
                    </table>

                    <!--[if mso]>
                    </td>
                    </tr>
                    </table>
                    <![endif]-->

                </td>
            </tr>
        </table>
    `
}

module.exports = {
    otpEmailTemplate
}