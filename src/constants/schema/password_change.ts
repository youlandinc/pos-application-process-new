export const ChangePasswordSchema = {
  confirmedPassword: {
    equality: {
      attribute: 'password',
      message: '^Passwords do not match',
      comparator: function (v1: string, v2: string) {
        return v1 === v2;
      },
    },
  },
};
