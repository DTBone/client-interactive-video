/* eslint-disable react/prop-types */
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { useEffect, useState, useRef } from "react";

function Banner({ banners, interval = 3000 }) {
    const count = banners.length;
    const [current, setCurrent] = useState(1);
    const [isTransitioning, setIsTransitioning] = useState(true);
    const sliderRef = useRef(null);

    const nextBanner = () => {
        setCurrent((prev) => (prev + 1) );
    };

    const prevBanner = () => {
        setCurrent((prev) => (prev - 1 ));
    };
    const handleTransitionEnd = () => {
        if (current >= count + 1) {
            setIsTransitioning(false);
            setCurrent(1);
        } else if (current <= 0) {
            setIsTransitioning(false);
            setCurrent(count);
        }
    };


    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1));
        }, interval);
        return () => clearInterval(timer);
    }, [count, interval, current]);
    useEffect(() => {
        if (!isTransitioning) {
            setTimeout(() => setIsTransitioning(true), 50);
        }
    }, [isTransitioning]);

    return (
        <div className="relative w-full h-full max-h-[240px] rounded-xl overflow-hidden">
            <div
                ref={sliderRef}
                className="flex h-full duration-1000"
                style={{
                    width: `${(count+2) * 100}%`,
                    transform: `translate3d(-${current * 1347}px, 0px, 0px)`,
                    transition: isTransitioning ? "transform 0.8s ease-in-out" : "none",
                }}
                onTransitionEnd={handleTransitionEnd}
            >
                <img
                        key={-1}
                        src={banners[count-1]}
                        alt="Banner"
                        className="h-full object-cover rounded-xl flex-shrink-0"
                        style={{ width: "1347px" }}
                    />
                {banners.map((banner, index) => (
                    <img
                        key={index}
                        src={banner}
                        alt="Banner"
                        className="h-full object-cover rounded-xl flex-shrink-0"
                        style={{ width: "1347px" }}
                    />
                ))}
                <img
                        key={count}
                        src={banners[0]}
                        alt="Banner"
                        className="h-full object-cover rounded-xl flex-shrink-0"
                        style={{ width: "1347px" }}
                    />
                
            </div>

            <button
                onClick={prevBanner}
                className="absolute left-1 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md"
            >
                <ArrowBack />
            </button>
            <button
                onClick={nextBanner}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md"
            >
                <ArrowForward />
            </button>
        </div>
    );
}

export default Banner;
