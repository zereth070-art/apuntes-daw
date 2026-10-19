import nodeMailjet from "node-mailjet";

function crearCliente() {
  const contraseñaPublica = process.env.MAILJET_API_KEY;
  const contraseñaPrivada = process.env.MAILJET_API_SECRET;
  if (!contraseñaPrivada || !contraseñaPublica) {
    throw new Error("Error a la hora de asignar las keys del mailjet");
  }
  return new nodeMailjet.Client({
    apiKey: contraseñaPublica,
    apiSecret: contraseñaPrivada,
  });
}

export async function enviarVerificacion(emailDestino, nombre, enlace) {
  const emailEnviador = process.env.MAIL_FROM_EMAIL;
  if (!emailEnviador) {
    throw new Error("Error a la hora de asignar el email enviador");
  }

  const cliente = crearCliente();

  await cliente.post("send", { version: "v3.1" }).request({
    Messages: [
      {
        From: { Email: emailEnviador, Name: "PcComponentes" },
        To: [{ Email: emailDestino, Name: nombre }],
        Subject: "Confirma tu registro",
        TextPart: `Hola ${nombre}, confirma tu cuenta aquí: ${enlace}`,
      },
    ],
  });
}

export default crearCliente;
