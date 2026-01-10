import React from "react";
import "./LoadingSpinner.css";

function LoadingSpinner({ fullScreen = false, message = "Loading..." }) {
    const content = (
        <div className="loading-spinner-container">
            <div className="pizza-loader">
                <div className="pizza-slice"></div>
                <div className="pizza-slice"></div>
                <div className="pizza-slice"></div>
                <div className="pizza-slice"></div>
                <div className="pizza-slice"></div>
                <div className="pizza-slice"></div>
            </div>
            {message && <p className="loading-message">{message}</p>}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="loading-spinner-fullscreen">
                {content}
            </div>
        );
    }

    return content;
}

export default LoadingSpinner;
