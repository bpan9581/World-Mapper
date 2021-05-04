import React                                from 'react';
import * as mutations 					from '../cache/mutations';
import { useMutation, useQuery } 		from '@apollo/client';
import { Link } from 'react-router-dom';

const Account = (props) => {
    const [Update] = useMutation(mutations.UPDATE);

    const updateUser = (fname, lname, email, password) => {
        Update({ variables: { _id: props._id, firstName: fname, lastName: lname, email: email, password: password}});
    }

    const getValues = () => {
        var fname = document.getElementById("fname").value;
        var lname = document.getElementById("lname").value;
        var email = document.getElementById("email").value;
        var password = document.getElementById("password").value;
        console.log(fname, lname, email, password)
        updateUser(fname, lname, email, password);
    }

    return(
        <div className="account-container">
            <div className="account-header">Enter Updated Account Information</div>
            <div className="account-body">
                <div className="account-fields">
                    <div className = "account-field-items">
                        <div className = "account-field-text">First Name</div>
                        <input id = "fname" defaultValue = {props.firstName}/>
                    </div>
                    <div className = "account-field-items">
                        <div className = "account-field-text">Last Name</div>
                        <input id = "lname" defaultValue = {props.lastName}/>
                    </div>
                    <div className = "account-field-items">
                        <div className = "account-field-text">Email</div>
                        <input id = "email" defaultValue = {props.email}/>
                    </div>
                    <div className = "account-field-items">
                        <div className = "account-field-text">New Password</div>
                        <input id = "password" type = "password"/>
                    </div>
                    <div className = "account-field-items">
                        <div className = "account-field-text">Show Password</div>
                        <input type = "checkbox"/>
                    </div>
                </div>
                <div className="account-buttons">
                    <Link to = "/maps">
                        <button className = "account-button cancel">Cancel</button>
                    </Link>
                    <button className = "account-button update" onClick = {getValues}>Update</button>
                </div>
            </div>
        </div>
    )
}

export default Account;