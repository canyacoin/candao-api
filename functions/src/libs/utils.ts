import * as JWT from 'jwt-simple';
import { AuthorisationError } from './errors';

const bcrypt = require('bcrypt');
const saltRounds = 10;

export const encode = str => new Buffer(str).toString('base64');
export const decode = str => new Buffer(str, 'base64').toString('ascii');

export const encrypt = plainText => new Promise((resolve, reject) => {
  bcrypt.genSalt(saltRounds, function (saltErr, salt) {
    if (saltErr) {
      reject(saltErr);
    }

    bcrypt.hash(plainText, salt, (err, hash) => err ? reject(err) : resolve(hash));
  });
});

export const compareEncrypted = (plainText, hash) => new Promise((resolve, reject) => {
  bcrypt.compare(plainText, hash, (err, res) => err ? reject(err) : resolve(res));
});

export const createToken = (id, TOKEN_SECRET = global.configs.TOKEN_SECRET) => {
  return JWT.encode({
    id: encode(id),
    timestamp: Date.now(),
  }, TOKEN_SECRET);
}

export const decryptToken = (token, TOKEN_SECRET = global.configs.TOKEN_SECRET) => {
  return new Promise((resolve, reject) => {
    try {
      const payload = JWT.decode(token, global.configs.TOKEN_SECRET);

      // TODO: calc token expiry and return error: new AuthorisationError('Expired authentication token')
      
      payload.id = decode(payload.id);
      console.log('payload: ', payload);
      resolve(payload);
    }
    catch (err) {
      reject(new AuthorisationError('Invalid authentication token'));
    }
  });
};

