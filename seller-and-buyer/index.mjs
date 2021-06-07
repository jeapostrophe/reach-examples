import * as stdlib from '@reach-sh/stdlib/ALGO.mjs';
import * as backend from './build/index.main.mjs';
import { ask, yesno, done } from '@reach-sh/stdlib/ask.mjs';

(async () => {
  stdlib.setProviderByName('TestNet');
  const fmt = (x) => stdlib.formatCurrency(x, 4);
  const getBalance = async (acc) => fmt(await stdlib.balanceOf(acc));
  const su = stdlib.standardUnit;

  const isSeller = await ask(`Are you Seller?`, yesno);
  const who = isSeller ? 'Seller' : 'Buyer';
  console.log(`You are ${who}`);

  const mnemonic = await ask(`What is your account mnemonic?`, (x => x));
  const acc = await stdlib.newAccountFromMnemonic(mnemonic);

  console.log(`Your balance is ${await getBalance(acc)}`);

  const CommonAPI = (Who) => ({
    reportProjectName: (name) => { console.log(`${Who} reports project name: ${name}.`); },
    reportContractBalance: (bal) => { console.log(`${Who} reports contract balance: ${fmt(bal)}.`); },
    stopWatching: () => { console.log(`${Who} exiting frontend.`); process.exit(0); }
  });

  if (isSeller) {
    const projectName = await ask(`What is your project name?`, (x => x));
    const projectGoal = await ask(`What is your fundraising goal in ${su}?`, (x => x));

    let SellerAPI = {
      ...CommonAPI('Seller'),
      projectName: projectName,
      projectGoal: stdlib.parseCurrency(projectGoal),
      projectDuration: 10
    };

    let ctc = acc.deploy(backend);
    const info = await ctc.getInfo();
    console.log(`Contract Info: ${JSON.stringify(info)}`);
    await backend.Seller(ctc, SellerAPI);
  }

  else {
    const gift = await ask(`What is your gift in ${su}?`, (x => x));

    let BuyerAPI = {
      ...CommonAPI('Buyer'),
      gift: stdlib.parseCurrency(gift),
      reportPayment: (gift) => {console.log(`Buyer paid ${fmt(gift)} ${su}`);}
    };

    const info = await ask(`Paste the contract information:`, JSON.parse);
    let ctc = acc.attach(backend, info);
    await backend.Buyer(ctc, BuyerAPI);
  }

  done();
})();
