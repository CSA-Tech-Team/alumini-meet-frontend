import { motion } from 'framer-motion';


const FlippedWords = ({
    text,
    indent = false,
    className = '',          // additional tailwind classes for characters
    wordGap = 'gap-x-2',     // horizontal gap between words
}: {
    text: string;
    indent?: boolean;
    className?: string;
    wordGap?: string;
}) => {
    const lines = text.split('\n');

    return (
        <div
            className={`w-full text-[#c19a5b] font-bold flex flex-col ${indent ? 'items-start' : 'items-center'}`}
        >
            {lines.map((line, lineIdx) => (
                <div
                    key={lineIdx}
                    className={`w-full flex flex-wrap ${indent ? 'justify-start' : 'justify-center'} ${wordGap}`}
                >
                    {line.trim().split(' ').map((word, wordIdx) => (
                        <div
                            key={wordIdx}
                            className="flex overflow-visible"
                        >
                            {Array.from(word).map((char, charIdx) => (
                                <motion.span
                                    key={charIdx}
                                    initial={{ rotateY: 90, x: 50 }}
                                    whileInView={{ rotateY: 0, x: 0 }}
                                    transition={{
                                        duration: 0.75,
                                        ease: 'easeInOut',
                                        delay: lineIdx * 0.4 + wordIdx * 0.2 + charIdx * 0.05,
                                    }}
                                    viewport={{ once: true }}
                                    className={`inline-block font-cormorant leading-none tracking-tight text-[clamp(2rem,6vw,4rem)] sm:text-[clamp(2rem,7vw,5rem)] md:text-[clamp(3rem,8vw,6rem)] ${className}`}
                                >
                                    {char}
                                </motion.span>
                            ))}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default FlippedWords;
