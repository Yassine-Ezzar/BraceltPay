exports.validateCard = (cardNumber, expiryDate, cvv) => {
    // Valider le numéro de carte (Luhn Algorithm)
    const luhnCheck = (num) => {
      let sum = 0;
      for (let i = 0; i < num.length; i++) {
        let digit = parseInt(num[i]);
        if ((num.length - i) % 2 === 0) {
          digit *= 2;
          if (digit > 9) digit -= 9;
        }
        sum += digit;
      }
      return sum % 10 === 0;
    };
  
    // Valider la date d'expiration
    const [month, year] = expiryDate.split('/');
    const expiry = new Date(`20${year}`, month - 1);
    const now = new Date();
    if (expiry < now) return false;
  
    // Valider le CVV
    if (cvv.length !== 3 && cvv.length !== 4) return false;
  
    return luhnCheck(cardNumber);
  };