'reach 0.1';

const fundraiserApi = {
  projectName: Bytes(64),
  fundraisingGoal: UInt,
  contractDuration: UInt,
  reportContributed: Fun([Address, UInt, UInt, UInt], Null),
  reportDone: Fun([], Null)
};

const contributorApi = {
  contribution: UInt,
  getWillContribute: Fun([], Bool),
  reportAddress: Fun([Address], Null),
  reportBalance: Fun([UInt], Null),
  reportContributed: Fun([Address, UInt, UInt, UInt], Null),
  reportExit: Fun([], Null),
  reportProjectName: Fun([Bytes(64)], Null),
  reportTimeout: Fun([], Null),
  reportTransfer: Fun([UInt, Address], Null)
};

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
        C.only(() => {
          interact.reportContributed(winner, contribution, balance(), lastConsensusTime());
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

    // Replace the following with repayment code.
    const contributions = balance();
    transfer(balance()).to(F);
    C.interact.reportTransfer(contributions, F);

  } else {

    const contributions = balance();
    transfer(balance()).to(F);
    C.interact.reportTransfer(contributions, F);
  }

  commit();
  C.interact.reportBalance(balance());
  C.interact.reportExit();
  exit();
});
