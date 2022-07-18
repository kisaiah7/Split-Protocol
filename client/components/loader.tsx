import React from 'react';
import { Rings } from 'react-loader-spinner';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";


const SpinnerLoading = () => {
    return (
        <div style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto', height: '100px', width: '100px' }}>
            <Rings
                color="#4b06ff"
                height={100}
                width={100}
            />
        </div>
    )
}

export default SpinnerLoading;