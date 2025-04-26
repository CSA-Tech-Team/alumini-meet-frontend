import { background, primary } from "@/constants/styles.ts"
import Logo from "@/components/home/Logo.tsx"
import ParallaxComponent from "@/components/home/ParallelaxComponent"
import FlippedWords from "@/components/home/FlippedWords.tsx"
import AnimateSentences from "@/components/home/AnimateSentences.tsx"
import { User } from "lucide-react"
import PhotoGallery from "@/components/home/Gallery"
import Timer from "@/components/home/Timer"
import facultiesPic from "@/assets/faculties.png"

const college_name: string = "PSG COLLEGE OF TECHNOLOGY"
const department_name: string = "DEPARTMENT OF APPLIED MATHEMATICS AND COMPUTATIONAL SCIENCES"

const event_name_part1: string = "ALUMNI"
const event_name_part2: string = "MEET"

const heading: string = "Where Memories Echo, Friendships Reignite"
const content: string = `Step back into the hallways of laughter, shared dreams, and timeless bonds.
Nostaldiv is more than a reunion — it's a celebration of every late-night chai, impromptu dance, and heartfelt goodbye that shaped us.
Join us as we relive the stories that never aged and create new ones to carry forward.`

export const Home = () => {
  return (
    <section
      className={`flex flex-col ${background} px-4 sm:px-6 md:px-10 lg:px-20 xl:px-40 py-5 gap-5 min-h-screen overflow-hidden`}
    >
      <div className="flex justify-between items-center w-full">
        <Logo />
        <a href="/signup" className="p-2 hover:bg-black/10 rounded-full transition-colors">
          <User className="cursor-pointer w-6 h-6 sm:w-7 sm:h-7" />
        </a>
      </div>

      <section className="flex flex-col items-center justify-center text-center min-h-[40vh] sm:min-h-[50vh] mt-4 sm:mt-8">
        <div className={`font-bold uppercase ${primary} text-base sm:text-lg md:text-xl mb-6 sm:mb-10`}>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-1">{college_name}</h2>
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl">{department_name}</h2>
        </div>

        <div className="flex max-lg:mt-14 flex-col items-center justify-center">
          <h1
            className={`font-cormorant tracking-widest mb-16 max-lg:mb-5 font-bold ${primary} z-10 text-center text-[3.5rem] sm:text-[5rem] md:text-[8rem] lg:text-[12rem] leading-[0.85] tracking-widest`}
          >
            {event_name_part1}
          </h1>
          <h1
            className={`font-cormorant font-bold ${primary} z-10 text-center text-[3.5rem] sm:text-[5rem] md:text-[8rem] lg:text-[12rem] leading-[0.85] tracking-wider`}
          >
            {event_name_part2}
          </h1>
        </div>
      </section>

      <ParallaxComponent />

      <Timer />

      {/* Faculty Photo Section */}
      <section className="flex flex-col items-center justify-center py-10 sm:py-16">
        <h3 className={`font-bold ${primary} text-xl sm:text-2xl md:text-3xl mb-6 text-center`}>
          Our Esteemed Faculty
        </h3>
        <div className="w-full max-w-4xl">
          <img
            src={facultiesPic}
            alt="Faculty of PSG College of Technology"
            className="w-full h-auto object-cover rounded-lg shadow-lg"
          />
        </div>
      </section>

      <PhotoGallery />
      <div className="flex flex-col items-center justify-center py-10 sm:py-16 md:py-20 px-4 sm:px-8 md:px-16 lg:px-24">
        <FlippedWords text={heading} />
        <div className="max-w-3xl mx-auto">
          <AnimateSentences
            content={content}
            className={`my-6 ${primary}  sm:my-10 text-sm sm:text-base md:text-lg text-center leading-relaxed`}
          />
        </div>
      </div>
    </section>
  )
}

export default Home