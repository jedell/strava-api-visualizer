import { useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import _ from "lodash";
import { connect } from "react-redux";
import axios from "axios"
import { setUser, setUserActivities } from "../actions";

require("dotenv").config()

const clientID = process.env.REACT_APP_STRAVA_CLIENT_ID;
const clientSecret = process.env.REACT_APP_STRAVA_CLIENT_SECRET;

const getAuth = async (authToken) => {
    try {
        const response = await axios.post(
            `https://www.strava.com/api/v3/oauth/token?client_id=${clientID}&client_secret=${clientSecret}&code=${authToken}&grant_type=authorization_code`
        );
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

const getUserData = async (userID, accessToken) => {
    try {
        const response = await axios.get(
            `https://www.strava.com/api/v3/athlete/activities?before=1636308197&after=0&page=1&per_page=20`,
            { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        return response;
    } catch (error) {
        console.log(error);
    }
};


// setUser(getUserData(userID, accessToken));
// setisLoggedIn(true);

const Redirect = props => {
    const navigate = useNavigate();
    const location = useLocation();
    const authenticate = async () => {

        try {
            if (_.isEmpty(location)) {
                return navigate("/")
            }
            let stravaAuthToken = location.search.split("&")[1].slice(5);

            const tokens = await getAuth(stravaAuthToken);
            props.setUser(tokens);

            const accessToken = tokens.access_token;
            const userID = tokens.athlete.id;

            const user = await getUserData(userID, accessToken);
            props.setUserActivities(user); 

            navigate("/visualizer");

        } catch (error) {
            navigate("/")
        }
    };
    useEffect(() => {
        authenticate();
    });

    return (
        <div>Loading</div>
    )
}

const mapStateToProps = (state) => {
    return { authTokenURL: state.authTokenURL };
};

export default connect(mapStateToProps, {
    setUserActivities,
    setUser,
})(Redirect);