import nodemailer from "nodemailer";
import { logger } from "./logger";

const smtpHost = process.env.SMTP_HOST;
const smtpPort = Number(process.env.SMTP_PORT ?? 587);
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const mailFrom = process.env.MAIL_FROM ?? "MyMoussaid <noreply@mymoussaid.ma>";

const transporter =
  smtpHost && smtpUser && smtpPass
    ? nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: { user: smtpUser, pass: smtpPass },
      })
    : null;

async function sendMail(to: string, subject: string, html: string) {
  if (!transporter) {
    logger.info("[mailer] SMTP not configured — email logged only", {
      to,
      subject,
      html,
    });
    return;
  }

  await transporter.sendMail({ from: mailFrom, to, subject, html });
}

export async function sendAccountApprovedEmail(params: {
  to: string;
  firstName: string;
}) {
  const { to, firstName } = params;
  await sendMail(
    to,
    "Votre compte MyMoussaid a été approuvé",
    `
      <p>Bonjour ${firstName},</p>
      <p>Bonne nouvelle ! Votre demande d'inscription a été <strong>approuvée</strong>.</p>
      <p>Vous pouvez dès à présent vous connecter à la plateforme MyMoussaid.</p>
      <p>À bientôt,<br/>L'équipe MyMoussaid</p>
    `
  );
}

export async function sendAccountRejectedEmail(params: {
  to: string;
  firstName: string;
  reason?: string | null;
}) {
  const { to, firstName, reason } = params;
  await sendMail(
    to,
    "Votre demande d'inscription MyMoussaid",
    `
      <p>Bonjour ${firstName},</p>
      <p>Nous avons le regret de vous informer que votre demande d'inscription a été <strong>refusée</strong>.</p>
      ${reason ? `<p><strong>Motif :</strong> ${reason}</p>` : ""}
      <p>Pour plus d'informations, contactez notre équipe via la page Contact.</p>
      <p>Cordialement,<br/>L'équipe MyMoussaid</p>
    `
  );
}
