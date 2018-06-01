const db = global.fsAdmin.firestore().collection('clients');

const isEmailExist = (email) => db.where('email', '==', email).get().then(snapshot => snapshot.docs.length);

const isEthAddressExist = (ethAddress) => ethAddress && ethAddress.trim().length ? db.where('ethAddress', '==', ethAddress).get().then(snapshot => snapshot.docs.length) : false;

const isNew = (email, ethAddress) => {
  return Promise.all([isEmailExist(email), isEthAddressExist(ethAddress)]).then(checks => {
    const errors = [];

    if (checks[0]) {
      errors.push({ message: 'Email already exists!' });
    }

    if (checks[1]) {
      errors.push({ message: 'Eth address already exists!' });
    }

    return errors;
  });
};

const create = data => db.doc().set(data);

const findByEmail = email => {
  return db.where('email', '==', email)
    .get()
    .then(snapshot => snapshot.docs[0] ? snapshot.docs[0].data() : undefined);
};

export default {
  isEmailExist,
  isEthAddressExist,
  isNew,
  findByEmail,
  create
}