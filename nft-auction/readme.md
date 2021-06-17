# NFT Auction

This version of NFT Auction is functionally the same as [the official version](https://github.com/reach-sh/reach-lang/tree/master/examples/nft-auction), but, structurally, it is simpler:

1. It consists of a *Creator* participant and a *Bidder* participantClass.
1. The *Creator* uses the `creatorApi` `interact`, and the *Bidder* uses the `bidderApi` `interact`.
1. By default, Alice plays the role of creator. 
1. Then, Alice returns to the smart contract as a bidder, along with Bob and Claire.
