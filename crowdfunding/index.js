import * as backend from './build/index.main.mjs';

const stdlib = reachsdk.loadStdlib('ALGO');
const ledger = 'TestNet';
const su = stdlib.standardUnit;
const fmt = (x) => stdlib.formatCurrency(x, 4);
const short = (s) => s.substr(0, 5);
const starAddr = (addr, acc) => stdlib.addressEq(addr, acc.networkAccount) ? `${short(addr)}*` : `${short(addr)} `;
const getAccBal = async (acc) => fmt(await stdlib.balanceOf(acc));
const getContractDeployTime = (info) => su == 'ALGO' ? info.creationRound : info.creation_block;
const getAccBalFromAddr = async (address) => {
  let acc = await stdlib.connectAccount({ addr: address, AlgoSigner: AlgoSigner });
  return await getAccBal(acc);
}
const getFrAddrSel = () => document.getElementById('fr-addrs');
const setFrAddrSelOpts = (addresses) => {
  let select = getFrAddrSel();
  addresses.forEach(function (element, key) { select[key] = new Option(element.address); });
}
const getFrAddrVal = () => { let select = getFrAddrSel(); return select.options[select.selectedIndex].text; }
const setFrBalVal = async () => { document.getElementById('fr-bal').value = await getAccBalFromAddr(getFrAddrVal()); }
const getFrProjectNameVal = () => document.getElementById('fr-project-name').value;
const setFrProjectNameVal = (value) => { document.getElementById('fr-project-name').value = value; }
const getFrGoalVal = () => document.getElementById('fr-goal').value;
const getFrDurationVal = () => document.getElementById('fr-duration').value;
const getFrContractVal = () => document.getElementById('fr-contract').value;
const setFrContractVal = (value) => { document.getElementById('fr-contract').value = value; }

const getCrAddrSel = () => document.getElementById('cr-addrs');
const setCrAddrSelOpts = (addresses) => {
  let select = getCrAddrSel();
  addresses.forEach(function (element, key) { select[key] = new Option(element.address); });
}
const getCrAddrVal = () => { let select = getCrAddrSel(); return select.options[select.selectedIndex].text; }
const setCrBalVal = async () => { document.getElementById('cr-bal').value = await getAccBalFromAddr(getCrAddrVal()); }
const getCrContributionVal = () => document.getElementById('cr-contribution').value;

const getNetworkSel = () => document.getElementById('networks');
const getNetworkVal = () => { let select = getNetworkSel(); return select.options[select.selectedIndex].text; }

const writeMsg = (msg) => {
  let el = document.getElementById('messages');
  let text = el.value;
  el.value = text + '\n' + msg;
  el.scrollTop = el.scrollHeight;
}

setFrProjectNameVal(`Project ${Date.now()}`);

stdlib.setProviderByName(ledger);
stdlib.setSignStrategy('AlgoSigner');

if (AlgoSigner === 'undefined') {
  writeMsg('AlgoSigner is not installed.');
} else {
  writeMsg('AlgoSigner is installed.');
}

if (typeof web3 === 'undefined') {
  writeMsg('MetaMask is not installed.');
} else {
  writeMsg('MetaMask is installed.');
}

