export type TicketSearchLink = {
  label: string;
  url: string;
};

export type VenueStatus = 'active' | 'closed' | 'relocation_pending' | 'event_only' | 'unknown';
export type VenueScale = 'small' | 'small-mid' | 'mid' | 'large' | 'unknown';
export type VkeiAffinity = 'high' | 'medium' | 'low' | 'unknown';
export type VenueType =
  | 'small_livehouse'
  | 'mid_livehouse'
  | 'large_livehouse'
  | 'hall'
  | 'theater'
  | 'outdoor_stage'
  | 'event_space'
  | 'closed_archive'
  | 'unknown';
export type SourceConfidence =
  | 'official'
  | 'supporting_reference'
  | 'verified'
  | 'partially_verified'
  | 'social_only'
  | 'verified_or_historical'
  | 'unknown';
export type SourceType =
  | 'official'
  | 'ticket_site'
  | 'ticket_site_or_user_list'
  | 'blog'
  | 'venue_database'
  | 'review_site'
  | 'social'
  | 'mixed'
  | 'unknown';
export type VkeiUseType =
  | 'minor_vkei'
  | 'vkei_regular'
  | 'vkei_occasional'
  | 'release_event'
  | 'large_scale'
  | 'copy_band'
  | 'related_event'
  | 'unknown';
export type VenuePriority = 'A' | 'B' | 'C' | 'D';
export type VenueTipCategory =
  | 'locker'
  | 'cloak'
  | 'baggage'
  | 'drink'
  | 'entry'
  | 'merch'
  | 'restroom'
  | 'return'
  | 'solo'
  | 'beginner'
  | 'cash'
  | 'coin'
  | 'safety'
  | 'neighborhood'
  | 'photography'
  | 'reentry'
  | 'signal'
  | 'stairs'
  | 'weather'
  | 'other';
export type VenueTipConfidence = 'official' | 'high' | 'medium' | 'low' | 'unverified' | 'general';

export type VenueTip = {
  category: VenueTipCategory;
  title: string;
  body: string;
  confidence: VenueTipConfidence;
  sourceType: 'official' | 'summary' | 'social' | 'mixed' | 'unknown';
  lastVerifiedAt: string;
};

export type VenueFactCategory =
  | 'access'
  | 'locker'
  | 'cloak'
  | 'baggage'
  | 'nearby'
  | 'return'
  | 'parking'
  | 'rule'
  | 'drink'
  | 'facility'
  | 'safety'
  | 'entry'
  | 'restroom'
  | 'signal'
  | 'stairs'
  | 'view'
  | 'weather'
  | 'other';

export type VenueFact = {
  category: VenueFactCategory;
  label: string;
  body: string;
  sourceLabel: string;
  sourceUrl: string;
  sourceType: SourceType;
  checkedAt: string;
  confidence: SourceConfidence;
  note?: string;
};

export type VenueProfileStatus = 'none' | 'limited' | 'available' | 'sometimes' | 'unknown';

export type LockerProfile = {
  status: 'none' | 'limited' | 'available' | 'unknown';
  summary: string;
  timing: string;
  countNote: string;
  priceNote: string;
  coinNote: string;
  bestMove: string;
  riskLevel: number;
};

export type CloakProfile = {
  status: 'available' | 'sometimes' | 'none' | 'unknown';
  summary: string;
  priceNote: string;
  timing: string;
  bagTypeNote: string;
  bestMove: string;
  riskLevel: number;
};

export type BaggageDecision = {
  tinyBag: string;
  backpack: string;
  suitcase: string;
  afterMerch: string;
  goodTicketNumber: string;
};

export type PracticalSummary = {
  headline: string;
  points: string[];
};

export type BlogSignal = {
  topic: string;
  summary: string;
  sourceType: 'official' | 'personal_blog' | 'note' | 'sns' | 'q_and_a' | 'ticket_site' | 'mixed' | 'unknown';
  confidence: 'high' | 'medium' | 'low' | 'unknown';
  sourceName: string;
  sourceUrl: string;
  checkedAt: string;
  copyrightNote: string;
};

export type VenueComment = {
  category: 'locker' | 'cloak' | 'baggage' | 'arrival' | 'waiting' | 'merch' | 'return' | 'nearby' | 'beginner' | 'solo' | 'weather' | 'other';
  title: string;
  comment: string;
  action: string;
  sourceType: 'official' | 'personal_blog' | 'note' | 'sns' | 'q_and_a' | 'ticket_site' | 'venue_database' | 'review_site' | 'mixed' | 'unknown';
  confidence: 'high' | 'medium' | 'low' | 'unknown';
  sourceName: string;
  sourceUrl: string;
  checkedAt: string;
};

export type LogisticsConfidence = 'official' | 'blog_report' | 'mixed' | 'sns_report' | 'supporting_reference' | 'unknown';
export type ExtendedLogisticsConfidence = LogisticsConfidence | 'venue_database' | 'review_site';
export type AvailabilityStatus = 'available' | 'unavailable' | 'unknown';

export type LockerInfo = {
  venueLockerStatus: 'available' | 'none' | 'limited' | 'unknown';
  venueLockerText: string;
  lockerCountText: string;
  lockerPriceText?: string;
  lockerUsageTiming?: string;
  priceText?: string;
  timingText?: string;
  beforeEntryUse?: AvailabilityStatus;
  afterEntryUse?: AvailabilityStatus;
  coinNeeded?: 'yes' | 'no' | 'unknown';
  coinNote?: string;
  coinText?: string;
  largeBagFit?: 'yes' | 'no' | 'limited' | 'unknown';
  largeBagNote?: string;
  largeBagText?: string;
  stationLockerRecommended: 'yes' | 'no' | 'depends' | 'situation_dependent' | 'unknown' | boolean;
  bestMove?: string;
  sourceConfidence?: ExtendedLogisticsConfidence;
  checkedAt?: string;
  lastCheckedAt?: string;
};

