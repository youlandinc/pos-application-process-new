import { types } from 'mobx-state-tree';
import { BackgroundInformationFormData, LoanAnswerEnum } from '@/types';

export const BackgroundInformation = types
  .model({
    hadBankruptcy: types.union(
      types.literal(LoanAnswerEnum.default),
      types.literal(LoanAnswerEnum.yes),
      types.literal(LoanAnswerEnum.no),
      types.literal(LoanAnswerEnum.not_sure),
    ),
    hadDelinquent: types.union(
      types.literal(LoanAnswerEnum.default),
      types.literal(LoanAnswerEnum.yes),
      types.literal(LoanAnswerEnum.no),
      types.literal(LoanAnswerEnum.not_sure),
    ),
    hadForeclosure: types.union(
      types.literal(LoanAnswerEnum.default),
      types.literal(LoanAnswerEnum.yes),
      types.literal(LoanAnswerEnum.no),
      types.literal(LoanAnswerEnum.not_sure),
    ),
    hadFelony: types.union(
      types.literal(LoanAnswerEnum.default),
      types.literal(LoanAnswerEnum.yes),
      types.literal(LoanAnswerEnum.no),
      types.literal(LoanAnswerEnum.not_sure),
    ),
    hadLitigation: types.union(
      types.literal(LoanAnswerEnum.default),
      types.literal(LoanAnswerEnum.yes),
      types.literal(LoanAnswerEnum.no),
      types.literal(LoanAnswerEnum.not_sure),
    ),
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
