const db = global.fsAdmin.firestore().collection('users');

const isEmailExist = email => db.where('email', '==', email).get();
const isMobileExist = mobile => db.where('mobile', '==', mobile).get();
const isEthAddressExist = ethAddress => db.where('ethAddress', '==', ethAddress).get();

const isNew = (email, mobile, ethAddress) => {
  return Promise.all([isEmailExist(email), isMobileExist(mobile), isEthAddressExist(ethAddress)]).then(checks => {
    const errors = [];

    if (checks[0].docs.length) {
      errors.push({ message: 'Email already exists!' });
    }

    if (checks[1].docs.length) {
      errors.push({ message: 'Mobile already exists!' });
    }

    if (checks[2].docs.length) {
      errors.push({ message: 'Eth address already exists!' });
    }

    return errors;
  });
}

const create = data => db.doc().set(data);

const findByEmail = email => {
  return db.where('email', '==', email)
    .get()
    .then(snapshot => snapshot.docs[0] ? snapshot.docs[0].data() : undefined);
};

const findByEthAddress = ethAddress => {
  return db.where('ethAddress', '==', ethAddress)
    .get()
    .then(snapshot => {
      if (snapshot.docs.length > 1) {
        throw new Error('Multiple accounts found for same eth address. Contact system administrator');
      }

      return snapshot.docs.length ? snapshot.docs[0].data() : undefined;
    });
};

const calcBalance = () => {
  return {
    staked: 0,
    locked: 0,
    lost: 0,
    paid: 0,
    pending: 0,
    withdrawn: 0,
    availableToWithdraw: 0
  }
}

const Status = {
  PendingVerification: 'pending_verification',
  Active: 'active',
  Suspended: 'suspended',
  Cancelled: 'cancelled',
}


export default {
  isEmailExist,
  isMobileExist,
  isEthAddressExist,
  isNew,
  create,
  findByEmail,
  findByEthAddress,
  calcBalance,
  Status
}
