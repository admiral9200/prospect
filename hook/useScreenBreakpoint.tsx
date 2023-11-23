import { useEffect, useState } from "react";
import { useWindowSize } from "react-use";

export default function useScreenBreakpoint() {
    const windowSize = useWindowSize();
    const [breakpoint, setBreakpoint] = useState<string>('');

    useEffect(() => {
        const { width } = windowSize;
        if (width < 640) {
            setBreakpoint('sm');
        } else if (width < 960) {
            setBreakpoint('md');
        } else {
            setBreakpoint('lg');
        }
    }, [windowSize])

    return breakpoint;
}