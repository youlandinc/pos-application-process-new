import { Options } from '@/types/options';

export const OPTIONS_BRIDGE_CHANNEL: Option[] = [
  {
    key: Options.ChannelOpt.podcast,
    value: Options.ChannelOpt.podcast,
    label: 'Podcast',
  },
  {
    key: Options.ChannelOpt.tv,
    value: Options.ChannelOpt.tv,
    label: 'TV',
  },
  {
    key: Options.ChannelOpt.lending_tree,
    value: Options.ChannelOpt.lending_tree,
    label: 'Lending Tree',
  },
  {
    key: Options.ChannelOpt.public_transit,
    value: Options.ChannelOpt.public_transit,
    label: 'Public Transit',
  },
  {
    key: Options.ChannelOpt.news_outlet,
    value: Options.ChannelOpt.news_outlet,
    label: 'TV/News Outlet',
  },
  {
    key: Options.ChannelOpt.real_estate_agent,
    value: Options.ChannelOpt.real_estate_agent,
    label: 'Real Estate Agent',
  },
  {
    key: Options.ChannelOpt.search,
    value: Options.ChannelOpt.search,
    label: 'Search(Google/Bing)',
  },
  {
    key: Options.ChannelOpt.nerd_wallet,
    value: Options.ChannelOpt.nerd_wallet,
    label: 'NerdWallet',
  },
  {
    key: Options.ChannelOpt.friend_or_family,
    value: Options.ChannelOpt.friend_or_family,
    label: 'Friend or Family',
  },
  {
    key: Options.ChannelOpt.youtube,
    value: Options.ChannelOpt.youtube,
    label: 'YouTube',
  },
  {
    key: Options.ChannelOpt.credit_karma,
    value: Options.ChannelOpt.credit_karma,
    label: 'Credit Karma',
  },
  {
    key: Options.ChannelOpt.direct_mail,
    value: Options.ChannelOpt.direct_mail,
    label: 'Direct Mail',
  },
  {
    key: Options.ChannelOpt.facebook,
    value: Options.ChannelOpt.facebook,
    label: 'Facebook/Instagram Ad',
  },
  {
    key: Options.ChannelOpt.other,
    value: Options.ChannelOpt.other,
    label: 'Other...',
  },
];

export const OPTIONS_BRIDGE_PROPERTY_NUMBER: Option[] = [
  {
    key: Options.BridgePropertyNumberOpt.zero,
    value: Options.BridgePropertyNumberOpt.zero,
    label: 'none',
  },
  {
    key: Options.BridgePropertyNumberOpt.one_to_four,
    value: Options.BridgePropertyNumberOpt.one_to_four,
    label: '1-4 properties',
  },
  {
    key: Options.BridgePropertyNumberOpt.five_more,
    value: Options.BridgePropertyNumberOpt.five_more,
    label: '5+ properties',
  },
];
