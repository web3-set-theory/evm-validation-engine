import { ConstructedSmartContractSet } from '../types';

function isFilteredParsedStatePassingSmartContractSetRules(
  sortedTransactionsWithEntityAndConditionsList: ConstructedSmartContractSet
): boolean {
  const {
    collections: entityCollections,
  } = sortedTransactionsWithEntityAndConditionsList;
  let isComplete = true;
  while (isComplete) {
    for (let _i = 0; _i < entityCollections.length; _i++) {
      const collection = entityCollections[_i];
      collection.computed?.transactions?.forEach(match => {
        for (let _m of match.matches) {
          if (!_m.isComplete) isComplete = false;
        }
      });
      collection.computed?.logs?.forEach(match => {
        for (let _m of match.matches) {
          if (!_m.isComplete) isComplete = false;
        }
      });
      collection.computed?.reads?.forEach(match => {
        for (let _m of match.matches) {
          if (!_m.isComplete) isComplete = false;
        }
      });
    }
    break;
  }
  return isComplete;
}

export default isFilteredParsedStatePassingSmartContractSetRules;
