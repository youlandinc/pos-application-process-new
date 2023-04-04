import validate from 'validate.js';
import { addYears, compareAsc } from 'date-fns';

validate.validators.optional = (
  value,
  options: {
    parentsConditions: Record<string, any>;
    required: boolean;
  },
  attr,
  formState,
) => {
  for (const key in options.parentsConditions) {
    if (formState[key] !== options.parentsConditions[key]) {
      return;
    }
  }
  if (options.required && validate.isEmpty(formState[attr])) {
    return 'Must not be empty';
  }
  return;
};

validate.validators.date = (
  value,
  options: { minAge?: number; message: string },
) => {
  if (options && value === 'Invalid Date') {
    return '^Invalid Date';
  }
  if (
    options.minAge &&
    -1 === compareAsc(addYears(new Date(), -options.minAge), new Date(value))
  ) {
    return options.message;
  }
  return;
};

validate.validators.ssn = (value, options) => {
  const regex = /^(\d{9})$/;
  if (regex.test(value)) {
    return;
  }
  return '^Invalid value';
};

validate.validators.AmericanPhoneNumber = (value, options) => {
  const regex = /^\(?([0-9]{3})\)?[-.●]?([0-9]{3})[-.●]?([0-9]{4})$/;
  if (regex.test(value)) {
    return;
  }
  return '^Invalid Phone Number';
};

export default validate;
