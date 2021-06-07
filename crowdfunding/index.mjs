import * as stdlib from '@reach-sh/stdlib/ALGO.mjs';
import * as backend from './build/index.main.mjs';
import { ask, yesno, done } from '@reach-sh/stdlib/ask.mjs';

(async () => {
  const fmt = (x) => stdlib.formatCurrency(x, 4);
  const getBalance = async (acc) => fmt(await stdlib.balanceOf(acc));
  const su = stdlib.standardUnit;

  const role = process.env.role
  const isFundraiser = role === 'Fundraiser' ? true : false;
  console.log(`Your role is ${role}.`)

  const devnet = process.env.type === 'devnet' ? true : false;
  console.log(`Your network type is ${process.env.type}.`)

  let acc = null;
  if (devnet) {
    acc = await stdlib.newTestAccount(stdlib.parseCurrency(1000));
  } else {
    stdlib.setProviderByName('TestNet');
    const mnemonic = await ask(`What is your account mnemonic?`, (x => x));
    acc = await stdlib.newAccountFromMnemonic(mnemonic);
  }

  const abbrAddr = (a) => a.substr(0, 5);
  const yourAddr = (a) => stdlib.addressEq(a, acc.networkAccount) ? `${abbrAddr(a)} (YOU)` : abbrAddr(a);

  console.log(`Your account balance is ${await getBalance(acc)} ${su}.`);

  const CommonAPI = (Who) => ({
    reportMsg: (a, msg) => { console.log(`${yourAddr(a)} ${msg}`); },
    reportProjectName: (name) => { console.log(`${Who} project name is ${name}.`); },
    reportContractBalance: (a, bal) => { console.log(`${yourAddr(a)} reported contract balance of ${fmt(bal)} ${su}.`); },
    reportTimeout: () => { console.log('Contract timed out.') },
    reportTransfer: (a, amt) => { console.log(`Transfer of ${fmt(amt)} to ${abbrAddr(a)}.`); },
    reportYouAreDone: () => { console.log(`${Who}, you are done.`); process.exit(0); }
  });

  if (isFundraiser) {
    const projectGoal = 10;
    console.log(`Your project goal is ${projectGoal} ${su}.`);

    let FundraiserAPI = {
      ...CommonAPI(role),
      projectName: 'Crowd Funding Project',
      projectGoal: stdlib.parseCurrency(projectGoal),
      projectDuration: 100
    };

    console.log(`You are deploying the contract.`);
    let ctc = acc.deploy(backend);
    const info = await ctc.getInfo();
    console.log(`Your contract info is ${JSON.stringify(info)}`);
    await backend.Fundraiser(ctc, FundraiserAPI);
  }

  else {
    const contribution = await ask(`What is your contribution in ${su}?`, (x => x));
    let contribute = true;

    let ContributorAPI = {
      ...CommonAPI(role),
      reportAddress: (a) => { console.log(`Your address starts with ${abbrAddr(a)}.`); },
      getContributionAmount: () => { return stdlib.parseCurrency(contribution); },
      getContributionDirective: () => contribute,
      reportContribution: (a, contribution) => {
        console.log(`${yourAddr(a)} contributed ${fmt(contribution)} ${su} to contract.`)
        if (stdlib.addressEq(a, acc.networkAccount)) {
          contribute = false;
        }
      },
      reportContractExit: () => { console.log('The contract is exiting.') }
    };

    const info = await ask(`What is the contract information?`, JSON.parse);
    let ctc = acc.attach(backend, info);
    await backend.Contributor(ctc, ContributorAPI);
  }

  console.log();
  done();
})();
