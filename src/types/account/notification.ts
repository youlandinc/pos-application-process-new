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
    loanId: number;
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
