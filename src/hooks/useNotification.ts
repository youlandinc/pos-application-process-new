import { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { INotificationStation } from '@/models/NotificationStation';
import { autorun } from 'mobx';

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
