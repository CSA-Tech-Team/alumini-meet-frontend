import { motion, useViewportScroll, useTransform } from 'framer-motion';
import {PSG_A_block_Cropped, PSG_Medium_Cropped} from "@/assets";


const ParallaxComponent = () => {
    const { scrollY } = useViewportScroll();
    const y1 = useTransform(scrollY, [0, 1000], [0, 100]);
    const y2 = useTransform(scrollY, [0, 1000], [-200, -500]);

    return (
        <div style={{ height: '130vh', position: 'relative' }}>
            <motion.div
                style={{
                    width: '80vw',
                    height: '60vh',
                    translateY: '-10vh',
                    zIndex: -1,
                    y: y1,
                }}
                className={'flex flex-row items-center justify-center'}
            >
                <img src={PSG_Medium_Cropped} className={'h-full'}/>
            </motion.div>
            <motion.div
                style={{
                    width: '90vw',
                    height: '70vh',
                    translateX: '-10vh',
                    // backgroundColor: 'lightcoral',
                    y: y2,
                }}
                className={'flex flex-row items-center justify-between'}
            >
                <img src={PSG_A_block_Cropped} className={'h-full'}/>
                <img src={PSG_A_block_Cropped} className={'h-full mt-100'}/>
            </motion.div>
        </div>
    );
};

export default ParallaxComponent;
