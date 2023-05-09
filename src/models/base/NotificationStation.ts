import { Instance, SnapshotOut, types } from 'mobx-state-tree';
import { observable } from 'mobx';
import { OptionsObject, SnackbarMessage } from 'notistack';

export interface NotificationType {
  message: SnackbarMessage;
  options: OptionsObject;
  key: string;
}

export const NotificationStation = types
  .model({})
  .volatile<{ notifications: NotificationType[] }>(() => ({
    notifications: observable([]),
  }))
  .actions((self) => ({
    enqueueSnackbar(notification: Omit<NotificationType, 'key'>) {
      try {
        self.notifications.push({
          ...notification,
          key: Date.now() + Math.random() + '',
        });
      } catch (err) {
        console.log(err);
      }
    },
    removeSnackbar(key) {
      self.notifications = observable(
        self.notifications.filter((notification) => notification.key !== key),
      );
    },
  }));

export type SNotificationStation = SnapshotOut<typeof NotificationStation>;
export type INotificationStation = Instance<typeof NotificationStation>;
