import validate from 'validate.js';
import { addYears, compareAsc, isValid } from 'date-fns';

export const initValidate = () => {
  validate.validators.date = (
    value: Date | null,
    options: { minAge?: number; message: string },
  ) => {
    if (!value) {
      return '^Cannot be empty';
    }
    if (!isValid(new Date(value))) {
      return '^Invalid date';
    }
    if (
      options.minAge &&
      -1 === compareAsc(addYears(new Date(), -options.minAge), new Date(value))
    ) {
      return options.message || '^Borrower must be at least 18 years old';
    }
    if (1 === compareAsc(new Date(1900, 1, 1), new Date(value))) {
      return '^Cannot be before 1900';
    }
  };

  validate.validators.ssn = (value: string) => {
    const regex = /^(\d{9})$/;
    if (regex.test(value)) {
      return;
    }
    return '^Invalid value';
  };

  validate.validators.AmericanPhoneNumber = (value: string) => {
    if (!value) {
      return '^Cannot be empty';
    }
    const regex = /^\(?([0-9]{3})\)?[-.●]?([0-9]{3})[-.●]?([0-9]{4})$/;
    if (regex.test(value)) {
      return;
    }
    return '^Invalid phone number';
  };

  validate.validators.formEmail = (value: string) => {
    if (!value) {
      return '^Cannot be empty';
    }

    if (value.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
      return;
    }
    return '^Invalid email';
  };
};

initValidate();

export default validate;
