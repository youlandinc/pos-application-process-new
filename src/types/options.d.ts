export declare namespace Options {
  enum ChannelOpt {
    default = '',
    podcast = 'podcast',
    tv = 'tv',
    lending_tree = 'lending_tree',
    public_transit = 'public_transit',
    news_outlet = 'news_outlet',
    real_estate_agent = 'real_estate_agent',
    search = 'search',
    nerd_wallet = 'nerd_wallet',
    friend_or_family = 'friend_or_family',
    youtube = 'youtube',
    credit_karma = 'credit_karma',
    direct_mail = 'direct_mail',
    facebook = 'facebook_ad',
    other = 'other',
  }

  enum BridgePropertyNumberOpt {
    default = '',
    zero = 'none',
    one_to_four = 'one_to_four',
    five_more = 'five_more',
  }

  enum PipelineLicenseTypeOpt {
    default = '',
    nmls = 'nmls',
    dre_broker = 'dre_broker',
    dre_sale_person = 'dre_sale_person',
  }

  enum ProcessOpt {
    researching = 'researching',
    makingOffer = 'making_offer',
    signedPurchase = 'signed_purchase',
    default = '',
  }

  enum OfferOpt {
    preApproval = 'pre_approval',
    isAfford = 'is_afford',
    realEstate = 'real_estate',
    default = '',
  }

  enum PurchaseTimeOpt {
    quarter = 'quarter',
    half = 'half',
    year = 'year',
    notSure = 'not_sure',
    default = '',
  }

  enum OccupancyOpt {
    primaryResidence = 'primary_residence',
    secondHome = 'second_home',
    investmentProperty = 'investment_property',
    default = '',
  }

  enum PropertyOpt {
    default = '',
    singleFamily = 'single_family',
    townhouse = 'townhouse',
    condo = 'condo',
    twoToFourFamily = 'two_to_four_family',
  }

  enum UnitOpt {
    default = 0,
    twoUnits = 2,
    threeUnits = 3,
    fourUnits = 4,
  }

  enum RelationshipOpt {
    unmarried = 'unmarried',
    married = 'married',
    legallySeparated = 'legally_separated',
    default = '',
  }

  enum PropPlanOpt {
    sellIt = 'sell_it',
    keepIt = 'keep_it',
    default = '',
  }

  enum PropTitleOpt {
    byYourself = 'by_yourself',
    jointlyWithSpouse = 'jointly_with_spouse',
    jointlyWithAnotherPerson = 'jointly_with_another_person',
    default = '',
  }

  enum PropPurposeOpt {
    default = '',
    secondHome = 'second_home',
    investment = 'investment_property',
  }

  enum DenialReason {
    dti_too_high = 'dti_too_high',
    na = 'na',
    missing_income = 'missing_income',
    dti_not_calculable = 'dti_not_calculable',
    no_available_products = 'no_available_products',
    missing_debts = 'missing_debts',
  }

  enum DebtWrongReasonOpt {
    had_paid = 'had_paid',
    default = '',
    co_signer_pays = 'co_signer_pays',
    employer_pays = 'employer_pays',
  }

  enum WhyRefinanceOpt {
    lowerPayment = 'lower_my_monthly_payment',
    cashOut = 'take_cash_out',
    payoffExist = 'payoff_existing',
    consolidateDebts = 'consolidate_debts',
    default = '',
  }
}
