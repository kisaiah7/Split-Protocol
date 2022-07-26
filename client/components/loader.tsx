import React from 'react';
import { Rings } from 'react-loader-spinner';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';

const SpinnerLoading = () => {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <Rings color="#4b06ff" height={100} width={100} />
    </div>
  );
};

export default SpinnerLoading;
