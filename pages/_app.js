
import '../styles/globals.css';
import { AnimatePresence } from 'framer-motion';

function MyApp({ Component, pageProps, router }) {
    return (
        <AnimatePresence mode="wait">
            <Component {...pageProps} key={router.pathname} />
        </AnimatePresence>
    );
}

export default MyApp;
