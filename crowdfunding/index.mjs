import * as stdlib from '@reach-sh/stdlib/ALGO.mjs';
import * as backend from './build/index.main.mjs';
import { ask, yesno, done } from '@reach-sh/stdlib/ask.mjs';

(async () => {
  const fmt = (x) => stdlib.formatCurrency(x, 4);
  const getBalance = async (acc) => fmt(await stdlib.balanceOf(acc));
  const su = stdlib.standardUnit;

  const role = process.env.role
  const isFundraiser = role === 'Fundraiser' ? true : false;
  console.log(`Role:     ${role}`)

  const devnet = process.env.type === 'devnet' ? true : false;
  console.log(`Type:     ${process.env.type}`)

  let acc = null;
  console.log(`Info:     Getting account ...`);
  if (devnet) {
    acc = await stdlib.newTestAccount(stdlib.parseCurrency(1000));
  } else {
    stdlib.setProviderByName('TestNet');
    const mnemonic = await ask(`Question: What is your account mnemonic?`, (x => x));
    acc = await stdlib.newAccountFromMnemonic(mnemonic);
  }

  console.log(`Info:     Getting account balance ...`);
  console.log(`Balance:  ${await getBalance(acc)}`);

  const CommonAPI = (Who) => ({
    reportMsg: (address, msg) => { console.log(`Interact: ${address.substr(0, 5)} messsage: ${msg}`); },
    reportProjectName: (name) => { console.log(`Interact: ${Who} reports project name: ${name}.`); },
    reportContractBalance: (address, bal) => { console.log(`Interact: ${address.substr(0, 5)} reports contract balance: ${fmt(bal)}.`); },
    reportTimeout: () => { console.log('Interact: Contract timed out.') },
    reportTransfer: (address, amt) => { console.log(`Interact: ${Who} reports transfer of ${fmt(amt)} to ${address.substr(0, 5)}.`); },
    reportYouAreDone: () => { console.log(`Interact: The backend said, "${Who}, you are done."`); process.exit(0); }
  });

  if (isFundraiser) {
    const projectGoal = 10;
    console.log(`Goal:     ${projectGoal}`);

    let FundraiserAPI = {
      ...CommonAPI(role),
      projectName: 'Crowd Funding Project',
      projectGoal: stdlib.parseCurrency(projectGoal),
      projectDuration: 100
    };

    console.log(`Info:     Deploying contract ...`);
    let ctc = acc.deploy(backend);
    const info = await ctc.getInfo();
    console.log(`Contract: ${JSON.stringify(info)}`);
    await backend.Fundraiser(ctc, FundraiserAPI);
  }

  else {
    const contribution = await ask(`Question: What is your contribution in ${su}?`, (x => x));
    let contribute = true;

    let ContributorAPI = {
      ...CommonAPI(role),
      reportAddress: (address) => { console.log(`Interact: ${address.substr(0, 5)} is the start of your address.`); },
      getContributionAmount: () => { return stdlib.parseCurrency(contribution); },
      doContribution: () => {
        if (contribute == true) { contribute = false; return true; }
        else { return false; }
      },
      reportContribution: (address, contribution) => { console.log(`Interact: ${address.substr(0, 5)} paid ${fmt(contribution)} ${su} to contract.`); },
      reportContractExit: () => { console.log('Interact: The contract is exiting.') }
    };

    const info = await ask(`Question: What is the contract information?`, JSON.parse);
    let ctc = acc.attach(backend, info);
    await backend.Contributor(ctc, ContributorAPI);
  }

  console.log();
  done();
})();
