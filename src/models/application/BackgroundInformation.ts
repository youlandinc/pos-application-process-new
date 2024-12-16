import { types } from 'mobx-state-tree';
import { BackgroundInformationFormData, LoanAnswerEnum } from '@/types';

export const BackgroundInformation = types
  .model({
    hadBankruptcy: types.enumeration(Object.values(LoanAnswerEnum)),
    hadDelinquent: types.enumeration(Object.values(LoanAnswerEnum)),
    hadForeclosure: types.enumeration(Object.values(LoanAnswerEnum)),
    hadFelony: types.enumeration(Object.values(LoanAnswerEnum)),
    hadLitigation: types.enumeration(Object.values(LoanAnswerEnum)),
  })
  .actions((self) => {
    return {
      changeFieldValue<T extends keyof typeof self>(
        key: T,
        value: (typeof self)[T],
      ) {
        self[key] = value;
      },
      injectServerData(data: BackgroundInformationFormData) {
        const {
          hadBankruptcy,
          hadDelinquent,
          hadForeclosure,
          hadFelony,
          hadLitigation,
        } = data;

        self.hadBankruptcy = hadBankruptcy ?? LoanAnswerEnum.not_sure;
        self.hadDelinquent = hadDelinquent ?? LoanAnswerEnum.not_sure;
        self.hadForeclosure = hadForeclosure ?? LoanAnswerEnum.not_sure;
        self.hadFelony = hadFelony ?? LoanAnswerEnum.not_sure;
        self.hadLitigation = hadLitigation ?? LoanAnswerEnum.not_sure;
      },
      getPostData() {
        return {
          hadBankruptcy: self.hadBankruptcy,
          hadDelinquent: self.hadDelinquent,
          hadForeclosure: self.hadForeclosure,
          hadFelony: self.hadFelony,
          hadLitigation: self.hadLitigation,
        };
      },
    };
  });
