const { sendEmail } = require("../utils/handleEmail");
const { usersModel } = require("../models");
const { updateUser } = require("../controllers/auth");
const { handleHttpError } = require("../utils/handleErrors");

const sendResetPasswordEmail = async (req, res) => {
  const email = req.body.email;
  const token = req.body.token;
  const userName = req.body.userName;
  const userId = req.body.userId;
  const url = req.body.url;

  try {
    const reqUpdateUser = {
      params: {
        id: userId,
      },
      body: {
        secretToken: token,
      },
    };

    const resUpdateUser = {
      send: (data) => {},
      status: (statusCode) => {
        console.log(`Status Code: ${statusCode}`);
      },
    };

    const updateUserSecretToken = await updateUser(
      reqUpdateUser,
      resUpdateUser
    );

    if (updateUserSecretToken === 200) {
      const send_to = email;
      const sent_from = process.env.EMAIL_USER;
      const reply_to = email;
      const subject = "HeliApp - Reset Password";

      const message = `
            <p>¡Hola ${userName}!</p>
            <p>Recibes este correo porque has solicitado restablecer tu contraseña en HeliApp.</p>
            <p>Para completar este proceso, sigue los siguientes pasos:</p>
            <ol>
                <li>Haz clic en el siguiente enlace:</li>
                <a href="${url}/resetPassword">${url}/resetPassword</a>
                <li>Ingresa el siguiente token cuando se te solicite: <strong>${token}</strong></li>
            </ol>
            <p>Si no has solicitado restablecer tu contraseña, puedes ignorar este correo.</p>
            `;

      await sendEmail(subject, message, send_to, sent_from, reply_to);

      res.status(200).json({ success: true, message: "Email Sent" });
    } else {
      res.status(500);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const sendIntermittentFastingNotificationEmail = async (req, res) => {
  const email = req.body.email;
  const userName = req.body.userName;

  try {
    const send_to = email;
    const sent_from = process.env.EMAIL_USER;
    const reply_to = email;
    const subject = "Falta 1 hora para que termine tu ayuno intermitente!";

    const message = `
            <p>¡Hola ${userName}!</p>
            <p>Recibes este correo porque has programado un ayuno intermitente y ya solo falta una hora para que finalice!.</p>
            <p>Muchos exitos, ya casi lo logras!</p>
            <p>Si no has programado ningun ayuno, puedes ignorar este correo.</p>
            `;

    await sendEmail(subject, message, send_to, sent_from, reply_to);
    res.status(200);
  } catch (error) {
    res.status(500);
  }
};

const sendRelationshipRequestEmail = async (req) => {
  const email = req.body.email;
  const userNameUser = req.body.userNameUser;
  const userNameNutritionist = req.body.userNameNutritionist;
  const url = req.body.url;

  try {
    const send_to = email;
    const sent_from = process.env.EMAIL_USER;
    const reply_to = email;
    const subject = userNameUser + " solicito que seas su nutricionista!";

    const message = `
            <p>¡Hola <strong>${userNameNutritionist}</strong>!</p>
            <p>Recibes este correo porque <strong>${userNameUser}</strong> te ha solicitado que seas su nutricionista.</p>
            <p>Podras aceptar/rechazar la solitud desde la App o ingresando a traves del siguiente link:</p>
            <a href="${url}">${url}</a>
            <p>Saludos!</p>
            <p>Equipo Heliapp</p>
            `;

    await sendEmail(subject, message, send_to, sent_from, reply_to);
  } catch (error) {
    console.log(error);
  }
};

const validateToken = async (req, res) => {
  try {
    const data = await usersModel.findOne({ secretToken: req.params.token });
    res.send({ data });
  } catch (e) {
    handleHttpError(res, "ERROR_VALIDATE_TOKEN", 500);
  }
};

module.exports = {
  sendResetPasswordEmail,
  sendIntermittentFastingNotificationEmail,
  sendRelationshipRequestEmail,
  validateToken,
};
