import { encrypt, compareEncrypted, encode, createToken } from '../../libs/utils';
import Client from '../../models/client.model'

const sendResponseWithAuthenticatedUser = (res, user) => {
  user.token = createToken(user.email);

  delete user.password;

  return res.ok(user);
};

module.exports = (app) => {

  const auth = function (req, res) {
    console.log('ClientController.login...');

    const loginDetails = req.body;

    Client.findByEmail(loginDetails.email)
      .then(user => {
        if (!user) {
          return res.notFound('User is not found');
        }

        return compareEncrypted(loginDetails.password, user.password)
          .then(isValidPassword => {
            if (!isValidPassword) {
              return res.badRequest('Invalid email or password');
            }

            sendResponseWithAuthenticatedUser(res, user);
          })
      })
      .catch(res.handleError)
  }

  const create = function (req, res) {
    console.log('ClientController.create...');

    const signUpDetails = req.body;

    return encrypt(signUpDetails.password)
      .then(encryptedPassword => Client.create(Object.assign(signUpDetails, { password: encryptedPassword })))
      .then(() => Client.findByEmail(signUpDetails.email))
      .then(user => sendResponseWithAuthenticatedUser(res, user))
      .catch(res.handleError);
  }

  // init routes
  app.post('/client/auth', auth);
  app.post('/client', require('./client.validator'), create);
}