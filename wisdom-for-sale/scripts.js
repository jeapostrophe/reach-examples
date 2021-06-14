import * as stdlib from '@reach-sh/stdlib/ALGO.mjs';
import * as backend from './build/index.main.mjs';

const ledger = 'TestNet';
const su = stdlib.standardUnit;
const fmt = (x) => stdlib.formatCurrency(x, 4);
const getAccountBalance = async (acc) => fmt(await stdlib.balanceOf(acc));
const getAccountBalanceFromAddress = async (address) => {
  let acc = await stdlib.connectAccount({ addr: address, AlgoSigner: AlgoSigner });
  return await getAccountBalance(acc);
}
const getSellerAddressSelect = () => document.getElementById('seller-addresses');
const setSellerAddressSelectOptions = (addresses) => {
  let select = getSellerAddressSelect();
  addresses.forEach(function (element, key) { select[key] = new Option(element.address); });
}
const getSellerAddressValue = () => { let select = getSellerAddressSelect(); return select.options[select.selectedIndex].text; }
const setSellerBalanceValue = async () => { document.getElementById('seller-balance').value = await getAccountBalanceFromAddress(getSellerAddressValue()); }
const getSellerWisdomValue = () => document.getElementById('seller-wisdom').value;
const getSellerPriceValue = () => document.getElementById('seller-price').value;
const getSellerContractValue = () => document.getElementById('seller-contract').value;
const setSellerContractValue = (value) => { document.getElementById('seller-contract').value = value; }
const getBuyerAddressSelect = () => document.getElementById('buyer-addresses');
const setBuyerAddressSelectOptions = (addresses) => {
  let select = getBuyerAddressSelect();
  addresses.forEach(function (element, key) { select[key] = new Option(element.address); });
}
const getBuyerAddressValue = () => { let select = getBuyerAddressSelect(); return select.options[select.selectedIndex].text; }
const setBuyerBalanceValue = async () => { document.getElementById('buyer-balance').value = await getAccountBalanceFromAddress(getBuyerAddressValue()); }
const setBuyerWisdomValue = (value) => { document.getElementById('buyer-wisdom').value = value; }
const setBuyerPaymentValue = (value) => { document.getElementById('buyer-payment').value = fmt(value); }

const writeMessage = (msg) => {
  let el = document.getElementById('messages');
  let text = el.value;
  el.value = text + '\n' + msg;
  el.scrollTop = el.scrollHeight;
}

stdlib.setProviderByName(ledger);
stdlib.setSignStrategy('AlgoSigner');

if (AlgoSigner === 'undefined') {
  writeMessage('AlgoSigner is not installed.');
} else {
  writeMessage('AlgoSigner is installed.');
}

AlgoSigner.connect()
  .then((d) => {
    writeMessage('Connected to AlgoSigner.');
  })
  .catch((e) => {
    writeMessage(e);
  })

AlgoSigner.accounts({ ledger: ledger })
  .then((d) => {
    writeMessage('Here are the available wallet addresses:');
    d.forEach(function (element, key) { writeMessage(`${key + 1}. ${element.address}`); });

    setSellerAddressSelectOptions(d);
    (async () => { await setSellerBalanceValue(); })()

    setBuyerAddressSelectOptions(d);
    (async () => { await setBuyerBalanceValue(); })()
  })
  .catch((e) => { writeMessage(e); })

document.addEventListener('click', (event) => {

  // SELLER
  if (event.target.id == 'deploy-contract-btn') {
    event.preventDefault();
    (async () => {

      // SELLER INTERACT
      const sellerApi = {
        price: stdlib.parseCurrency(getSellerPriceValue()),
        wisdom: getSellerWisdomValue(),
        reportReady: () => writeMessage('Seller reports that wisdom is ready for purchase.')
      };

      let address = getSellerAddressValue();
      writeMessage(`Seller address: ${address}.`)
      let acc = await stdlib.connectAccount({ addr: address, AlgoSigner: AlgoSigner });
      writeMessage(`Seller balance: ${await getAccountBalance(acc)} ${su}.`);
      let ctc = acc.deploy(backend);
      let ctcInfo = await ctc.getInfo();
      writeMessage('Seller got contract information:');
      writeMessage(JSON.stringify(ctcInfo, null, 2));
      setSellerContractValue(JSON.stringify(ctcInfo));
      await backend.Seller(ctc, sellerApi);
    })()
  }

  // BUYER
  else if (event.target.id == 'attach-and-buy-btn') {
    event.preventDefault();
    (async () => {

      // BUYER INTERACT
      const buyerApi = {
        reportPayment: (payment) => {
          writeMessage(`Buyer reports payment of ${stdlib.formatCurrency(payment)} ${su} to contract.`);
          setBuyerPaymentValue(payment);
        },
        reportTransfer: (payment) => {
          writeMessage(`Buyer reports transfer of ${stdlib.formatCurrency(payment)} ${su} from contract to seller.`);
          setSellerBalanceValue();
          setBuyerBalanceValue();
        },
        reportWisdom: (wisdom) => {
          writeMessage(`Buyer's new wisdom is "${wisdom}"`);
          setBuyerWisdomValue(wisdom);
        }
      };

      let address = getBuyerAddressValue();
      writeMessage(`Buyer address: ${address}.`)
      let acc = await stdlib.connectAccount({ addr: getBuyerAddressValue(), AlgoSigner: AlgoSigner });
      writeMessage(`Buyer balance: ${await getAccountBalance(acc)} ${su}.`);
      let ctcInfo = JSON.parse(getSellerContractValue());
      let ctc = acc.attach(backend, ctcInfo);
      await backend.Buyer(ctc, buyerApi);
    })()
  }

});

document.addEventListener('change', (event) => {
  if (event.target.id == 'seller-addresses') {
    (async () => { await setSellerBalanceValue(); })()
  } else if (event.target.id == 'buyer-addresses') {
    (async () => { await setBuyerBalanceValue(); })()
  }
})
