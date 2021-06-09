import { loadStdlib } from '@reach-sh/stdlib';
import * as backend from './build/index.main.mjs';
import { ask, yesno, done } from '@reach-sh/stdlib/ask.mjs';

(async () => {
  const stdlib = await loadStdlib();
  const fmt = (au) => stdlib.formatCurrency(au, 4);
  const getStandardUnitBalance = async (acc) => fmt(await stdlib.balanceOf(acc));
  const su = stdlib.standardUnit;
  const role = process.env.role
  const isFundraiser = role === 'Fundraiser' ? true : false;
  const devnet = process.env.type === 'devnet' ? true : false;
  const abbrAddr = (addr) => addr.substr(0, 5);
  const yourAddr = (addr, acc) => stdlib.addressEq(addr, acc.networkAccount) ? `${abbrAddr(addr)}*` : `${abbrAddr(addr)} `;
  const ctcDeployTime = (info) => su == 'ALGO' ? info.creationRound : info.creation_block;

  console.log(`Your role is ${role}.`)
  console.log(`Your network type is ${process.env.type}.`)

  // account

  let acc = null;
  if (devnet) {
    acc = await stdlib.newTestAccount(stdlib.parseCurrency(1000));
  } else {
    stdlib.setProviderByName('TestNet');
    const mnemonic = await ask(`What is your account mnemonic?`, (x => x));
    acc = await stdlib.newAccountFromMnemonic(mnemonic);
  }

  console.log(`Your account balance is ${await getStandardUnitBalance(acc)} ${su}.`);

  // Fundraiser

  if (isFundraiser) {
    let fundraiserApi = {
      projectName: 'Crowd Funding Project',
      projectGoal: stdlib.parseCurrency(20),
      contractDuration: 10000,
      put_done: () => { console.log(`You are done.`); process.exit(0); }
    };

    console.log(`Your project goal is ${fmt(fundraiserApi.projectGoal)} ${su}.`);
    let ctc = acc.deploy(backend);
    const info = await ctc.getInfo();
    console.log(`Your contract deployment time is ${ctcDeployTime(info)}`);
    console.log(`Your contract info is ${JSON.stringify(info)}`);
    await backend.Fundraiser(ctc, fundraiserApi);
  }

  // Contributor

  else {
    let contributorApi = {
      contribution: stdlib.parseCurrency(await ask(`What is your contribution in ${su}?`, (x => x))),
      willContribute: true,
      get_contribute: () => contributorApi.willContribute,
      put_address: (addr) => { console.log(`Your address starts with ${abbrAddr(addr)}.`); },
      put_balance: (balance) => {console.log(`Contract balance is ${fmt(balance)} ${su}.`);},
      put_contributed: (addr, contribution, balance, time) => {
        console.log(`${yourAddr(addr, acc)} contributed ${fmt(contribution)} ${su} at ${time}. Contract balance is ${fmt(balance)} ${su}.`);
        if (stdlib.addressEq(addr, acc.networkAccount)) {
          contributorApi.willContribute = false;
        }
      },
      put_exiting: () => { console.log('The contract is exiting.'); },
      put_timeout: () => { console.log('Contract timed out.') },
      put_projectName: (name) => { console.log(`${Who} project name is ${name}.`); },
      put_transferred: (contributions, addr) => { console.log(`Transferred ${fmt(contributions)} ${su} to ${abbrAddr(addr)}.`); },
    };

    const info = await ask(`What is the contract information?`, JSON.parse);
    let ctc = acc.attach(backend, info);
    await backend.Contributor(ctc, contributorApi);
  }

  done();
})();
