'use client';

import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import './ThemeToggle.css';

const ThemeToggle = () => {
    const { setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const isDark = mounted ? resolvedTheme === 'dark' : true; // Default to dark on SSR so it matches the default theme

    const toggleTheme = () => {
        setTheme(isDark ? 'light' : 'dark');
    };

    return (
        <div className="theme-toggle-wrapper">
            <label className="bb8-toggle">
                <input
                    className="bb8-toggle__checkbox"
                    type="checkbox"
                    checked={isDark}
                    onChange={toggleTheme}
                />
                <div className="bb8-toggle__container">
                    <div className="bb8-toggle__scenery">
                        <div className="bb8-toggle__star" />
                        <div className="bb8-toggle__star" />
                        <div className="bb8-toggle__star" />
                        <div className="bb8-toggle__star" />
                        <div className="bb8-toggle__star" />
                        <div className="bb8-toggle__star" />
                        <div className="bb8-toggle__star" />
                        <div className="tatto-1" />
                        <div className="tatto-2" />
                        <div className="gomrassen" />
                        <div className="hermes" />
                        <div className="chenini" />
                        <div className="bb8-toggle__cloud" />
                        <div className="bb8-toggle__cloud" />
                        <div className="bb8-toggle__cloud" />
                    </div>
                    <div className="bb8">
                        <div className="bb8__head-container">
                            <div className="bb8__antenna" />
                            <div className="bb8__antenna" />
                            <div className="bb8__head" />
                        </div>
                        <div className="bb8__body" />
                    </div>
                    <div className="artificial__hidden">
                        <div className="bb8__shadow" />
                    </div>
                </div>
            </label>
        </div>
    );
};

export default ThemeToggle;
