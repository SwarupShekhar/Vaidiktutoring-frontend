"use client";

import React from "react";

const FacebookButton = () => {
  return (
    <a
      href="https://www.facebook.com/profile.php?id=61589216506298"
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex items-center justify-center w-[45px] h-[45px] rounded-full overflow-hidden transition-all duration-400 hover:w-[110px] hover:rounded-[30px] bg-[#1877f2] text-white no-underline border-none cursor-pointer"
      aria-label="Follow us on Facebook"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="1.5em"
        viewBox="0 0 320 512"
        className="fill-white transition-opacity duration-300 group-hover:opacity-0"
      >
        <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z" />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center font-semibold text-white opacity-0 transition-opacity duration-400 group-hover:opacity-100">
        Facebook
      </span>
    </a>
  );
};

export default FacebookButton;
