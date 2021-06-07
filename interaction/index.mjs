import { loadStdlib } from '@reach-sh/stdlib';
import * as backend from './build/index.main.mjs';
(async () => {
  const stdlib = await loadStdlib();
  const balance = stdlib.parseCurrency(100);
  const accSeller = await stdlib.newTestAccount(balance);
  const accBuyer = await stdlib.newTestAccount(balance);
  const ctcSeller = accSeller.deploy(backend);
  const ctcBuyer = accBuyer.attach(backend, ctcSeller.getInfo());

  const CommonApi = (Who) => ({
    reportReady: () => { console.log(`${Who}: I am ready to bargain.`); }
  });

  const SellerApi = {
    ...CommonApi('Seller')
  };

  const BuyerApi = {
    ...CommonApi('Buyer')
  };

  await Promise.all([
    backend.Seller(ctcSeller, SellerApi),
    backend.Buyer(ctcBuyer, BuyerApi)
  ]);
})();
