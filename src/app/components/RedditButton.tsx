"use client";

import React from "react";

const RedditButton = () => {
  return (
    <a
      href="https://www.reddit.com/r/thestudyhours_dev/"
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex items-center justify-center w-[45px] h-[45px] rounded-full overflow-hidden transition-all duration-400 hover:w-[110px] hover:rounded-[30px] bg-[#ff4500] text-white no-underline border-none cursor-pointer"
      aria-label="Join our Reddit community"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="1.5em"
        viewBox="0 0 512 512"
        className="fill-white transition-opacity duration-300 group-hover:opacity-0"
      >
        <path d="M373 138.6c-25.2 0-46.3-17.5-51.9-41l-30.6-6.8 .9-.2c-16.8-3.6-24.5 8.7-25.4 15.1-5.4 37.1-27.8 40.4-40.7 40.6 5.7 4.4 15.8 12.8 25.4 24.5 22.9-23.2 50.3-32.6 58.6-33.3 8.6-2.8 25.4-3.6 25.4-3.6h.2c17.9 0 34.4-7.1 46.4-19a71 71 0 0 0 -14.7-31.5 25.1 25.1 0 0 1 -3.3 .5 25.8 25.8 0 0 1 -6.5 .8h-13.2zM160 288a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm157.9 82.7c-6.5 6.5-24.7 22.1-61.9 22.1s-55.4-15.6-61.9-22.1c-4.7-4.7-12.3-4.7-17 0s-4.7 12.3 0 17c10.5 10.5 34.5 29.1 78.9 29.1s68.4-18.6 78.9-29.1c4.7-4.7 4.7-12.3 0-17s-12.3-4.7-17 0zM288 288a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zM256 0a256 256 0 1 0 0 512A256 256 0 1 0 256 0zM94 220.8c-6.4 5.1-10.3 12.7-10.3 21.2 0 14.9 12.1 27 27 27a26.9 26.9 0 0 0 5.4-.5c19.5 20.4 55.1 34.2 100.5 35.8l-19.4 90.9c-1.4 6.5 2.7 12.9 9.2 14.3s12.9-2.7 14.3-9.2l17-79.9c4.6 .3 9.3 .4 14.1 .4s9.5-.1 14.1-.4l17 79.9c1.4 6.5 7.8 10.6 14.3 9.2s10.6-7.8 9.2-14.3l-19.4-90.9c45.4-1.6 81-15.4 100.5-35.8a26.9 26.9 0 0 0 5.4 .5c14.9 0 27-12.1 27-27 0-8.5-3.9-16.1-10.1-21.1A55.4 55.4 0 0 0 480 191.2C480 160.6 455.2 136 424.6 136c-14.5 0-27.6 5.6-37.5 14.7-31.9-22-73.9-36.2-120.5-38.4l24.3-114.3c1.4-6.5-2.8-12.9-9.3-14.3s-12.9 2.8-14.3 9.3L242.3 108.2c-47.4 2-90.2 16.2-122.6 38.5a55.4 55.4 0 0 0 -37.5-14.7c-30.6 0-55.4 24.8-55.4 55.4a55.4 55.4 0 0 0 22.2 33.4z" />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center font-semibold text-white opacity-0 transition-opacity duration-400 group-hover:opacity-100">
        Reddit
      </span>
    </a>
  );
};

export default RedditButton;
