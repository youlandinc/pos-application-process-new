// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { autorun } from 'mobx';
import { INotificationStation } from '@/models/base';

export const useNotification = (notificationStation: INotificationStation) => {
  const { enqueueSnackbar } = useSnackbar();
  const [displayedNotice, setDisplayedNotice] = useState([]);
  useEffect(() => {
    const disposer = autorun(() => {
      notificationStation.notifications.forEach((notification) => {
        if (displayedNotice.includes(notification.key)) {
          return;
        }
        enqueueSnackbar(notification.message, notification.options);
        setDisplayedNotice([...displayedNotice, notification.key]);
        notificationStation.removeSnackbar(notification.key);
      });
    });
    return () => {
      disposer();
    };
  }, [
    displayedNotice,
    enqueueSnackbar,
    notificationStation,
    notificationStation.notifications,
  ]);
};
