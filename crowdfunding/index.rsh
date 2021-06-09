'reach 0.1';

const fundraiserApi = {
  projectName: Bytes(64),
  projectGoal: UInt,
  projectDuration: UInt,
  cb_done: Fun([], Null)
};

const contributorApi = {
  contribution: UInt,
  contribute: Fun([], Bool),
  cb_address: Fun([Address], Null),
  cb_contributed: Fun([Address, UInt, UInt, UInt], Null),
  cb_exiting: Fun([], Null),
  cb_timeout: Fun([], Null),
  cb_projectName: Fun([Bytes(64)], Null),
  cb_transferred: Fun([UInt, Address, UInt], Null)
};

export const main = Reach.App(() => {
  const F = Participant('Fundraiser', fundraiserApi);
  const C = ParticipantClass('Contributor', contributorApi);
  deploy();

  F.only(() => {
    const p = {
      name: declassify(interact.projectName),
      goal: declassify(interact.projectGoal),
      duration: declassify(interact.projectDuration)
    }
  });

  F.publish(p);
  F.interact.cb_done();

  const [inLoop, sum] = parallelReduce([true, 0])
    .invariant(balance() == sum)
    .while(inLoop && balance() < p.goal)
    .case(C, (() => {
      if (declassify(interact.contribute())) {
        return { when: true, msg: declassify(interact.contribution) }
      } else {
        return { when: false, msg: 0 }
      }
    }),
      ((contribution) => contribution),
      ((contribution) => {
        const winner = this;
        C.only(() => {
          interact.cb_contributed(winner, contribution, balance(), lastConsensusTime());
        });
        return [true, balance()];
      })
    )
    .timeout(p.duration, () => {
      C.interact.cb_timeout();
      Anybody.publish();
      return [false, sum];
    });

  const contributions = balance();
  transfer(balance()).to(F);
  commit();
  C.interact.cb_transferred(contributions, F, balance());
  C.interact.cb_exiting();
  exit();
});
