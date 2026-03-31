import React from 'react';

const FloatingInput = ({ label, type = "text", ...props }) => {
  return (
    <div className="relative mt-4">
      <input
        type={type}
        className="peer h-12 w-full rounded-xl border border-gray-600 bg-transparent px-4 text-white placeholder-transparent focus:border-blue-500 focus:outline-none"
        placeholder={label}
        {...props}
      />
      <label
        className="absolute left-4 -top-2.5 bg-[#121212] px-1 text-sm text-blue-500 transition-all 
                   peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 
                   peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-500"
      >
        {label}
      </label>
    </div>
  );
};

export default FloatingInput;