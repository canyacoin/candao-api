import { NotFoundError, RequestError, AuthorisationError, ServerError, ValidationError, NotAllowedError } from "../libs/errors";

module.exports = (req, res, next) => {
  res.handleError = (err, message = 'Error while executing the operation') => {
    console.log('Error: ', err, ' - Message: ', message);

    if (err instanceof RequestError) {
      return res.badRequest(err.message);
    }

    if (err instanceof ValidationError) {
      return res.badEntity(err.message);
    }

    if (err instanceof NotFoundError) {
      return res.notFound(err.message);
    }

    if (err instanceof AuthorisationError) {
      return res.notAuthorized(err.message);
    }

    if (err instanceof NotAllowedError) {
      return res.forbidden(err.message);
    }

    if (err instanceof ServerError) {
      return res.serverError(err.message);
    }

    return res.status(500).json({ message });
  }

  res.ok = (body = {}, message = 'Ok') => res.status(200).json(Object.assign(body, { message }));
  res.badRequest = (message = 'Bad request') => res.status(400).json({ message });
  res.badEntity = (message = 'Bad entity') => res.status(422).json({ message });
  res.notFound = (message = 'Not found') => res.status(404).json({ message });
  res.notAuthorized = (message = 'Not authorised') => res.status(401).json({ message });
  res.forbidden = (message = 'Not authenticated') => res.status(403).json({ message });
  res.serverError = (message = 'Server error') => res.status(500).json({ message });

  next();
}
