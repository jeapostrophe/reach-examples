'reach 0.1';
'use strict';

const sellerAPI = {
  price: UInt,
  wisdom: Bytes(128),
  reportReady: Fun([UInt], Null)
};

const buyerAPI = {
  reportPayment: Fun([UInt], Null),
  reportTransfer: Fun([UInt], Null),
  reportWisdom: Fun([Bytes(128)], Null)
};

export const main = Reach.App(() => {
  const S = Participant('Seller', sellerAPI);
  const B = Participant('Buyer', buyerAPI);
  deploy();

  S.only(() => { const price = declassify(interact.price); });
  S.publish(price);
  S.only(() => {interact.reportReady(price);})
  commit();
 
  B.pay(price);
  B.only(() => { interact.reportPayment(price); });
  commit();
 
  S.only(() => { const wisdom = declassify(interact.wisdom); });
  S.publish(wisdom);
  transfer(price).to(S);
  commit();

  B.only(() => { interact.reportTransfer(price); });
  B.only(() => { interact.reportWisdom(wisdom); });
  exit();
});