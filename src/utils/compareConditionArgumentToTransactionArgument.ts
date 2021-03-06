import _ from 'lodash';
import { TransactionDescription } from '@ethersproject/abi';
import { BigNumber } from '@ethersproject/bignumber';
import { SmartContractConditionArgument } from '@web3-set-theory/schema';
import { conditionString } from './conditions/conditionString';
import { conditionBigNumber } from './conditions/conditionBigNumber';
import { isBigNumberish } from '@ethersproject/bignumber/lib/bignumber';
const debug = require('debug')('compareConditionArgumentToTransactionArgument');

export function compareConditionArgumentToTransactionArgument(
  transaction: TransactionDescription,
  conditionArguments: SmartContractConditionArgument[]
) {
  debug(':arguments', transaction, conditionArguments);
  const formatted = conditionArguments.map(arg => {
    let condition: any = { ...arg };
    const txInputValue = _.get(transaction.args, condition.index);
    switch (arg.type) {
      case 'bignumber':
        if (isBigNumberish(txInputValue)) {
          condition.input = BigNumber.from(txInputValue || 0);
          condition.valueFormatted = BigNumber.from(arg.value || 0);
        } else {
          return false;
        }
        break;
      default:
        condition.input = txInputValue;
        condition.valueFormatted = arg.value;
    }
    return condition;
  });

  debug(':formatted: ', formatted);
  const conditionStatus = formatted.map(arg => {
    switch (arg.type) {
      case 'address':
      case 'bytes':
      case 'string':
        return conditionString(arg.comparator, arg.valueFormatted, arg.input);
      case 'bignumber':
        return conditionBigNumber(
          arg.comparator,
          arg.valueFormatted,
          arg.input
        );
      default:
        return false;
    }
  });

  const conditionsCompletion = {
    conditions: conditionStatus,
    isComplete: conditionStatus.reduce((acc, cur) => acc && cur, true), // all conditions must be true
    argumentsTotal: conditionArguments.length,
    argumentsMatched: conditionStatus.filter(Boolean).length,
  };
  debug(':return: ', conditionsCompletion);
  return conditionsCompletion;
}

export default compareConditionArgumentToTransactionArgument;
