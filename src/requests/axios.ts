import axios from 'axios';
import { REQUEST_TIMEOUT } from '@/constants';

import { rootStore } from '@/models/Root';
import { HttpError, HttpErrorType, HttpVariantType } from '@/types/server';

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8';

const service = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  timeout: REQUEST_TIMEOUT,
});

service.interceptors.request.use(
  (config) => {
    if (rootStore.session) {
      config.headers.Authorization = `Bearer ${rootStore.session.idToken.jwtToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject({
      message: error.message,
      header: '',
      variant: HttpVariantType.error,
    });
  },
);

service.interceptors.response.use(
  (res) => {
    return res;
  },
  (error) => {
    const { code } = error;

    let notificationObj: HttpError = {
      message: '',
      header: '',
      variant: HttpVariantType.error,
    };

    if (error.response) {
      const { message, header, variant, code } = error.response.data;
      notificationObj = {
        message,
        header,
        variant,
      };
      if (code === HttpErrorType.tokenExpired) {
        // rootStore.logout();
      }
    }

    if (code === 'ECONNABORTED') {
      notificationObj = {
        message: 'A system error has occurred.',
        header: '',
        variant: HttpVariantType.error,
      };
    }

    if (code === 'ERR_NETWORK') {
      notificationObj = {
        message:
          'Unable to connect to the server. Please check your network connection and try again.',
        header: 'Network Error',
        variant: HttpVariantType.error,
      };
    }

    return Promise.reject(notificationObj);
  },
);

export const { get, post, put, delete: del } = service;
