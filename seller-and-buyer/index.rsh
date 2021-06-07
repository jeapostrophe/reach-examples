'reach 0.1';

const CommonAPI = {
  reportProjectName: Fun([Bytes(64)], Null),
  reportContractBalance: Fun([UInt], Null),
  stopWatching: Fun([], Null)
}

const SellerAPI = {
  ...CommonAPI,
  projectName: Bytes(64),
  projectGoal: UInt,
  projectDuration: UInt
};

const BuyerAPI = {
  ...CommonAPI,
  gift: UInt,
  reportPayment: Fun([UInt], Null)
};

const InspectorAPI = {
  ...CommonAPI,
  reportGift: Fun([UInt], Null)
}

export const main = Reach.App(() => {
  const R = Participant('Seller', SellerAPI);
  const G = ParticipantClass('Buyer', BuyerAPI);
  const I = ParticipantClass('Inspector', InspectorAPI);
  deploy();

  R.only(() => {
    const p = {
      name: declassify(interact.projectName),
      goal: declassify(interact.projectGoal),
      duration: declassify(interact.projectDuration)
    }
  });

  R.publish(p);
  commit();
  R.interact.stopWatching();

  G.only(() => {
    const gift = declassify(interact.gift);
  });

  G.publish(gift).pay(gift);
  transfer(balance()).to(R);
  G.interact.reportPayment(gift);
  commit();

  exit();
});
