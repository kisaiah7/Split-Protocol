import React from 'react';
import Blockies from 'react-blockies';

interface BlockieProps {
  address: string;
}

export const Blockie = (props: BlockieProps) => (
  <Blockies seed={props.address} className="rounded-full" />
);
