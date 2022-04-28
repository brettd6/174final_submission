/*
    Brett Davis - 174 Final Frontend
    accountform: assigns variables to all inputs needed to create an account, and sends post request to backend
*/

import React from 'react';
import Axios from 'axios';

class AccountForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            confpass: '',
            fname: '',
            lname: '',
            street: '',
            city: '',
            state: 'AL',
            zip: ''
        }

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value,
        });
    }
    
    //sends account create to backend, error results from duplicate username (alerts user)
    handleSubmit(event) {
        event.preventDefault();
        if (this.state.password === this.state.confpass) {
            Axios.post(process.env.REACT_APP_BACKEND + '/api/createaccount', {username: this.state.username, password: this.state.password, 
            fname: this.state.fname, lname: this.state.lname, street: this.state.street, city: this.state.city, state: this.state.state, zip: this.state.zip})
            .then((response) => {
                if(response.data.errno) 
                    alert('Username taken.');
                else {
                    this.props.setUsername(this.state.username);
                    this.props.toggleAccountPopup(false);
                    this.props.toggleLogin(true);
                    alert('Account Created!');
                }
            });

        }
        else alert('Passwords do not match.');          
    }

    render () {
        return (
        <form className='account-form' onSubmit={this.handleSubmit}>
            Username: <input name='username' type="text" value={this.state.username} onChange={this.handleInputChange} maxLength='12' required/><br></br>
            Password: <input name='password' type="password" value={this.state.password} onChange={this.handleInputChange} maxLength='30'required/><br></br>
            Re-enter Password: <input name='confpass' type="password" value={this.state.confpass} onChange={this.handleInputChange} maxLength='30' required/><br></br>
            First Name: <input name='fname' type="text" value={this.state.fname} onChange={this.handleInputChange} maxLength='30' required/><br></br>
            Last Name: <input name='lname' type="text" value={this.state.lname} onChange={this.handleInputChange} maxLength='30' required/><br></br>
            Street: <input name='street' type="text" value={this.state.street} onChange={this.handleInputChange} maxLength='30'/><br></br>
            City: <input name='city' type="text" value={this.state.city} onChange={this.handleInputChange} maxLength='30'/><br></br>
            State: <select name="state" value={this.state.state} onChange={this.handleInputChange}>
                <option value="AL">AL</option>
                <option value="AK">AK</option>
                <option value="AR">AR</option>	
                <option value="AZ">AZ</option>
                <option value="CA">CA</option>
                <option value="CO">CO</option>
                <option value="CT">CT</option>
                <option value="DC">DC</option>
                <option value="DE">DE</option>
                <option value="FL">FL</option>
                <option value="GA">GA</option>
                <option value="HI">HI</option>
                <option value="IA">IA</option>	
                <option value="ID">ID</option>
                <option value="IL">IL</option>
                <option value="IN">IN</option>
                <option value="KS">KS</option>
                <option value="KY">KY</option>
                <option value="LA">LA</option>
                <option value="MA">MA</option>
                <option value="MD">MD</option>
                <option value="ME">ME</option>
                <option value="MI">MI</option>
                <option value="MN">MN</option>
                <option value="MO">MO</option>	
                <option value="MS">MS</option>
                <option value="MT">MT</option>
                <option value="NC">NC</option>	
                <option value="NE">NE</option>
                <option value="NH">NH</option>
                <option value="NJ">NJ</option>
                <option value="NM">NM</option>			
                <option value="NV">NV</option>
                <option value="NY">NY</option>
                <option value="ND">ND</option>
                <option value="OH">OH</option>
                <option value="OK">OK</option>
                <option value="OR">OR</option>
                <option value="PA">PA</option>
                <option value="RI">RI</option>
                <option value="SC">SC</option>
                <option value="SD">SD</option>
                <option value="TN">TN</option>
                <option value="TX">TX</option>
                <option value="UT">UT</option>
                <option value="VT">VT</option>
                <option value="VA">VA</option>
                <option value="WA">WA</option>
                <option value="WI">WI</option>	
                <option value="WV">WV</option>
                <option value="WY">WY</option>
            </select><br></br>
            Zip: <input name='zip' type="text" value={this.state.zip} onChange={this.handleInputChange} maxLength='10'/><br></br>
            <br></br><input type='submit' value="Submit" />
        </form>
        );
    }
}

export default AccountForm;