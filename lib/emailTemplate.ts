interface verificationEmailTemplateProps {
  confirmLink: string;
  userName: string | null;
  projectName: string;
}

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
        <p style="margin-bottom: 24px;">Tap the button below to confirm your email and activate your ${projectName} account.</p>
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
