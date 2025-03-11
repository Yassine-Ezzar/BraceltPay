const validateCard = {
  cardNumber: (number) => {
    const regex = /^\d{16}$/; 
    return regex.test(number.replace(/\s/g, '')); 
  },
  expiryDate: (date) => {
    const regex = /^(0[1-9]|1[0-2])\/\d{2}$/; 
    if (!regex.test(date)) return false;
    const [month, year] = date.split('/');
    const expiry = new Date(`20${year}`, month - 1);
    return expiry > new Date();
  },
  cvv: (cvv) => {
    const regex = /^\d{3,4}$/; 
    return regex.test(cvv);
  },
};

module.exports = validateCard;