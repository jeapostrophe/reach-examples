import { loadStdlib } from '@reach-sh/stdlib';
import * as backend from './build/index.main.mjs';

(async () => {
  const stdlib = await loadStdlib();
  const su = stdlib.standardUnit;
  const fmt = (x) => stdlib.formatCurrency(x, 4);

  const accSeller = await stdlib.newTestAccount(stdlib.parseCurrency(5));
  const accBuyer = await stdlib.newTestAccount(stdlib.parseCurrency(10));

  const ctcSeller = accSeller.deploy(backend);
  const ctcBuyer = accBuyer.attach(backend, ctcSeller.getInfo());

  const sellerApi = {
    price: stdlib.parseCurrency(5),
    wisdom: 'The best things in life are free.',
    reportReady: (price) => console.log(`Seller reports that wisdom is available for purchase at ${fmt(price)} ${su}.`)
  };

  const buyerApi = {
    reportPayment: (payment) => console.log(`Buyer reports payment of ${stdlib.formatCurrency(payment)} ${su} to contract.`),
    reportTransfer: (payment) => console.log(`Buyer reports transfer of ${stdlib.formatCurrency(payment)} ${su} from contract to Seller.`),
    reportWisdom: (wisdom) => console.log(`Buyer reports new wisdom: "${wisdom}"`)
  };

  await Promise.all([
    backend.Seller(ctcSeller, sellerApi),
    backend.Buyer(ctcBuyer, buyerApi)
  ]);
})();
