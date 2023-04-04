import axios from 'axios';
import { REQUEST_TIMEOUT } from '@/constants';
import { rootStore } from '@/models/Root';
import { HttpErrorType } from '@/types/server';

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8';

const service = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  timeout: REQUEST_TIMEOUT,
});

// todo request interceptors & response interceptors

service.interceptors.request.use((config) => {
  if (rootStore.session) {
    config.headers.Authorization = `Bearer ${rootStore.session.idToken.jwtToken}`;
  }
  return config;
});

service.interceptors.response.use(
  (res) => {
    return res;
  },
  (error) => {
    if (!error.response) {
      rootStore.notificationStation.enqueueSnackbar({
        message: error.message,
        options: {
          variant: 'error',
        },
      });
      return Promise.reject(error.message);
    }
    //HTTP STATUS CODE 401 means that landing privileges are invalid, 403 does not have permission access to the current login state
    const { message, code, status } = error.response.data;
    // if token expired
    if (code === HttpErrorType.tokenExpired) {
      rootStore.logout();
    }

    rootStore.notificationStation.enqueueSnackbar({
      message: message,
      options: {
        variant: 'error',
      },
    });
    return Promise.reject(message);
  },
);

export const { get, post, put, delete: del } = service;
