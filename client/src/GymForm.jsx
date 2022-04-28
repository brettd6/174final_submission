/*
    Brett Davis - 174 Final Frontend
    gymform: assigns variables to all inputs needed to submit a gym, and sends post request to backend
*/

import React from 'react';
import Axios from 'axios';

class GymForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasTreadmill: 'No',
            hasDumbbells: 'No',
            timeStart: 0,
            timeEnd: 1,
            street: '',
            city: '',
            state: 'AL',
            zip: ''
        }

        this.setSameAddress = this.setSameAddress.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.onValueChange = this.onValueChange.bind(this);
        this.onValueChange2 = this.onValueChange2.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    //retrieves address of user from database if user has same address as facility
    setSameAddress(event) {
        Axios.get(process.env.REACT_APP_BACKEND + '/api/getAddress', {params: {username: this.props.username}}).then((response) => {
            if (response.data[0].street ==='' && response.data[0].city ==='' && response.data[0].zip ==='')
                alert('No Address on Account');
            else {
                this.setState({
                    street: response.data[0].street,
                    city: response.data[0].city,
                    state: response.data[0].state,
                    zip: response.data[0].zip        
                })
            }
        })
    }
    
    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value,
        })
    }

    onValueChange(event) {
        this.setState({
            hasTreadmill: event.target.value 
        })
    }

    onValueChange2(event) {
        this.setState({
            hasDumbbells: event.target.value
        })
    }
    
    //submits gym post to backend
    handleSubmit(event) {
        event.preventDefault();
        if(Number(this.state.timeEnd) <= Number(this.state.timeStart)) alert('Please Enter Valid Availability Times.')
        else {
            Axios.post(process.env.REACT_APP_BACKEND + '/api/uploadgym', {username: this.props.username, hasDumbbells: this.state.hasDumbbells, 
            hasTreadmill: this.state.hasTreadmill, street: this.state.street, city: this.state.city, state: this.state.state,
            zip: this.state.zip, timeStart: this.state.timeStart, timeEnd: this.state.timeEnd})
            .then(() => {})
            this.props.toggleSection('');
            alert('Gym Uploaded!');
        }
    }

    render () {
        return (
        <div>
        <form className='upload-gym' onSubmit={this.handleSubmit}>
            Does Your Gym Have a Treadmill?<br></br>
            <label><input type="radio" value ='Yes' checked={this.state.hasTreadmill === 'Yes'} onChange={this.onValueChange}/>Yes</label>
            <label><input type="radio" value ='No' checked={this.state.hasTreadmill === 'No'} onChange={this.onValueChange}/>No</label>
            <br></br>Does Your Gym Have Dumbells?<br></br>
            <label><input type="radio" value ='Yes' checked={this.state.hasDumbbells === 'Yes'} onChange={this.onValueChange2}/>Yes</label>
            <label><input type="radio" value ='No' checked={this.state.hasDumbbells === 'No'} onChange={this.onValueChange2}/>No</label>
            <br></br>When is your Gym Available?<br></br>
            <select name="timeStart" value={this.state.timeStart} onChange={this.handleInputChange}>
                <option value={0}>00:00</option>
                <option value={1}>01:00</option>
                <option value={2}>02:00</option>
                <option value={3}>03:00</option>
                <option value={4}>04:00</option>
                <option value={5}>05:00</option>
                <option value={6}>06:00</option>
                <option value={7}>07:00</option>
                <option value={8}>08:00</option>
                <option value={9}>09:00</option>
                <option value={10}>10:00</option>
                <option value={11}>11:00</option>
                <option value={12}>12:00</option>
                <option value={13}>13:00</option>
                <option value={14}>14:00</option>
                <option value={15}>15:00</option>
                <option value={16}>16:00</option>
                <option value={17}>17:00</option>
                <option value={18}>18:00</option>
                <option value={19}>19:00</option>
                <option value={20}>20:00</option>
                <option value={21}>21:00</option>
                <option value={22}>22:00</option>
                <option value={23}>23:00</option>
            </select>-to-
            <select name="timeEnd" value={this.state.timeEnd} onChange={this.handleInputChange}>
                <option value={1}>01:00</option>
                <option value={2}>02:00</option>
                <option value={3}>03:00</option>
                <option value={4}>04:00</option>
                <option value={5}>05:00</option>
                <option value={6}>06:00</option>
                <option value={7}>07:00</option>
                <option value={8}>08:00</option>
                <option value={9}>09:00</option>
                <option value={10}>10:00</option>
                <option value={11}>11:00</option>
                <option value={12}>12:00</option>
                <option value={13}>13:00</option>
                <option value={14}>14:00</option>
                <option value={15}>15:00</option>
                <option value={16}>16:00</option>
                <option value={17}>17:00</option>
                <option value={18}>18:00</option>
                <option value={19}>19:00</option>
                <option value={20}>20:00</option>
                <option value={21}>21:00</option>
                <option value={22}>22:00</option>
                <option value={23}>23:00</option>
                <option value={24}>24:00</option>
            </select><br></br>
            Address - <button type='button' onClick={this.setSameAddress}>Same as Account Address</button><br></br>
            Street: <input name='street' type="text" value={this.state.street} onChange={this.handleInputChange} maxLength='30' required/><br></br>
            City: <input name='city' type="text" value={this.state.city} onChange={this.handleInputChange} maxLength='30' required/><br></br>
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
            Zip: <input name='zip' type="text" value={this.state.zip} onChange={this.handleInputChange} maxLength='10' required/><br></br>
            <br></br><input type='submit' value="Submit" />
        </form>

        </div>
        );
    }
}

export default GymForm;