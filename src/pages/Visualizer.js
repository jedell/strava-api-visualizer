import React from "react";
import { connect } from "react-redux";

const Visualizer = ( { user, returnTokens } ) => {
    console.log(user)
    return (
        <div>
        <h1>Total Runs:</h1>
        <h1>{0}</h1>
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