import { TRANSACTION_ADD, TRANSACTION_REINIT, TRANSACTION_UPDATE, TRANSACTION_ERASE } from './type';

const initialState = {
    transactions: []
}

const transactionReducer = (state = initialState, action) =>{
    switch(action.type) {
        case TRANSACTION_ADD:
            return {
                ...state,
                transactions: [action.transaction, ...state.transactions]
            }
        case TRANSACTION_REINIT:
            return {
                transactions: initialState.transactions
            }
        case TRANSACTION_UPDATE:
            const indexOfTransaction = state.transactions.findIndex(trans => trans.id === action.transaction.id);
            const newTransactions = state.transactions;
            newTransactions[indexOfTransaction] = action.transaction;
            return {
                ...state,
                transactions: newTransactions
            }
        case TRANSACTION_ERASE:
            const indexOfTransactionDelete = state.transactions.findIndex(trans => trans.id === action.id_transaction)
            const transactionsAfterDelete = state.transactions;
            transactionsAfterDelete.splice(indexOfTransactionDelete, 1)
            return {
                ...state,
                transactions: transactionsAfterDelete
            }
        default:
            return state;
    }
}

export default transactionReducer;