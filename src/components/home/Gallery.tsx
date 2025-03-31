import FlippedWords from "@/components/home/FlippedWords.tsx";
import AnimateSentences from "@/components/home/AnimateSentences.tsx";
import { useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { motion } from "framer-motion";
import { PSG_A_block_Cropped } from "@/assets";

const heading: string = "Do you\nRemember this?";
const content: string = "Our nostalgic memories, never disappears";

// You can replace these with your actual images
const images = Array(17).fill(PSG_A_block_Cropped);

export const ParallaxScroll = ({
                                   images,
                                   className,
                               }: {
    images: string[];
    className?: string;
}) => {
    const gridRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: gridRef,
        offset: ["start start", "end start"],
    });

    const translateFirst = useTransform(scrollYProgress, [0, 1], [0, -200]);
    const translateSecond = useTransform(scrollYProgress, [0, 1], [0, 200]);
    const translateThird = useTransform(scrollYProgress, [0, 1], [0, -200]);

    const third = Math.ceil(images.length / 3);
    const firstPart = images.slice(0, third);
    const secondPart = images.slice(third, 2 * third);
    const thirdPart = images.slice(2 * third);

    return (
        <div
            className={`h-[40rem] items-start w-full ${className}`}
            ref={gridRef}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-start max-w-5xl mx-auto gap-10 py-40 px-10">
                <div className="grid gap-10">
                    {firstPart.map((el, idx) => (
                        <motion.div
                            style={{ y: translateFirst }}
                            key={`grid-1-${idx}`}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: idx * 0.1 }}
                        >
                            <motion.img
                                src={el}
                                className="h-80 w-full object-cover object-left-top rounded-lg gap-10 !m-0 !p-0"
                                height={400}
                                width={400}
                                alt="thumbnail"
                            />
                        </motion.div>
                    ))}
                </div>
                <div className="grid gap-10">
                    {secondPart.map((el, idx) => (
                        <motion.div
                            style={{ y: translateSecond }}
                            key={`grid-2-${idx}`}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: idx * 0.1 + 0.1 }}
                        >
                            <motion.img
                                src={el}
                                className="h-80 w-full object-cover object-left-top rounded-lg gap-10 !m-0 !p-0"
                                height={400}
                                width={400}
                                alt="thumbnail"
                            />
                        </motion.div>
                    ))}
                </div>
                <div className="grid gap-10">
                    {thirdPart.map((el, idx) => (
                        <motion.div
                            style={{ y: translateThird }}
                            key={`grid-3-${idx}`}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: idx * 0.1 + 0.2 }}
                        >
                            <motion.img
                                src={el}
                                className="h-80 w-full object-cover object-left-top rounded-lg gap-10 !m-0 !p-0"
                                height={400}
                                width={400}
                                alt="thumbnail"
                            />
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const Gallery = () => {
    return (
        <div className="my-20">
            <div className="max-w-6xl mx-auto px-4 mb-10">
                <FlippedWords text={heading} indent={true} />
                <AnimateSentences content={content} className={''} />
            </div>
            <ParallaxScroll images={images} />
        </div>
    );
};

export default Gallery;