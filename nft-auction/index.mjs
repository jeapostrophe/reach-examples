import { loadStdlib } from '@reach-sh/stdlib';
import * as backend from './build/index.main.mjs';

(async () => {
  const stdlib = await loadStdlib();
  const timeoutK = stdlib.connector === 'ALGO' ? 1 : 3;
  const startingBalance = stdlib.parseCurrency(10);
  const fmt = (x) => stdlib.formatCurrency(x, 4);

  const creatorApi = (who) => {
    return {
      getId: () => {
        const id = stdlib.randomUInt();
        console.log(`${who} starts auction for NFT #${id}`);
        return id;
      },
      reportDone: () => { console.log(`${who} is finished acting as creator.`);}
    }
  }

  const auctionProps = {
    ' Alice': { startingBid: stdlib.parseCurrency(0), timeout: timeoutK * 3 },
    '   Bob': { startingBid: stdlib.parseCurrency(1), timeout: timeoutK * 3 },
    'Claire': { startingBid: stdlib.parseCurrency(3), timeout: timeoutK * 4 }
  };

  const bids = {
    ' Alice': { maxBid: stdlib.parseCurrency(7) },
    '   Bob': { maxBid: stdlib.parseCurrency(40) },
    'Claire': { maxBid: stdlib.parseCurrency(20) }
  };

  const trades = {
    ' Alice': 0,
    '   Bob': 0,
    'Claire': 0
  };

  const bidderApi = (acc, who) => {
    return {
      getAuctionProps: (() => {
        console.log(`${who} starts the bidding at ${fmt(auctionProps[who].startingBid)}`);
        return auctionProps[who];
      }),
      getBid: (price) => {
        if (price < bids[who].maxBid) {
          const bid = stdlib.add(price, stdlib.parseCurrency(1));
          console.log(`${who} tries to bid ${fmt(bid)} (based on price: ${fmt(price)})`);
          return ['Some', bid];
        } else {
          return ['None', null];
        }
      },
      reportOwner: ((id, owner) => {
        if (stdlib.addressEq(owner, acc)) {
          console.log(`\n${who} owns it\n`);
          if (trades[who] == 2) { console.log(`${who} stops`); process.exit(0); }
          else { trades[who] += 1; }
        }
      }),
    };
  };

  const accAlice = await stdlib.newTestAccount(startingBalance);
  const accBob = await stdlib.newTestAccount(startingBalance);
  const accClaire = await stdlib.newTestAccount(startingBalance);

  const ctc = accAlice.deploy(backend);

  await Promise.all([
    backend.Creator(ctc, creatorApi(' Alice')),
    backend.Bidder(accAlice.attach(backend, ctc.getInfo()), bidderApi(accAlice, ' Alice')),
    backend.Bidder(accBob.attach(backend, ctc.getInfo()), bidderApi(accBob, '   Bob')),
    backend.Bidder(accClaire.attach(backend, ctc.getInfo()), bidderApi(accClaire, 'Claire'))
  ]);
})();
