export type TicketSearchLink = {
  label: string;
  url: string;
};

export type VenueStatus = 'active' | 'closed' | 'unknown';
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
export type SourceConfidence = 'verified' | 'partially_verified' | 'social_only' | 'verified_or_historical' | 'unknown';
export type SourceType = 'official' | 'ticket_site' | 'ticket_site_or_user_list' | 'social' | 'mixed' | 'unknown';
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

export type Venue = {
  slug: string;
  name: string;
  aliases: string[];
  prefecture: string;
  region: string;
  area: string;
  areaGroup: string;
  status: VenueStatus;
  venueType: VenueType;
  venueScale: VenueScale;
  vkeiAffinity: VkeiAffinity;
  minorVkeiFriendly: boolean;
  sourceConfidence: SourceConfidence;
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
  ticketSearchLinks: TicketSearchLink[];
  sourceNotes: string[];
};

export type BreadcrumbItem = {
  label: string;
  href?: string;
};
