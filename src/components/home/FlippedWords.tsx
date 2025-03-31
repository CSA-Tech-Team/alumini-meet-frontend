import {motion} from 'framer-motion';

const FlippedWords = ({text,indent = false}: { text: string,indent?:boolean }) => {

    const words: string[] = text.split('\n');

    return <div className={`flex flex-col ${indent ? 'items-start' : 'items-center'}`}>
        {words.map((word: string, wrd_idx: number) => {
            const chars = Array.from(word);
            return <div key={wrd_idx} className="flex flex-row">
                {chars.map((char, char_idx: number) =>
                    char !== ' ' ? (  // ✅ No extra `{}` around the conditional
                        <motion.span
                            key={char_idx}
                            initial={{rotateY: 90, x: 100}}
                            whileInView={{rotateY: 0, x: 0}}
                            transition={{duration: 0.75, ease: "easeInOut", delay: wrd_idx * 0.4 + char_idx * 0.05}}
                            className="inline-block font-serif text-[128px] h-fit"
                        >
                            {char.toUpperCase()}
                        </motion.span>
                    ) : (
                        <div key={char_idx} className="flex flex-row mx-10">

                        </div>
                    )
                )}
            </div>
        })}
    </div>
}

export default FlippedWords