import React from 'react';
import '../styles/QuickViewCustomer.css';

const calculTotals = (customer) => {
    return (customer.credit - customer.debit);
}

const QuickViewCustomer = (props) => {

    const { onClick } = props;
    return (
        <div className="quickView col-md-3" onClick={onClick}>
            <h4>{props.customer.name}</h4>
            <div className="row text-center">
                <div className="col-12">{calculTotals(props.customer)},00 €</div>
            </div>
        </div>
    )

}

export default QuickViewCustomer;