
import Client from '../../models/client.model';

const validate = (req, res, next) => {
  const clientDetails = req.body;

  // TODO: validate submittedUserDetails

  Client.isNew(clientDetails.email, clientDetails.ethAddress)
    .then(errors => errors.length ? res.badRequest(errors) : next());
};


module.exports = validate;