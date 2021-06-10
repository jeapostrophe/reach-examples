'reach 0.1';

const fundraiserApi = {
  projectName: Bytes(64),
  fundraisingGoal: UInt,
  contractDuration: UInt,
  reportDone: Fun([], Null)
};

const contributorApi = {
  contribution: UInt,
  getWillContribute: Fun([], Bool),
  reportAddress: Fun([Address], Null),
  reportBalance: Fun([UInt], Null),
  reportContribution: Fun([Address, UInt, UInt, UInt], Null),
  reportExit: Fun([], Null),
  reportProjectName: Fun([Bytes(64)], Null),
  reportTimeout: Fun([], Null),
  reportTransfer: Fun([UInt, Address], Null)
};

const myFromMaybe = (amt) => fromMaybe(amt, (() => 0), ((x) => x));

export const main = Reach.App(() => {
  const F = Participant('Fundraiser', fundraiserApi);
  const C = ParticipantClass('Contributor', contributorApi);
  deploy();

  F.only(() => {
    const p = {
      name: declassify(interact.projectName),
      goal: declassify(interact.fundraisingGoal),
      duration: declassify(interact.contractDuration)
    }
  });

  F.publish(p);
  F.interact.reportDone();

  const ctMap = new Map(UInt);
  const [inLoop, sum, timeout] = parallelReduce([true, 0, false])
    .invariant(balance() == sum)
    .while(inLoop && balance() < p.goal)
    .case(C, (() => {
      if (declassify(interact.getWillContribute())) {
        return { when: true, msg: declassify(interact.contribution) }
      } else {
        return { when: false, msg: 0 }
      }
    }),
      ((contribution) => contribution),
      ((contribution) => {
        const winner = this;
        ctMap[winner] = myFromMaybe(ctMap[winner]) + contribution;
        C.only(() => {
          interact.reportContribution(winner, contribution, balance(), lastConsensusTime());
        });
        return [true, balance(), false];
      })
    )
    .timeout(p.duration, () => {
      Anybody.publish();
      return [false, sum, true];
    });

  if (timeout) {
    C.interact.reportTimeout();
    var [bal] = [balance()];
    invariant(balance() == bal && bal == ctMap.sum());
    while (bal > 0) {
      commit();
      C.only(() => {
        const didContribute = myFromMaybe(ctMap[this]) > 0;
      });
      C.publish().when(didContribute).timeout(false);
      const refund = myFromMaybe(ctMap[this]);
      transfer(refund).to(this);
      C.interact.reportTransfer(refund, C);
      bal = bal - refund;
      continue;
    }
  }

  else {
    const contributions = balance();
    transfer(balance()).to(F);
    C.interact.reportTransfer(contributions, F);
  }

  commit();
  C.interact.reportBalance(balance());
  C.interact.reportExit();
  exit();
});
