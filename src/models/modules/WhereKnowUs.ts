import { Instance, SnapshotOut, types } from 'mobx-state-tree';
import { ChannelOpt } from '@/types/options';
import { WhereKnowUsData } from '@/types/variable';
import { VariableName } from '@/types/enum';

export const WhereKnowUs = types
  .model({
    reference: types.union(
      types.literal(ChannelOpt.default),
      types.literal(ChannelOpt.podcast),
      types.literal(ChannelOpt.tv),
      types.literal(ChannelOpt.lending_tree),
      types.literal(ChannelOpt.public_transit),
      types.literal(ChannelOpt.news_outlet),
      types.literal(ChannelOpt.real_estate_agent),
      types.literal(ChannelOpt.search),
      types.literal(ChannelOpt.nerd_wallet),
      types.literal(ChannelOpt.friend_or_family),
      types.literal(ChannelOpt.youtube),
      types.literal(ChannelOpt.credit_karma),
      types.literal(ChannelOpt.direct_mail),
      types.literal(ChannelOpt.facebook),
      types.literal(ChannelOpt.other),
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
