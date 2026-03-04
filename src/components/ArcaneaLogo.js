
import React from 'react';
import { motion } from 'framer-motion';

const ArcaneaLogo = ({ size = 64, className = "" }) => {
    return (
        <motion.svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
        >
            <defs>
                <linearGradient id="arcaneGradient" x1="0" y1="0" x2="100" y2="100">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
            </defs>

            {/* Outer Ring */}
            <motion.circle
                cx="50" cy="50" r="45"
                stroke="url(#arcaneGradient)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="283"
                strokeDashoffset="283"
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 2, ease: "easeInOut" }}
            />

            {/* Abstract Inner Shape - 'A' Rune */}
            <motion.path
                d="M50 20 L25 80 L75 80 Z"
                stroke="url(#arcaneGradient)"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
            />

            {/* Center Core */}
            <motion.circle
                cx="50" cy="55" r="5"
                fill="#ffffff"
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ duration: 0.8, delay: 1.5, type: "spring" }}
            />

            {/* Dynamic Pulse */}
            <motion.circle
                cx="50" cy="55" r="5"
                stroke="#ffffff"
                strokeWidth="1"
                initial={{ opacity: 0, scale: 1 }}
                animate={{ opacity: [0, 0.8, 0], scale: [1, 2, 3] }}
                transition={{ duration: 2, repeat: Infinity, delay: 2 }}
            />
        </motion.svg>
    );
};

export default ArcaneaLogo;
