import {motion} from "framer-motion";


const AnimateSentences = ({content,className}: { content: string,className:string}) => {
    const sentences = content.split("\n");
    return <div className={'flex flex-col items-center justify-center ' + className}>
        {sentences.map((sentence, i:number) => {
            return <motion.p key={i} initial={{y: 100, opacity: 0}} whileInView={{y: 0, opacity: 1}}
                             transition={{duration: 0.75,delay: 0.3 * i}}
                             className={'text-center text-xl w-full my-1'}>
                {sentence}
            </motion.p>
        })}
    </div>
}

export default AnimateSentences;