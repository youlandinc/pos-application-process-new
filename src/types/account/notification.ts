export interface NotificationMessageItem {
  avatar: string;
  backgroundColor: string;
  firstName: string;
  isRead: boolean;
  lastName: string;
  name: string;
  note: string;
  operationTime: string;
  messageId: string;
  dateFromNow: string;
  variables: {
    loanId: number | string;
    categoryKey: string;
    fileId: number;
    fileName: string;
  };
}

export enum NotificationMessageLabel {
  all = 'ALL',
  read = 'READ',
  unread = 'UNREAD',
}

export interface ChatMessageItem {
  firstName: string | null;
  lastName: string | null;
  name: string | null;
  avatar: string | null;
  backgroundColor: string | null;
  operatorId: string | number | null;
  operationTime: string | null;
  content: string | null;
  role: RoleEnum | null;
  docName: string | null;
  source: ChatMessageItemSource | null;
}

export enum ChatMessageItemSource {
  pos = 'POS',
  los = 'LOS',
}

export enum RoleEnum {
  processor = 'PROCESSOR',
  admin = 'ADMIN',
  executive = 'EXECUTIVE',
  underwriter = 'UNDERWRITER',
}

export interface ChatMessageResponse {
  unReadCount: number;
  messages: ChatMessageItem[];
}
