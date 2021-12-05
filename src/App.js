import './App.css';
import { useState, useEffect } from 'react';

require("dotenv").config()


function App() {
  const [isLoggedIn, setisLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [activities, setActivities] = useState({})

  const redirectUrl = "http://localhost:3000/redirect"
  const scope = "read"

  const clientID = process.env.REACT_APP_STRAVA_CLIENT_ID;
  const clientSecret = process.env.REACT_APP_STRAVA_CLIENT_SECRET;
  console.log(process.env.REACT_APP_STRAVA_CLIENT_ID)

  const handleLogin = () => {
    window.location = `http://www.strava.com/oauth/authorize?client_id=${clientID}&response_type=code&redirect_uri=${redirectUrl}/exchange_token&approval_prompt=force&scope=${scope}`;
    let stravaAuthToken = window.location.search.split("&")[1].slice(5);
    console.log(stravaAuthToken)
  };

  // refresh token and call address
  const refreshToken = process.env.REACT_APP_STRAVA_REFRESH_TOKEN;
  const callRefresh = `https://www.strava.com/oauth/token?client_id=${clientID}&client_secret=${clientSecret}&refresh_token=${refreshToken}&grant_type=refresh_token`
  const callActivities = `https://www.strava.com/api/v3/athlete/activities?access_token=`

  function showActivities() {
    if (isLoading) return <>LOADING</>
    if (!isLoading) {
      console.log(activities)
      return <div>{activities.username}</div>
    }
  }
  useEffect(() => {
    fetch(callRefresh, {
      method: 'POST'
    })
      .then(res => res.json())
      .then(result => {
        console.log(result)
        fetch(callActivities + result.access_token)
          .then(res => res.json())
          .then(data => setActivities(data), setIsLoading(prev => !prev))
          .catch(e => console.log(e))
      })
  }, [callRefresh, callActivities])

  return (
    <div>
      <button onClick={handleLogin}>Connect with Strava</button>
      {showActivities()}
    </div>
  )
}

export default App;