// ON CLICK
document.addEventListener('click', (event) => {

  // DEPLOY BTN
  if (event.target.id == 'deploy-btn') {
    event.preventDefault();
    (async () => {

      // FUNDRAISER INTERACT
      let fundraiserApi = {
        projectName: getFrProjectNameVal(),
        fundraisingGoal: stdlib.parseCurrency(getFrGoalVal()),
        contractDuration: getFrDurationVal(),
        reportDone: () => { writeMsg(`You are done.`); }
      };

      let addr = getFrAddrVal();
      writeMsg(`Fundraiser address: ${addr}.`);
      let acc = await stdlib.connectAccount({ addr: addr, AlgoSigner: AlgoSigner });
      writeMsg(`Fundraiser balance: ${await getAccBal(acc)} ${su}.`);
      writeMsg(`Fundraiser goal: ${await getFrGoalVal()} ${su}.`);
      writeMsg('Fundraiser before starting to deploy contract.');
      let ctc = acc.deploy(backend);
      writeMsg('Fundraiser after starting to deploy contract.');
      writeMsg('Fundraiser getting contract information.');
      let ctcInfo = await ctc.getInfo();
      writeMsg('Fundraiser got contract information:');
      writeMsg(JSON.stringify(ctcInfo, null, 2));
      setFrContractVal(JSON.stringify(ctcInfo));
      writeMsg(`Fundraiser contract deploy time (block): ${getContractDeployTime(ctcInfo)}.`);
      writeMsg('Fundraiser before running contract.');
      backend.Fundraiser(ctc, fundraiserApi);
      writeMsg('Fundraiser running contract, but not waiting.');
    })()
  }

  // CONTRIBUTE BTN
  else if (event.target.id == 'contribute-btn') {
    event.preventDefault();
    (async () => {

      // CONTRIBUTOR INTERACT
      let contributorApi = {
        contribution: stdlib.parseCurrency(getCrContributionVal()),
        willContribute: true,
        getWillContribute: () => contributorApi.willContribute,
        reportAddress: (addr) => { writeMsg(`Your address starts with ${short(addr)}.`); },
        reportBalance: (balance) => { writeMsg(`Contract balance is ${fmt(balance)} ${su}.`); },
        reportContribution: (addr, contribution, balance, time) => {
          writeMsg(`${starAddr(addr, acc)} contributed ${fmt(contribution)} ${su} at ${time}. Contract balance is ${fmt(balance)} ${su}.`);
          if (stdlib.addressEq(addr, acc.networkAccount)) { 
            contributorApi.willContribute = false;
            //setCrBalVal();
          }
        },
        reportExit: () => { writeMsg('The contract is exiting.'); },
        reportProjectName: (name) => { writeMsg(`${Who} project name is ${name}.`); },
        reportTimeout: () => { writeMsg('Contract timed out.') },
        reportTransfer: (amt, addr) => { 
          writeMsg(`Transferred ${fmt(amt)} ${su} to ${short(addr)}.`); 
          //setFrBalVal();
        },
      };

      let addr = getCrAddrVal();
      writeMsg(`Contributor address: ${addr}.`);
      let acc = await stdlib.connectAccount({ addr: addr, AlgoSigner: AlgoSigner });
      writeMsg(`Contributor balance: ${await getAccBal(acc)} ${su}.`);
      writeMsg(`Contribution: ${fmt(contributorApi.contribution)} ${su}.`);
      let ctcInfo = JSON.parse(getFrContractVal());
      writeMsg('Contributor before starting to attach to contract.');
      let ctc = acc.attach(backend, ctcInfo);
      writeMsg('Contributor after starting to attach to contract.');
      writeMsg('Contributor before running contract.');
      backend.Contributor(ctc, contributorApi);
      writeMsg('Contributor running contract, but not waiting.');
    })()
  }

  // SAVE BTN
  else if (event.target.id == 'save-btn') {
    let data = JSON.parse(getFrContractVal());
    data.name = getFrProjectNameVal();
    writeMsg('Posting the following contract information to server:')
    writeMsg(JSON.stringify(data, null, 2));
    (async () => {
      try {
        const res = await axios({
          url: `https://hagenhaus.com:3001/api/v1/contracts`,
          method: 'post',
          data: data
        })
      } catch (error) { writeMsg(error) }
    })()
  }

  // CONTRACTS BTN
  else if (event.target.id == 'contracts-tab') {
    getAndDisplayContracts();
  }

  // REFRESH CONTRACTS BTN
  else if (event.target.id == 'refresh-contracts-btn') {
    getAndDisplayContracts();
  }

});

// ON CHANGE
document.addEventListener('change', (event) => {
  if (event.target.id == 'fr-addrs') {
    (async () => { await setFrBalVal(); })()
  }

  else if (event.target.id == 'cr-addrs') {
    (async () => { await setCrBalVal(); })()
  }

  else if (event.target.id == 'networks') {
    const network = getNetworkVal();

    if (network === 'Algorand') {
      (async () => {
        await AlgoSigner.connect({ ledger: ledger })
          .then((d) => {
            writeMsg('Connected to AlgoSigner.');
            (async () => {
              await AlgoSigner.accounts({ ledger: ledger })
                .then((d) => {
                  writeMsg('Here are the available wallet addresses:');
                  d.forEach(function (element, key) { writeMsg(`${key + 1}. ${element.address}`); });

                  setFrAddrSelOpts(d);
                  (async () => { await setFrBalVal(); })()

                  setCrAddrSelOpts(d);
                  (async () => { await setCrBalVal(); })()
                })
                .catch((e) => { writeMsg(e); })
            })()
          })
          .catch((e) => { writeMsg(e); })
      })()
    }
  }
})

function getAndDisplayContracts() {
  (async () => {
    try {
      const res = await axios({
        url: `https://hagenhaus.com:3001/api/v1/contracts`,
        method: 'get'
      })

      //console.log(JSON.stringify(res.data, null, 2));

      let tbody = document.getElementById('contract-table-body');
      tbody.innerHTML = '';
      res.data.forEach(contract => {
        let tdId = document.createElement('td');
        tdId.innerHTML = contract.id;
        let tdName = document.createElement('td');
        tdName.innerHTML = contract.name;
        let tdData = document.createElement('td');
        tdData.innerHTML = `{"ApplicationID":${contract.applicationId},"creationRound":${contract.creationRound},"Deployer":"${contract.deployer}"}`;
        let tr = document.createElement('tr');
        tr.appendChild(tdId);
        tr.appendChild(tdName);
        tr.appendChild(tdData);
        tbody.appendChild(tr);
      })


    } catch (error) { writeMsg(error); }
  })()
}