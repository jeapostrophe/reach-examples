'reach 0.1';

const CommonApi = {
  reportReady: Fun([], Null)
};

const SellerApi = {
  ...CommonApi
};

const BuyerApi = {
  ...CommonApi
};

export const main = Reach.App(() => {
  const S = Participant('Seller', SellerApi);
  const B = Participant('Buyer', BuyerApi);
  deploy();
  each([S, B], () => {
    interact.reportReady(); 
  });
  exit();
});
