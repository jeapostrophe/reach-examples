'reach 0.1';

const CommonAPI = {
  reportMsg: Fun([Address, Bytes(128)], Null),
  reportProjectName: Fun([Bytes(64)], Null),
  reportContractBalance: Fun([Address, UInt], Null),
  reportTimeout: Fun([], Null),
  reportTransfer: Fun([Address, UInt], Null),
  reportYouAreDone: Fun([], Null)
};

const FundraiserAPI = {
  ...CommonAPI,
  projectName: Bytes(64),
  projectGoal: UInt,
  projectDuration: UInt
};

const ContributorAPI = {
  ...CommonAPI,
  reportAddress: Fun([Address], Null),
  getContributionAmount: Fun([], UInt),
  doContribution: Fun([], Bool),
  reportContribution: Fun([Address, UInt], Null),
  reportContractExit: Fun([], Null)
};

export const main = Reach.App(() => {
  const F = Participant('Fundraiser', FundraiserAPI);
  const C = ParticipantClass('Contributor', ContributorAPI);
  deploy();

  F.only(() => {
    const p = {
      name: declassify(interact.projectName),
      goal: declassify(interact.projectGoal),
      duration: declassify(interact.projectDuration)
    }
  });

  F.publish(p);
  F.interact.reportYouAreDone();

  C.only(() => {
    interact.reportAddress(this);
  });

  const [inLoop, sum] = parallelReduce([true, 0])
    .invariant(balance() == sum)
    .while(inLoop && balance() < p.goal)
    .case(C, (() => {
      interact.reportMsg(this, 'PUBLISH_EXPR');
      if (declassify(interact.doContribution())) {
        //interact.reportYouAreDone();
        return { when: true, msg: declassify(interact.getContributionAmount()) }
      } else {
        return { when: false, msg: 1 }
      }
    }),
      ((contribution) => contribution),
      ((contribution) => {
        C.only(() => {
          interact.reportContribution(this, contribution);
          interact.reportContractBalance(this, balance());
        });
        return [true, balance()];
      })
    )
    .timeout(p.duration, () => {
      C.interact.reportTimeout();
      Anybody.publish();
      return [false, sum];
    });

  C.interact.reportTransfer(F, balance());
  transfer(balance()).to(F);
  C.only(() => {
    interact.reportContractBalance(this, balance());
  });
  commit();
  C.interact.reportContractExit();

  exit();
});
