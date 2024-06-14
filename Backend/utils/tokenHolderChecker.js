const { isAddress, checkAddressCheckSum } = require('web3-validator')

const tokenHolders = async (

  baseAddressHolders,
  quoteAddressHolders,

) => {
  let i = 0;
  let base_address_holder = baseAddressHolders[baseAddressHolders.length - 1];
  let quote_address_holder = quoteAddressHolders[quoteAddressHolders.length - 1];
  // const baseTokenDetails = await fetchTokenDetails(web3, tokens[0]);
  // const quoteTokenDetails = await fetchTokenDetails(web3, tokens[1]);

  // if (baseAddressHolders.length > 1) {
  //   while (
  //     isAddress(base_address_holder)
  //   ) {
  //     console.log(isAddress(base_address_holder), base_address_holder)
  //     i++;
  //     base_address_holder = baseAddressHolders[i];
  //   }
  // }

  // let j = 0;
  // if (quoteAddressHolders.length > 1) {
  //   while (
  //     isAddress(quote_address_holder)
  //   ) {
  //     j++;
  //     quote_address_holder = quoteAddressHolders[j];
  //   }
  // }


  return {
    base_address_holder,
    quote_address_holder,
  };
};

module.exports = { tokenHolders };