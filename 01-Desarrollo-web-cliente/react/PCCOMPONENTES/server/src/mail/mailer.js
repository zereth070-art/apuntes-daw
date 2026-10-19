import Mailjet from "node-mailjet";

/**
 * Email de registro. API v3 de MailJet usando su formato plano:
 *   POST https://api.mailjet.com/v3/send
 *   { FromEmail, FromName, Recipients, Subject, Text-part, ... }
 * (documentado en https://dev.mailjet.com/openapi/openapi-mailjet/send-emails/postsendv3)
 *
 * El cliente se crea DENTRO de la función: si faltan claves en .env, el
 * servidor debe arrancar igual y solo se omite el email.
 */
export async function enviarEmailBienvenida(usuario) {
  const apiKey = process.env.MAILJET_PUBLIC_KEY;
  const apiSecret = process.env.MAILJET_PRIVATE_KEY;
  const desde = process.env.MAILJET_FROM;

  if (!apiKey || !apiSecret || !desde) {
    console.warn(
      "[mail] faltan MAILJET_PUBLIC_KEY / MAILJET_PRIVATE_KEY / MAILJET_FROM en .env: no se envía el email",
    );
    return;
  }

  const cliente = new Mailjet({ apiKey, apiSecret });

  await cliente.post("send", { version: "v3" }).request({
    FromEmail: desde,
    FromName: "PCCOMPONENTES",
    Recipients: [{ Email: usuario.email, Name: usuario.nombre }],
    Subject: "Confirma tu registro en PCCOMPONENTES",
    "Text-part": `Hola ${usuario.nombre}, tu cuenta se ha creado correctamente. Revisa tu bandeja para confirmarla.`,
  });
  console.log(`[mail] email enviado a ${usuario.email}`);
}
