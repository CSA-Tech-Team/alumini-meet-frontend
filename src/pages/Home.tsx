import {background, primary} from "@/constants/styles.ts";
import Logo from "@/components/home/Logo.tsx";
import ParallaxComponent from "@/components/home/ParallelaxComponent.tsx";
import FlippedWords from "@/components/home/FlippedWords.tsx";
import AnimateSentences from "@/components/home/AnimateSentences.tsx";
import Gallery from "@/components/home/Gallery.tsx";

const college_name:string = "PSG COLLEGE OF TECHNOLOGY";
const department_name:string = "DEPARTMENT OF APPLIED MATHEMATICS AND COMPUTATIONAL SCIENCES"

const event_name:string = "ALUMNI"

const heading:string = "High-end\nInteriors&\nExteriors";
const content:string = "Æbele Interiors offers a full range of be spoke\ninterior design services — from initial concept and\naesthetic to coordination, execution\nand magazine-worthy finishing touches.";

export const Home = () => {
    return <section className={`flex flex-col ${background} px-40 py-5 gap-5`}>
        <Logo />
        <div className={`flex flex-col items-center justify-center uppercase text-2xl text-center mb-6 ${primary}`}>
            <h2 className={'w-1/2'}>
                {college_name}
            </h2>
            <h2>
                {department_name}
            </h2>
        </div>
        <div className={'flex flex-row items-center justify-center'}>
            <h1 className={`text-[384px] font-cormorant font-bold  ${primary} z-10`}>
                {event_name}
            </h1>
        </div>
        <ParallaxComponent />
        <div className={'flex flex-col items-center justify-center mb-10'}>
            <FlippedWords text={heading}/>
            <AnimateSentences content={content} className={'my-10'}/>
        </div>
        {/*<Gallery />*/}
    </section>;
};