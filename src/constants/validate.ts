import validate from 'validate.js';
import { addYears, compareAsc, isValid } from 'date-fns';

validate.validators.date = (
  value: Date | null,
  options: { minAge?: number; message: string },
) => {
  if (!value) {
    return '^Date should not be empty';
  }
  if (!isValid(value)) {
    return '^Date is invalid';
  }
  if (
    options.minAge &&
    -1 === compareAsc(addYears(new Date(), -options.minAge), new Date(value))
  ) {
    return options.message || '^Borrowers must not be less than 18 years old';
  }
  if (1 === compareAsc(new Date(1900, 1, 1), new Date(value))) {
    return '^Date is too early';
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
  const regex = /^\(?([0-9]{3})\)?[-.●]?([0-9]{3})[-.●]?([0-9]{4})$/;
  if (regex.test(value)) {
    return;
  }
  return '^Invalid phone number';
};

export default validate;
