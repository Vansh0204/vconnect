import React, { useEffect, useState } from 'react';

function LoadingScreen({ onLoadingComplete }) {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => onLoadingComplete(), 300);
                    return 100;
                }
                return prev + 10;
            });
        }, 150);

        return () => clearInterval(interval);
    }, [onLoadingComplete]);

    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center z-50 overflow-hidden bg-white">
            {/* Background Image with Overlay */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: 'url(/loading-bg.jpg)' }}
            >
                <div className="absolute inset-0 bg-white/85 backdrop-blur-[2px]"></div>
            </div>

            <div className="text-center relative z-10">
                {/* Title */}
                <h1 className="text-4xl md:text-5xl font-extrabold text-[#111] mb-4 animate-fade-in-up">
                    Volunteer Connect
                </h1>
                <p className="text-[#616161] text-lg mb-8 animate-fade-in-up delay-100">Making a difference together</p>

                {/* Progress Bar */}
                <div className="w-64 h-3 bg-[#f0f0f0] rounded-full overflow-hidden mx-auto border border-[#eee] shadow-inner">
                    <div
                        className="h-full bg-[#2362ef] transition-all duration-300 ease-out rounded-full"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <p className="text-[#999] text-sm mt-3 font-medium">{progress}%</p>
            </div>
        </div>
    );
}

export default LoadingScreen;
