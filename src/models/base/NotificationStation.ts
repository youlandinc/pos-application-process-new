import { AUTO_HIDE_DURATION } from '@/constants';
import { HttpError } from '@/types';
import { Instance, SnapshotOut, types } from 'mobx-state-tree';
import { observable } from 'mobx';
import { enqueueSnackbar, OptionsObject, SnackbarMessage } from 'notistack';

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
        const { header, message, variant } = err as HttpError;
        enqueueSnackbar(message, {
          variant: variant || 'error',
          autoHideDuration: AUTO_HIDE_DURATION,
          isSimple: !header,
          header,
        });
      }
    },
    removeSnackbar(key: any) {
      self.notifications = observable(
        self.notifications.filter((notification) => notification.key !== key),
      );
    },
  }));

export type SNotificationStation = SnapshotOut<typeof NotificationStation>;
export type INotificationStation = Instance<typeof NotificationStation>;
