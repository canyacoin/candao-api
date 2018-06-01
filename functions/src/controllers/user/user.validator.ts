
import User from '../../models/user.model';

const validate = (req, res, next) => {
  const submittedData = req.body;

  // TODO: validate submittedUserDetails

  return User.isNew(submittedData.email, submittedData.mobile, submittedData.ethAddress)
    .then(errors => errors.length ? res.badRequest({ errors }) : next());
}


module.exports = validate;