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
  const me = abbrAddr(acc.getAddress());

  console.log(`${me}: Your account balance is ${await getStandardUnitBalance(acc)} ${su}.`);

  // Fundraiser

  if (isFundraiser) {
    let fundraiserApi = {
      projectName: 'Crowd Funding Project',
      fundraisingGoal: stdlib.parseCurrency(20),
      contractDuration: 200,
      reportDone: () => { console.log(`You are done.`); process.exit(0); }
    };

    console.log(`${me}: Your project goal is ${fmt(fundraiserApi.fundraisingGoal)} ${su}.`);
    let ctc = acc.deploy(backend);
    const info = await ctc.getInfo();
    console.log(`${me}: Your contract deployment time is ${ctcDeployTime(info)}`);
    console.log(`${me}: Your contract info is ${JSON.stringify(info)}`);
    await backend.Fundraiser(ctc, fundraiserApi);
  }

  // Contributor

  else {
    let amount = process.env['amount'];
    if ( amount ) {
      console.log(`${me}: Contribution is ${amount}.`);
    } else {
      amount = await ask(`What is your contribution in ${su}?`, (x => x));
    }
    let contributorApi = {
      contribution: stdlib.parseCurrency(amount),
      willContribute: true,
      getWillContribute: () => contributorApi.willContribute,
      reportAddress: (addr) => { console.log(`${me}: Your address starts with ${abbrAddr(addr)}.`); },
      reportBalance: (balance) => { console.log(`${me}: Contract balance is ${fmt(balance)} ${su}.`); },
      reportContribution: (addr, contribution, balance, time) => {
        console.log(`${me}: ${yourAddr(addr, acc)} contributed ${fmt(contribution)} ${su} at ${time}. Contract balance is ${fmt(balance)} ${su}.`);
        if (stdlib.addressEq(addr, acc.networkAccount)) { contributorApi.willContribute = false; }
      },
      reportExit: () => { console.log(`${me}: The contract is exiting.`); },
      reportProjectName: (name) => { console.log(`${me}: ${Who} project name is ${name}.`); },
      reportTimeout: () => { console.log(`${me}: Contract timed out.`) },
      reportTransfer: (amt, addr) => { console.log(`${me}: Transferred ${fmt(amt)} ${su} to ${abbrAddr(addr)}.`); },
    };

    let info = process.env['contract'];
    if ( info ) {
      console.log(`${me}: Getting contract information from '${info}'`);
      info = JSON.parse(info);
    } else {
      info = await ask(`What is the contract information?`, JSON.parse);
    }
    let ctc = acc.attach(backend, info);
    await backend.Contributor(ctc, contributorApi);
  }

  done();
})();
