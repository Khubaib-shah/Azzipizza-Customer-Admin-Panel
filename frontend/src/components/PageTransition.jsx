import { motion } from "framer-motion";
import { useEffect } from "react";

const pageVariants = {
    initial: {
        opacity: 0,
    },
    animate: {
        opacity: 1,
    },
    exit: {
        opacity: 0,
    },
};

const pageTransition = {
    duration: 0.3,
    ease: "easeInOut",
};

// Overlay layer that appears during transition
const overlayVariants = {
    initial: {
        opacity: 0,
    },
    animate: {
        opacity: 0,
    },
    exit: {
        opacity: 0,
    },
};

function PageTransition({ children }) {
    useEffect(() => {
        // Scroll to top instantly on page change
        window.scrollTo({ top: 0, behavior: "instant" });
    }, []);

    return (
        <>
            {/* Overlay layer */}
            <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={overlayVariants}
                transition={{ duration: 0.15 }}
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: "linear-gradient(135deg, rgba(220, 38, 38, 0.1) 0%, rgba(245, 158, 11, 0.1) 100%)",
                    pointerEvents: "none",
                    zIndex: 9998,
                }}
            />

            {/* Page content */}
            <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
                transition={pageTransition}
                style={{ width: "100%" }}
            >
                {children}
            </motion.div>
        </>
    );
}

export default PageTransition;
