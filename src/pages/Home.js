// import './App.css';
import { useEffect } from 'react';
require("dotenv").config()

const clientID = process.env.REACT_APP_STRAVA_CLIENT_ID;

const Home = () => {
  const redirectUrl = "http://localhost:3000/redirect"
  const scope = "read_all,profile:read_all,activity:read_all"

  const handleLogin = () => {
    window.location = `http://www.strava.com/oauth/authorize?client_id=${clientID}&response_type=code&redirect_uri=${redirectUrl}/exchange_token&approval_prompt=force&scope=${scope}`;
  };

  // refresh token and call address
  // const refreshToken = process.env.REACT_APP_STRAVA_REFRESH_TOKEN;
  // const callRefresh = `https://www.strava.com/oauth/token?client_id=${clientID}&client_secret=${clientSecret}&refresh_token=${refreshToken}&grant_type=refresh_token`
  // const callActivities = `https://www.strava.com/api/v3/athlete/activities?access_token=`

//   function showUser() {
//     if (!isLoggedIn) return <>Log In</>
//     if (isLoggedIn) {
//       console.log(user)
//       return user
//     }
//   }

  useEffect(() => {
    // showUser()
  });


  return (
    <div>
      <button onClick={handleLogin}>Connect with Strava</button>
    </div>
  )
}

export default Home;