export type CloakInfo = {
  cloakStatus: 'available' | 'none' | 'event_dependent' | 'unknown';
  cloakText: string;
  cloakPriceText?: string;
  cloakTiming?: string;
  largeBagHandling?: string;
  priceText?: string;
  timingText?: string;
  bagTypeText?: string;
  bestMove?: string;
  sourceConfidence?: ExtendedLogisticsConfidence;
  checkedAt?: string;
  lastCheckedAt?: string;
};

export type BaggageGuide = {
  smallBag?: string;
  backpack?: string;
  suitcase?: string;
  afterMerch?: string;
  goodTicketNumber?: string;
  carryBagPolicy?: string;
  beforeEntry?: string;
  afterShow?: string;
  headline?: string;
  points?: string[];
};

export type NearbyInfo = {
  nearestExit?: string;
  convenienceStores?: string[];
  cafes?: string[];
  stationLockers?: string[];
  restrooms?: string[];
  waitingRule?: string;
  rainPlan?: string;
  soloBeginnerNote?: string;
  nearestConvenienceStore?: string;
  convenienceStore?: string;
  stationLocker?: string;
  waitingSpot?: string;
  rainShelter?: string;
  restroomBeforeEntry?: string;
  cashAndCoin?: string;
  afterShowRoute?: string;
  nightSafety?: string;
};

export type BlogResearch = {
  status: 'researched' | 'partial' | 'not_found' | 'not_started';
  checkedAt: string;
  searchQueries: string[];
  summary: string;
  confidence: 'high' | 'medium' | 'low' | 'unknown';
};

export type DayDecisionGuide = {
  baggageDay: string;
  goodNumberDay: string;
  merchDay: string;
  rainyDay: string;
  soloDay: string;
  hurryAfterShowDay: string;
};

export type SourceLink = {
  label: string;
  url: string;
  type:
    | 'official'
    | 'supporting_reference'
    | 'official_blog'
    | 'personal_blog'
    | 'blog'
    | 'note'
    | 'sns'
    | 'q_and_a'
    | 'ticket_site'
    | 'mixed'
    | 'unknown'
    | 'venue_database'
    | 'review_site';
  checkedAt: string;
};

export type Venue = {
  slug: string;
  name: string;
  aliases: string[];
  prefecture: string;
  region: string;
  area: string;
  areaGroup: string;
  status: VenueStatus;
  venueStatus?: VenueStatus;
  venueType: VenueType;
  venueScale: VenueScale;
  vkeiAffinity: VkeiAffinity;
  minorVkeiFriendly: boolean;
  sourceConfidence: SourceConfidence;
  venueExistenceConfidence?: 'verified' | 'partially_verified' | 'social_only' | 'unknown';
  sourceType: SourceType;
  sourceMemo: string;
  grokSuggested: boolean;
  currentUseNote: string;
  vkeiUseType: VkeiUseType;
  priority: VenuePriority;
  station: string;
  walkMinutes: number | null;
  officialUrl: string;
  lastVerifiedAt: string;
  showInVenueList: boolean;
  archiveOnly: boolean;
  beginnerFriendly: number;
  soloFriendly: number;
  lockerRisk: number;
  returnDifficulty: number;
  nightSafetyNote: string;
  lockerNote: string;
  baggageNote: string;
  convenienceNote: string;
  waitingNote: string;
  rainNote: string;
  returnNote: string;
  beginnerNote: string;
  soloNote?: string;
  timeKillingNote?: string;
  lockerAlternativeNote?: string;
  tips: VenueTip[];
  warnings: string[];
  preCheckItems: string[];
  lockerStrategy: string;
  cloakStrategy: string;
  baggageStrategy: string;
  drinkStrategy: string;
  entryStrategy: string;
  merchStrategy: string;
  returnStrategy: string;
  soloStrategy: string;
  beginnerStrategy: string;
  cashNote: string;
  coinNote: string;
  restroomNote: string;
  signalNote: string;
  stairsNote: string;
  neighborhoodNote: string;
  photographyNote: string;
  reentryNote: string;
  lastTipVerifiedAt: string;
  tipTags: string[];
  factChecks?: VenueFact[];
  lockerProfile?: LockerProfile;
  cloakProfile?: CloakProfile;
  baggageDecision?: BaggageDecision;
  arrivalStrategy?: string;
  entryStrategyPlain?: string;
  merchBaggageStrategy?: string;
  afterShowStrategy?: string;
  beginnerOneLine?: string;
  soloOneLine?: string;
  badWeatherNote?: string;
  stationLockerNote?: string;
  goodNumberWarning?: string;
  carryCaseWarning?: string;
  floorBaggageWarning?: string;
  practicalSummary?: PracticalSummary;
  blogSignals?: BlogSignal[];
  venueComments?: VenueComment[];
  lockerInfo?: LockerInfo;
  cloakInfo?: CloakInfo;
  baggageGuide?: BaggageGuide;
  nearbyInfo?: NearbyInfo;
  blogResearch?: BlogResearch;
  dayDecisionGuide?: DayDecisionGuide;
  sourceLinks?: SourceLink[];
  researchStatus?: string;
  searchedSources?: Array<{
    query: string;
    result: string;
    checkedAt: string;
  }>;
  infoFreshnessWarning?: string;
  ticketSearchLinks: TicketSearchLink[];
  sourceNotes: string[];
};

export type BreadcrumbItem = {
  label: string;
  href?: string;
};
