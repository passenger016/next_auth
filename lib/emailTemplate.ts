interface verificationEmailTemplateProps {
  confirmLink: string;
  userName: string | null;
  projectName: string;
}

interface passwordResetEmailTemplateProps {
  resetLink: string;
  userName: string | null;
  projectName: string;
}

interface twoFactorAuthEmailTemplateProps {
  token: string;
  userName: string | null;
  projectName: string;
}

// template for verification email
export const verificationEmailTemplate = ({
  confirmLink,
  userName,
  projectName,
}: verificationEmailTemplateProps) => {
  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f6f8fa; padding: 0; margin: 0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 40px auto; background: #fff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
    <tr>
      <td style="background: #2563eb; text-align: center; padding: 32px 0;">
        <span style="font-size: 2rem; font-weight: 800; color: #fff; letter-spacing: 1px;">${projectName}</span>
      </td>
    </tr>
    <tr>
      <td style="padding: 32px;">
        <p style="font-size: 1rem; margin-bottom: 16px;">Hello <strong style="color: #2563eb;">${userName ? userName : ""}</strong>,</p>
        <h2 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 16px;">Confirm your email</h2>
        <p style="margin-bottom: 24px;">Tap the button below to confirm your email and activate your ${projectName} account. Please do not share this link with someone else.</p>
        <a href="${confirmLink}" style="display: inline-block; background: #2563eb; color: #fff; font-weight: 600; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin-bottom: 24px;">Confirm email</a>
        <p style="font-size: 0.95rem; color: #555; margin: 24px 0 8px;">For security, this link may expire after a short time.</p>
        <div style="background: #f1f5f9; border-radius: 6px; padding: 6px 12px; font-size: 0.95rem; color: #555; margin-bottom: 24px;">
          If the button above doesn't work, copy and paste this link into your browser:<br>
          <a href="${confirmLink}" style="color: #2563eb; text-decoration: underline;">${confirmLink}</a>
        </div>
      </td>
    </tr>
  </table>
</div>
  `;
};

// template for password reset email
export const passwordResetEmailTemplate = ({
  resetLink,
  userName,
  projectName,
}: passwordResetEmailTemplateProps) => {
  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f6f8fa; padding: 0; margin: 0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 40px auto; background: #fff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
    <tr>
      <td style="background: #2563eb; text-align: center; padding: 32px 0;">
        <span style="font-size: 2rem; font-weight: 800; color: #fff; letter-spacing: 1px;">${projectName}</span>
      </td>
    </tr>
    <tr>
      <td style="padding: 32px;">
        <p style="font-size: 1rem; margin-bottom: 16px;">Hello <strong style="color: #2563eb;">${userName ? userName : ""}</strong>,</p>
        <h2 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 16px;">Reset your password</h2>
        <p style="margin-bottom: 24px;">Tap the button below to reset your password for your ${projectName} account. Please do not share this link with someone else.</p>
        <a href="${resetLink}" style="display: inline-block; background: #2563eb; color: #fff; font-weight: 600; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin-bottom: 24px;">Reset password</a>
        <p style="font-size: 0.95rem; color: #555; margin: 24px 0 8px;">For security, this link may expire after a short time.</p>
        <div style="background: #f1f5f9; border-radius: 6px; padding: 6px 12px; font-size: 0.95rem; color: #555; margin-bottom: 24px;">
          If the button above doesn't work, copy and paste this link into your browser:<br>
          <a href="${resetLink}" style="color: #2563eb; text-decoration: underline;">${resetLink}</a>
        </div>
      </td>
    </tr>
  </table>
</div>
  `;
};

// template for 2FA code email
// this email won't contain a link instead will contain a 6 digit code which is the token itself
export const twoFactorAuthEmailTemplate = ({
  token,
  userName,
  projectName,
}: twoFactorAuthEmailTemplateProps) => {
  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f6f8fa; padding: 0; margin: 0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 40px auto; background: #fff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
    <tr>
      <td style="background: #2563eb; text-align: center; padding: 32px 0;">
        <span style="font-size: 2rem; font-weight: 800; color: #fff; letter-spacing: 1px;">${projectName}</span>
      </td>
    </tr>
    <tr>
      <td style="padding: 32px;">
        <p style="font-size: 1rem; margin-bottom: 16px;">Hello <strong style="color: #2563eb;">${userName ? userName : ""}</strong>,</p>
        <h2 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 24px;">Your 2FA Code</h2>
        <div style="display: block; width:100%;">
          <span style="display:inline-block; color: #2563eb; font-weight: bold; font-size: 5rem; padding: 0px 16px; user-select: text; width:100%; text-align: center; margin:0; line-height: 1.2;"> ${token} </span>
          <span style="display:inline-block; font-size: 0.95rem; color: #555; width:100%; text-align: center; width:100%; text-align: center;">Long press to copy the code on mobile.</span>
        </div>
        <p style="margin-top: 24px;">Please do not share this code with anyone. If you did not request this code, you can safely ignore this email.</p>
        <p style="font-size: 0.95rem; color: #555; margin: 24px 0 8px;">For security, this token may expire after a short time.</p>
      </td>
    </tr>
  </table>
</div>
  `;
};
