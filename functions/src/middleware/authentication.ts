import { decryptToken } from '../libs/utils';
import { NotFoundError } from '../libs/errors';
import Client from '../models/client.model';

module.exports = function (req, res, next) {
  console.log('Authentication...');
  console.log('url: ', req.url);
  console.log('ReqParams: ', req.params);

  const credentials = req.headers.authorization;

  if (!credentials) {
    return res.notAuthorized('Missing user credentials');
  }

  const token = credentials.split(" ")[1];

  decryptToken(token)
    .then((payload: any) => Client.findByEmail(payload.id))
    .then(client => {
      if (!client) {
        throw new NotFoundError('Client is not found');
      }

      next();
    })
    .catch(res.handleError);
};
