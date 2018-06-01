import { encrypt, compareEncrypted } from '../../libs/utils';
import { NotFoundError, AuthorisationError, RequestError } from '../../libs/errors';
import User from '../../models/user.model';

module.exports = (app) => {

  const create = (req, res) => {
    const submittedUserDetails = req.body;
    encrypt(submittedUserDetails.password)
      .then(encryptedPassword => User.create(Object.assign(submittedUserDetails, {
        password: encryptedPassword,
        daoAccessLevel: 0,
        balance: User.calcBalance(),
        verification: {
          mobile: false,
          email: false,
          balance: false
        },
        status: User.Status.PendingVerification
      })))
      .then(data => {
        delete submittedUserDetails.password;
        return res.ok(submittedUserDetails);
      })
      .catch(res.handleError);
  };

  const auth = (req, res) => {
    User.findByEthAddress(req.params.ethAddress)
      .then(user => {
        if (!user) {
          return res.notFound('User is not found');
        }

        delete user.password;

        return res.ok(user);
      })
      .catch(res.handleError);
  };

  const authByClient = (req, res) => {
    const submittedData = req.body;
    User.findByEmail(submittedData.email)
      .then(user => {
        if (!user) {
          throw new NotFoundError('User is not found');
        }

        return compareEncrypted(submittedData.password, user.password)
          .then(isValidPassword => {
            if (!isValidPassword) {
              throw new RequestError('Invalid user credentials');
            }

            res.ok({ id: user.email, daoAccessLevel: user.daoAccessLevel || 0 });
          })

      })
      .catch(res.handleError);
  };

  app.get('/user/:ethAddress/auth', auth);
  app.post('/user/auth', require('../../middleware/authentication'), authByClient);
  app.post('/user', require('./user.validator'), create);
}