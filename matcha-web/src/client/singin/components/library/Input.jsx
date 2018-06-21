import React from 'react';

function Input({type,name,className,id,value,onChange}) {
  return (
    <input
      type={type}
      name={name}
      className={className}
      id={id}
      value={value}
      onChange={onChange}
    />
  );
}

export default Input;
