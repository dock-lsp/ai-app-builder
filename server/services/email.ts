import nodemailer from 'nodemailer';

// 验证码存储：email -> { code, expireAt }
const codeStore = new Map<string, { code: string; expireAt: number }>();

// 验证码过期时间：5分钟
const CODE_EXPIRE_MS = 5 * 60 * 1000;

// 邮件提供商类型
type EmailProvider = 'gmail' | 'resend';

// 获取邮件提供商
function getEmailProvider(): EmailProvider {
  if (process.env.EMAIL_PROVIDER === 'resend') {
    return 'resend';
  }
  return 'gmail';
}

// 是否配置了邮件服务
export function isEmailConfigured(): boolean {
  const provider = getEmailProvider();
  
  if (provider === 'resend') {
    return !!(process.env.EMAIL_API_KEY && process.env.EMAIL_FROM);
  }
  
  // Gmail
  return !!(process.env.EMAIL_USER && process.env.EMAIL_PASS);
}

// 生成6位随机验证码
function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// 创建邮件传输器（Gmail）
function createGmailTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

// 创建邮件传输器（Resend）
function createResendTransporter() {
  return nodemailer.createTransport({
    host: 'smtp.resend.com',
    port: 465,
    secure: true,
    auth: {
      user: 'resend',
      pass: process.env.EMAIL_API_KEY,
    },
  });
}

// 发送验证码邮件
export async function sendVerificationCode(email: string): Promise<string> {
  if (!isEmailConfigured()) {
    throw new Error('邮件服务未配置');
  }

  const code = generateCode();
  const provider = getEmailProvider();

  let transporter;
  let fromEmail: string;

  if (provider === 'resend') {
    transporter = createResendTransporter();
    fromEmail = process.env.EMAIL_FROM!;
  } else {
    transporter = createGmailTransporter();
    fromEmail = process.env.EMAIL_USER!;
  }

  await transporter.sendMail({
    from: `"AI App Builder" <${fromEmail}>`,
    to: email,
    subject: 'AI App Builder - 邮箱验证码',
    html: `
      <div style="max-width: 480px; margin: 0 auto; padding: 32px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h2 style="color: #1a1a2e; margin: 0;">AI App Builder</h2>
          <p style="color: #6b7280; margin: 8px 0 0;">邮箱验证码</p>
        </div>
        <div style="background: #f8fafc; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
          <p style="color: #6b7280; margin: 0 0 12px; font-size: 14px;">您的验证码是：</p>
          <div style="font-size: 36px; font-weight: bold; color: #667eea; letter-spacing: 8px; font-family: 'Courier New', monospace;">
            ${code}
          </div>
          <p style="color: #9ca3af; margin: 12px 0 0; font-size: 12px;">验证码5分钟内有效</p>
        </div>
        <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 0;">
          如果您没有请求此验证码，请忽略此邮件。
        </p>
      </div>
    `,
  });

  // 存储验证码
  codeStore.set(email, {
    code,
    expireAt: Date.now() + CODE_EXPIRE_MS,
  });

  return code;
}

// 验证验证码
export function verifyCode(email: string, code: string): boolean {
  const record = codeStore.get(email);

  if (!record) {
    return false;
  }

  // 检查是否过期
  if (Date.now() > record.expireAt) {
    codeStore.delete(email);
    return false;
  }

  if (record.code !== code) {
    return false;
  }

  // 验证成功后删除
  codeStore.delete(email);
  return true;
}
