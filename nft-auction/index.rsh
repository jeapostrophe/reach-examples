'reach 0.1';

const creatorApi = {
  getId: Fun([], UInt),
  reportDone: Fun([], Null)
};

const bidderApi = {
  getAuctionProps: Fun([], Object({ startingBid: UInt, timeout: UInt })),
  getBid: Fun([UInt], Maybe(UInt)),
  reportOwner: Fun([UInt, Address], Null)
};

export const main = Reach.App(() => {

  const C = Participant('Creator', creatorApi);
  const B = ParticipantClass('Bidder', bidderApi);
  deploy();

  C.only(() => { const id = declassify(interact.getId()); });
  C.interact.reportDone();
  C.publish(id);

  var owner = C;
  invariant(balance() == 0);
  while (true) {
    commit();

    B.only(() => {
      interact.reportOwner(id, owner);
      const amOwner = this == owner;
      const { startingBid, timeout } = amOwner ? declassify(interact.getAuctionProps()) : { startingBid: 0, timeout: 0 };
    });
    B.publish(startingBid, timeout).when(amOwner).timeout(false);

    const [timeRemaining, keepGoing] = makeDeadline(timeout);
    const [winner, isFirstBid, currentPrice] = parallelReduce([owner, true, startingBid])
      .invariant(balance() == (isFirstBid ? 0 : currentPrice))
      .while(keepGoing())
      .case(B,
        (() => {
          const mbid = (this != owner && this != winner)
            ? declassify(interact.getBid(currentPrice))
            : Maybe(UInt).None();
          return ({
            when: maybe(mbid, false, ((bid) => bid > currentPrice)),
            msg: fromSome(mbid, 0),
          });
        }),
        ((bid) => bid),
        ((bid) => {
          require(bid > currentPrice);
          transfer(isFirstBid ? 0 : currentPrice).to(winner);
          return [this, false, bid];
        })
      )
      .timeRemaining(timeRemaining());

    transfer(isFirstBid ? 0 : currentPrice).to(owner);

    owner = winner;
    continue;
  };

  commit();
  exit();

});
