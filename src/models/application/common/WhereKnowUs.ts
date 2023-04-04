import { Instance, SnapshotOut, types } from 'mobx-state-tree';
import { Options } from '@/types/options';
import { WhereKnowUsData } from '@/types/application/bridge';
import { VariableName } from '@/types/enum';

export const WhereKnowUs = types
  .model({
    reference: types.union(
      types.literal(Options.ChannelOpt.default),
      types.literal(Options.ChannelOpt.podcast),
      types.literal(Options.ChannelOpt.tv),
      types.literal(Options.ChannelOpt.lending_tree),
      types.literal(Options.ChannelOpt.public_transit),
      types.literal(Options.ChannelOpt.news_outlet),
      types.literal(Options.ChannelOpt.real_estate_agent),
      types.literal(Options.ChannelOpt.search),
      types.literal(Options.ChannelOpt.nerd_wallet),
      types.literal(Options.ChannelOpt.friend_or_family),
      types.literal(Options.ChannelOpt.youtube),
      types.literal(Options.ChannelOpt.credit_karma),
      types.literal(Options.ChannelOpt.direct_mail),
      types.literal(Options.ChannelOpt.facebook),
      types.literal(Options.ChannelOpt.other),
    ),
  })
  .views((self) => {
    return {
      get checkIsValid() {
        return !!self.reference;
      },
    };
  })
  .actions((self) => {
    return {
      changeFieldValue<K extends keyof typeof self>(
        key: K,
        value: (typeof self)[K],
      ) {
        self[key] = value;
      },
      getPostData(): Variable<WhereKnowUsData> {
        return {
          name: VariableName.whereKnowUs,
          type: 'json',
          value: {
            reference: self.reference,
          },
        };
      },
      injectServerData(value: WhereKnowUsData) {
        self.reference = value.reference;
      },
    };
  });

export type IWhereKnowUs = Instance<typeof WhereKnowUs>;
export type SWhereKnowUs = SnapshotOut<typeof WhereKnowUs>;
