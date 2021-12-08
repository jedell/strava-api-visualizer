import { useState, useEffect } from "react";
import { connect } from "react-redux";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import "./css/Visualizer.css"
import { decodePolyline } from "../utils"

//TODO: Persistent storage between refresh
// ability to display choice of activity via dropdown
// break individual activity polyline down and shade sections based on pace.

require("dotenv").config()

const Visualizer = ({ user, returnTokens }) => {
    const [userData, setUserData] = useState(user.data);

    const activity = userData[0].map.summary_polyline;
    const polyline = decodePolyline(activity);
    const center = userData[0].start_latlng;

    return (
        <div>
            <h1>Total Runs:</h1>
            <h1>{0}</h1>
            <div id="map" style={{ height: '100vh', width: '100vw', background: "blue" }}>
                <MapContainer center={center} zoom={13} scrollWheelZoom={false}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[51.505, -0.09]}>
                        <Popup>
                            A pretty CSS3 popup. <br /> Easily customizable.
                        </Popup>
                    </Marker>
                    <Polyline positions={polyline}></Polyline>
                </MapContainer>
            </div>
        </div>

    )
}

const mapStateToProps = (state) => {
    return {
        user: state.user,
        returnTokens: state.returnTokens,
    };
};

export default connect(mapStateToProps)(Visualizer);