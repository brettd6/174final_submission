/*
    Brett Davis - 174 Final Frontend
    main function App.js: includes Axios http calls to accountform, gymform, poolform, also is the main function which
    calls and displays available gyms/pools and their available times from the backend and database
*/

import './App.css';
import { useEffect, useState } from 'react';
import PoolForm from './PoolForm';
import GymForm from './GymForm';
import AccountForm from './AccountForm';
import Axios from 'axios';

function App() {
  const [loggedIn, toggleLogin] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [activeSection, toggleSection] = useState('');
  const [accountPopup, toggleAccountPopup] = useState(false);
  const [facilCount, setFacilCount] = useState('');
  const [gymList, setGymList] = useState([]);
  const [gymTimes, setGymTimes] = useState([]);
  const [poolList, setPoolList] = useState([]);
  const [poolTimes, setPoolTimes] = useState([]);
  
  function attemptLogin(username, password) {

    //sends validation request to backend
    Axios.get(process.env.REACT_APP_BACKEND + '/api/validatepassword', {params: {username: username, password: password}}).then((response) => {
        if (response.data)
          toggleLogin(true);
        else
          alert('Incorrect username or password');
    })
  }

  function logout() {
    toggleLogin(false);
    setUsername('');
    setPassword('');
    toggleSection('');
  }

  //gets all relevant information that might need to be displayed, is refreshed on section change
  useEffect(() => {
    Axios.get(process.env.REACT_APP_BACKEND + '/api/facilCount').then((response) => {
      setFacilCount(response.data[0].facilCount);
    })
    Axios.get(process.env.REACT_APP_BACKEND + '/api/getGyms').then((response) => {
      setGymList(response.data);
    });
    Axios.get(process.env.REACT_APP_BACKEND + '/api/getGymTimes').then((response) => {
      setGymTimes(response.data);
    });
    Axios.get(process.env.REACT_APP_BACKEND + '/api/getPools').then((response) => {
      setPoolList(response.data);
    });
    Axios.get(process.env.REACT_APP_BACKEND + '/api/getPoolTimes').then((response) => {
      setPoolTimes(response.data);
    });
  },[activeSection]);

  const unSelectgid = (gid) => {
    let elements = document.getElementsByClassName('rent-select');
    for (var i = 0; i < elements.length; i++) {
      if (elements[i].id !== ('gymTime' + gid)) elements[i].value = -1;
    }
  }

  const unSelectpid = (pid) => {
    let elements = document.getElementsByClassName('rent-select');
    for (var i = 0; i < elements.length; i++) {
      if (elements[i].id !== ('poolTime' + pid)) elements[i].value = -1;
    }
  }

  //function sends entry to CUSTOMER_RENTS_GYM
  const handleGymSubmit = (gid, availTime) => {
    Axios.post(process.env.REACT_APP_BACKEND + '/api/rentGym', {username: username, gid: gid, availTime: availTime})
    .then((response) => {
      if(response.data.errno)
        alert('Error Gym not Booked');
      else {
        toggleSection('');
        availTime < 10 ? alert('Gym ID: ' + gid + ' Booked at 0' + availTime + ':00!') 
        : alert('Gym ID: ' + gid + ' Booked at ' + availTime + ':00!');
      }
    })
  }

  //function sends entry to CUSTOMER_RENTS_POOL
  const handlePoolSubmit = (pid, availTime) => {
    Axios.post(process.env.REACT_APP_BACKEND + '/api/rentPool', {username: username, pid: pid, availTime: availTime})
    .then((response) => {
      if(response.data.errno)
        alert('Error Pool not Booked.');
      else {
        toggleSection('');
        availTime < 10 ? alert('Pool ID: ' + pid + ' Booked at 0' + availTime + ':00!') 
        : alert('Pool ID: ' + pid + ' Booked at ' + availTime + ':00!');
      }
    })
  }

  return (
    <div className="App">
      <div className="login-area">
      {loggedIn ? 
        <> 
          <button className='logout-btn' onClick={() => logout()}>Logout</button><br></br>
          <h1>Welcome, {username}</h1>
        </>
        : <>
          <input placeholder='username' value={username} onChange={(e) => setUsername(e.target.value)} required/>
          <input type ='password' placeholder='password' value={password} onChange={(e) => setPassword(e.target.value)} required/>
          <div className='logout-area'>
            <br></br><button onClick={() => attemptLogin(username, password)}>Login</button>
            <button onClick={() => toggleAccountPopup(!accountPopup)}>Create Account</button>
          </div>
        </>}
      </div>
      {accountPopup ? <div className='account-popup'>
      <button onClick={() => toggleAccountPopup(!accountPopup)}><code>&#10006;</code></button>
      <AccountForm setUsername = {setUsername} toggleAccountPopup = {toggleAccountPopup} toggleLogin = {toggleLogin}/></div> : <></>}
      <div className='bottom-section'>
        <div className='facil-count'>
          <h1>There are currently {facilCount} facilities listed!</h1>
        </div>
        <div className='section-btn'>
          <button onClick={() => toggleSection('gym')}>View Gyms</button>
          <button onClick={() => toggleSection('pool')}>View Pools</button>
          <button onClick={loggedIn ? () => toggleSection('upload-gym') : () => alert("Please Log In To Upload a Pool.")}>Upload Gym</button>
          <button onClick={loggedIn ? () => toggleSection('upload-pool') : () => alert("Please Log In To Upload a Gym.")}>Upload Pool</button>
        </div>
        <div className="form-area">
          {activeSection === 'gym' ? 
              <>
              <b>Available Gyms</b><br></br><br></br>
              {gymList.length ? gymList.map((val) => {
                var selName = 'gymTime' + val.gid;
                return <div className='gym-list' key={val.gid}>
                  Gym ID: {val.gid}<br></br>
                  Host Username: {val.hostName}<br></br>
                  {val.hasTreadmill.data[0] === 1 ? <>Has Treadmill</> : <>No Treadmill</>}<br></br>
                  {val.hasDumbbells.data[0] === 1 ? <>Has Dumbbells</> : <>No Dumbbells</>}<br></br>
                  Address:<br></br>
                  Street: {val.street}<br></br>
                  City: {val.city}<br></br>
                  State: {val.state}<br></br>
                  Zip: {val.zip}<br></br>
                  <select className='rent-select' id={selName} defaultValue={-1} onClick={() => unSelectgid(val.gid)}>
                    <option value = {-1} disabled>View Available Times</option> 
                    {gymTimes.map((tval) => val.gid===tval.gid ? tval.availTime<10 ? <option key={`${val.gid} + ${tval.availTime}`} value={tval.availTime}>0{tval.availTime}:00</option> :
                    <option key={`${val.gid} + ${tval.availTime}`} value={tval.availTime}>{tval.availTime}:00</option> : <></>)}
                  </select><br></br>
                  <button onClick={loggedIn ? () => handleGymSubmit(val.gid, document.getElementById('gymTime' + val.gid).value)
                  : () => alert("Please Log In Book a Gym.")}>Book</button><br></br><br></br>
                </div>
              }) : <>Please Refresh the Page and Try Again</>}
              </>
            : activeSection === 'pool' ?
              <>
              <b>Available Pools</b><br></br><br></br>
              {poolList.length ? poolList.map((val) => {
                var selName = 'poolTime' + val.pid;
                return <div className='pool-list' key={val.pid}>
                  Pool ID: {val.pid}<br></br>
                  Host Username: {val.hostName}<br></br>
                  Size: {val.size}ft<sup>3</sup><br></br>
                  {val.hasLifeguard.data[0] === 1 ? <>Has Lifeguard</> : <>No Lifeguard</>}<br></br>
                  Address:<br></br>
                  Street: {val.street}<br></br>
                  City: {val.city}<br></br>
                  State: {val.state}<br></br>
                  Zip: {val.zip}<br></br>
                  <select className='rent-select' id={selName} defaultValue={-1} onClick={() => unSelectpid(val.pid)}>
                    <option value = {-1} disabled>View Available Times</option>
                    {poolTimes.map((tval) => val.pid===tval.pid ? tval.availTime<10 ? <option key={`${val.pid} + ${tval.availTime}`} value={tval.availTime}>0{tval.availTime}:00</option> :
                    <option key={`${val.pid} + ${tval.availTime}`} value={tval.availTime}>{tval.availTime}:00</option> : <></>)}
                  </select><br></br>
                  <button onClick={loggedIn ? () => handlePoolSubmit(val.pid, document.getElementById('poolTime' + val.pid).value)
                  : () => alert("Please Log In to Book a Pool.")}>Book</button><br></br><br></br>
                </div>
              }) : <>Please Refresh the Page and Try Again</>}
              </>
            : activeSection === "upload-gym" ?
            <><GymForm username = {username} toggleSection = {toggleSection}/></>
            : activeSection === "upload-pool" ?
            <><PoolForm username = {username} toggleSection = {toggleSection}/></>
            : <></>}
        </div>
      </div>
    </div>
  );
}

export default App;

