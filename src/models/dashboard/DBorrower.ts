import {
  AddressSchema,
  TaskBorrowerEntity,
  TaskBorrowerIndividual,
  TaskBorrowerSignatory,
  TaskBorrowerTrust,
} from '@/constants';
import _uniqueId from 'lodash/uniqueId';
import {
  cast,
  getSnapshot,
  Instance,
  SnapshotOut,
  types,
} from 'mobx-state-tree';

import {
  DashboardTaskBorrowerType,
  LoanCitizenshipEnum,
  LoanMarriedStatusEnum,
} from '@/types';
import { DBorrowerResponse } from '@/types/dashboard/DBorrower';

import { Address } from '@/models/common/Address';
import {
  DSignatoryInfo,
  SDSignatoryInfo,
} from '@/models/dashboard/DSignatoryInfo';
import validate from 'validate.js';

export const DBorrower = types
  .model({
    borrowerType: types.union(
      types.enumeration(Object.values(DashboardTaskBorrowerType)),
      types.string,
    ),
    // common
    phoneNumber: types.string,
    email: types.string,
    // individual
    firstName: types.string,
    lastName: types.string,
    birthDate: types.maybeNull(types.string),
    addressInfo: Address,
    citizenship: types.union(
      types.enumeration(Object.values(LoanCitizenshipEnum)),
      types.string,
    ),
    ssn: types.string,
    // entity
    entityName: types.string,
    entityType: types.string,
    entityId: types.string,
    entityState: types.string,
    // trust
    trustName: types.string,
    // signatory
    signatories: types.array(DSignatoryInfo),
  })
  .actions((self) => ({
    changeFieldValue<T extends keyof typeof self>(
      key: T,
      value: (typeof self)[T],
    ) {
      self[key] = value;
    },
    changeSignatoryFieldValue<T extends keyof SDSignatoryInfo>(
      index: number,
      key: keyof SDSignatoryInfo,
      value: SDSignatoryInfo[T],
    ) {
      self.signatories[index][key] = value;
    },
    addSignatory() {
      const newSignatory = DSignatoryInfo.create({
        id: _uniqueId('signatory_'),
        firstName: '',
        lastName: '',
        signatoryTitle: '',
        birthday: null,
        phoneNumber: '',
        email: '',
        citizenship: '',
        ssn: '',
        addressInfo: Address.create({
          formatAddress: '',
          state: '',
          street: '',
          aptNumber: '',
          city: '',
          postcode: '',
          lat: void 0,
          lng: void 0,
          isValid: false,
          errors: {},
        }),
        maritalStatus: '',
        marriedTogether: '',
        errors: {},
      });

      self.signatories.push(newSignatory);
    },
    removeSignatory(index: number) {
      self.signatories.splice(index, 1);
    },
    injectServerData(data: DBorrowerResponse) {
      const {
        borrowerType,
        phoneNumber,
        email,
        firstName,
        lastName,
        birthDate,
        addressInfo,
        citizenship,
        ssn,
        entityName,
        entityType,
        entityId,
        entityState,
        trustName,
        signatories,
      } = data;

      self.borrowerType = borrowerType ?? DashboardTaskBorrowerType.individual;
      self.phoneNumber = phoneNumber ?? '';
      self.email = email ?? '';
      self.firstName = firstName ?? '';
      self.lastName = lastName ?? '';
      self.birthDate = birthDate ?? null;
      self.addressInfo.injectServerData(addressInfo);
      self.citizenship = citizenship ?? LoanCitizenshipEnum.us_citizen;
      self.ssn = ssn ?? '';
      self.entityName = entityName ?? '';
      self.entityType = entityType ?? '';
      self.entityId = entityId ?? '';
      self.entityState = entityState ?? '';
      self.trustName = trustName ?? '';

      const list =
        signatories.length >= 1
          ? signatories.map((item) => {
              const {
                firstName,
                lastName,
                signatoryTitle,
                birthday,
                phoneNumber,
                email,
                citizenship,
                ssn,
                addressInfo: {
                  address,
                  aptNumber,
                  city,
                  state,
                  postcode,
                  lng,
                  lat,
                },
                maritalStatus,
                marriedTogether,
              } = item;

              return DSignatoryInfo.create({
                id: _uniqueId('signatory_'),
                firstName: firstName ?? '',
                lastName: lastName ?? '',
                signatoryTitle: signatoryTitle ?? '',
                birthday: birthday ?? null,
                phoneNumber: phoneNumber ?? '',
                email: email ?? '',
                citizenship: citizenship ?? LoanCitizenshipEnum.us_citizen,
                ssn: ssn ?? '',
                addressInfo: Address.create({
                  formatAddress: address ?? '',
                  state: state ?? '',
                  street: '',
                  aptNumber: aptNumber ?? '',
                  city: city ?? '',
                  postcode: postcode ?? '',
                  lat: lat ?? void 0,
                  lng: lng ?? void 0,
                  isValid: Object.keys(item).some((v) => v),
                  errors: {},
                }),
                maritalStatus: maritalStatus || '',
                marriedTogether: marriedTogether || '',
                errors: {},
              });
            })
          : [
              DSignatoryInfo.create({
                id: _uniqueId('signatory_'),
                firstName: '',
                lastName: '',
                signatoryTitle: '',
                birthday: null,
                phoneNumber: '',
                email: '',
                citizenship: '',
                ssn: '',
                addressInfo: Address.create({
                  formatAddress: '',
                  state: '',
                  street: '',
                  aptNumber: '',
                  city: '',
                  postcode: '',
                  lat: void 0,
                  lng: void 0,
                  isValid: false,
                  errors: {},
                }),
                maritalStatus: '',
                marriedTogether: '',
                errors: {},
              }),
            ];

      self.signatories = cast(list);
    },
    getIndividualPostData() {
      return {
        borrowerType: self.borrowerType,
        phoneNumber: self.phoneNumber,
        email: self.email,
        firstName: self.firstName,
        lastName: self.lastName,
        birthDate: self.birthDate,
        addressInfo: self.addressInfo.getPostData(),
        citizenship: self.citizenship,
        ssn: self.ssn,
      };
    },
    getEntityPostData() {
      const pureSignatories = self.signatories.map((item) => {
        return {
          ...item.getPostData(),
        };
      });

      return {
        borrowerType: self.borrowerType,
        phoneNumber: self.phoneNumber,
        email: self.email,
        entityName: self.entityName,
        entityType: self.entityType,
        entityId: self.entityId,
        entityState: self.entityState,
        signatories: pureSignatories,
      };
    },
    getTrustPostData() {
      const pureSignatories = self.signatories.map((item) => {
        return {
          ...item.getPostData(),
        };
      });

      return {
        borrowerType: self.borrowerType,
        trustName: self.trustName,
        signatories: pureSignatories,
      };
    },
    checkIndividual() {
      return validate(this.getIndividualPostData(), TaskBorrowerIndividual);
    },
    checkEntity() {
      const {
        entityName,
        entityType,
        entityId,
        entityState,
        email,
        phoneNumber,
        borrowerType,
      } = this.getEntityPostData();
      
      return validate({
        entityName,
        entityType,
        entityId,
        entityState,
        email,
        phoneNumber,
        borrowerType,
      }, TaskBorrowerEntity);
    },
    checkTrust() {
      const { trustName, borrowerType } = this.getTrustPostData();
      return validate({ trustName, borrowerType }, TaskBorrowerTrust);
    },
    checkSignatories() {
      self.signatories.map((signatory, index) => {
        const addressError: Record<string, string[]> | undefined = validate(
          signatory.addressInfo.getPostData(),
          AddressSchema,
        );
        const formError = validate(signatory, TaskBorrowerSignatory);

        if (
          index === 1 &&
          self.signatories[0].maritalStatus === LoanMarriedStatusEnum.married &&
          signatory.maritalStatus === LoanMarriedStatusEnum.married &&
          !signatory.marriedTogether
        ) {
          formError.marriedTogether = ['Cannot be empty'];
        }

        self.signatories[index].errors = addressError
          ? { ...formError, addressInfo: addressError }
          : formError || {};
      });
      
      const arr = getSnapshot(self.signatories);
      return arr.map((item) => item.errors);
    },
  }));

export type IDBorrower = Instance<typeof DBorrower>;
export type SDBorrower = SnapshotOut<typeof DBorrower>;
