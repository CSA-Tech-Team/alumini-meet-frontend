import { motion } from 'framer-motion';

const FlippedWords = ({ text, indent = false, className = '' }: { text: string, indent?: boolean, className?: string }) => {
    const lines = text.split('\n');

    return (
        <div className={`flex flex-col w-full ${indent ? 'items-start' : 'items-center'}`}>
            {lines.map((line, lineIdx) => {
                const words = line.trim().split(' ');
                return (
                    <div
                        key={lineIdx}
                        className="flex flex-wrap justify-center w-full overflow-visible"
                    >
                        {words.map((word, wordIdx) => (
                            <div
                                key={wordIdx}
                                className="whitespace-nowrap flex overflow-visible px-2" // Increased padding
                            >
                                {Array.from(word).map((char, charIdx) => (
                                    <motion.span
                                        key={charIdx}
                                        initial={{ rotateY: 90, x: 100 }}
                                        whileInView={{ rotateY: 0, x: 0 }}
                                        transition={{
                                            duration: 0.75,
                                            ease: 'easeInOut',
                                            delay: lineIdx * 0.4 + wordIdx * 0.2 + charIdx * 0.05,
                                        }}
                                        viewport={{ once: true }} 
                                        className={`inline-block font-cormorant text-[clamp(2.5rem,8vw,3.5rem)] sm:text-[5rem] md:text-[8rem] lg:text-[12rem] leading-[1] tracking-tight ${className}`}
                                    >
                                        {char.toUpperCase()}
                                    </motion.span>
                                ))}
                                <span className="w-[clamp(4px,1.5vw,8px)]" />
                            </div>
                        ))}
                    </div>
                );
            })}
        </div>
    );
};

export default FlippedWords;