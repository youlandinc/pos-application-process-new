import { ChannelOpt, PropertyNumberOpt } from '@/types';

export const OPTIONS_BRIDGE_CHANNEL: Option[] = [
  {
    key: ChannelOpt.podcast,
    value: ChannelOpt.podcast,
    label: 'Podcast',
  },
  {
    key: ChannelOpt.tv,
    value: ChannelOpt.tv,
    label: 'TV',
  },
  {
    key: ChannelOpt.lending_tree,
    value: ChannelOpt.lending_tree,
    label: 'Lending tree',
  },
  {
    key: ChannelOpt.public_transit,
    value: ChannelOpt.public_transit,
    label: 'Public transit',
  },
  {
    key: ChannelOpt.news_outlet,
    value: ChannelOpt.news_outlet,
    label: 'TV/News outlet',
  },
  {
    key: ChannelOpt.real_estate_agent,
    value: ChannelOpt.real_estate_agent,
    label: 'Real Estate Agent',
  },
  {
    key: ChannelOpt.search,
    value: ChannelOpt.search,
    label: 'Search(Google/Bing)',
  },
  {
    key: ChannelOpt.nerd_wallet,
    value: ChannelOpt.nerd_wallet,
    label: 'NerdWallet',
  },
  {
    key: ChannelOpt.friend_or_family,
    value: ChannelOpt.friend_or_family,
    label: 'Friend or Family',
  },
  {
    key: ChannelOpt.youtube,
    value: ChannelOpt.youtube,
    label: 'YouTube',
  },
  {
    key: ChannelOpt.credit_karma,
    value: ChannelOpt.credit_karma,
    label: 'Credit karma',
  },
  {
    key: ChannelOpt.direct_mail,
    value: ChannelOpt.direct_mail,
    label: 'Direct mail',
  },
  {
    key: ChannelOpt.facebook,
    value: ChannelOpt.facebook,
    label: 'Facebook/Instagram Ad',
  },
  {
    key: ChannelOpt.other,
    value: ChannelOpt.other,
    label: 'Other...',
  },
];

export const OPTIONS_BRIDGE_PROPERTY_NUMBER: Option[] = [
  {
    key: PropertyNumberOpt.zero,
    value: PropertyNumberOpt.zero,
    label: 'None',
  },
  {
    key: PropertyNumberOpt.one_to_four,
    value: PropertyNumberOpt.one_to_four,
    label: '1-4 properties',
  },
  {
    key: PropertyNumberOpt.five_more,
    value: PropertyNumberOpt.five_more,
    label: '5+ properties',
  },
];
