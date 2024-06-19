export interface DomainDetails {
  id: number;
  domainName: string;
  state: DomainState;
  source: DomainSource;
}

export interface EmailDomainDetails {
  id: number;
  email: string;
  emailDomain: string;
  validStatus: EmailDomainState;
  source: DomainSource;
  userName: string;
}

export enum DomainSource {
  DEFAULT = 'DEFAULT',
  CUSTOM = 'CUSTOM',
}

export enum DomainState {
  CONNECTED = 'CONNECTED',
  WAITING_VERIFICATION = 'WAITING_VERIFICATION',
  NOT_LINKED = 'NOT_LINKED',
}

export enum EmailDomainState {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  ACTIVE = 'ACTIVE',
}

export interface DomainVerifyData {
  domainName: string;
  recordType: string;
  recordName: string;
  recordData: string;
}

export interface DomainLiveData {
  domainName: string;
  recordType: string;
  recordName: string;
  recordData: string;
}

export interface EmailDomainData {
  domainType: string;
  recordName: string;
  recordValue: string;
}
