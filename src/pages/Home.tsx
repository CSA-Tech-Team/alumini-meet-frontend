import { background, primary } from "@/constants/styles.ts"
import Logo from "@/components/home/Logo.tsx"
import ParallaxComponent from "@/components/home/ParallelaxComponent"
import FlippedWords from "@/components/home/FlippedWords.tsx"
import AnimateSentences from "@/components/home/AnimateSentences.tsx"
import { FileText, User } from 'lucide-react'
import PhotoGallery from "@/components/home/Gallery"
import Timer from "@/components/home/Timer"
import facultiesPic from "@/assets/faculties.png"
const college_name: string = "PSG COLLEGE OF TECHNOLOGY"
const department_name: string = "DEPARTMENT OF APPLIED MATHEMATICS AND COMPUTATIONAL SCIENCES"

const event_name_part1: string = "ALUMNI"
const event_name_part2: string = "MEET"

const heading: string = "Where Memories Echo, Friendships Reignite"
const content: string = `Step back into the hallways of laughter, shared dreams, and timeless bonds.
Join us as we relive the stories that never aged and create new ones to carry forward.`

export const Home = () => {
  return (
    <section
      className={`flex flex-col ${background} px-4 sm:px-6 md:px-10 lg:px-20 xl:px-40 py-5 gap-5 min-h-screen overflow-hidden`}
    >
      <div className="flex justify-between items-center w-full">
        <Logo />
        <div className="flex gap-2">
          <a href="/signup" title="Login to the Event Registration" className="p-2 hover:bg-black/10 rounded-full transition-colors">
            <User className="cursor-pointer w-6 h-6 sm:w-7 sm:h-7" />
          </a>
          <a
            href="/Alumni_Meet_Agenda_2025.pdf"
            target="_blank"
            rel="noopener noreferrer"
            title="View Agenda PDF"
            className="p-2 hover:bg-black/10 rounded-full transition-colors"
          >
            <FileText className="cursor-pointer w-6 h-6 sm:w-7 sm:h-7" />
          </a>

        </div>
      </div>

      <section className="flex flex-col items-center justify-center text-center min-h-[40vh] sm:min-h-[50vh] mt-4 sm:mt-8">
        <div className={`font-bold uppercase ${primary} text-base sm:text-lg md:text-xl mb-6 sm:mb-10`}>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-1">{college_name}</h2>
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl">{department_name}</h2>
        </div>

        <div className="flex  flex-col items-center justify-center">
          <h1>
            <FlippedWords text={event_name_part1} className={`tracking-widest  max-lg:mb-5 font-bold ${primary} z-10 text-center max-lg:text-6xl lg:text-[12rem] leading-[0.85] tracking-widest`} />
          </h1>
          <h1>
            <FlippedWords text={event_name_part2} className={`tracking-widest  max-lg:mb-5 font-bold ${primary} z-10 text-center max-lg:text-6xl lg:text-[12rem] leading-[0.85] tracking-widest`} />
          </h1>
        </div>
      </section>

      <ParallaxComponent />

      <h1 className={`font-bold ${primary} font-cormorant  text-xl sm:text-2xl md:text-3xl mb-6 text-center`}>
        Join us for a spectacular Alumni Meet a heartfelt gathering of our esteemed alumni 
        commemorating the <span className="inline">50<sup className="text-base">th</sup></span> anniversary
        of the MSc Applied Mathematics program and the <span className="inline">10<sup className="text-base">th</sup></span>
        anniversary of the MSc Data Science program. Reconnect, reminisce, and celebrate with joy and pride!
      </h1>
      <Timer />

      {/* Faculty Photo Section */}
      <section className="flex flex-col items-center justify-center py-10 sm:py-16">
        <h3 className={`font-bold ${primary} font-cormorant uppercase text-xl sm:text-2xl md:text-3xl mb-6 text-center`}>
          Our Esteemed Faculty
        </h3>
        <div className="w-full max-w-4xl">
          <img
            src={facultiesPic || "/placeholder.svg"}
            alt="Faculty of PSG College of Technology"
            className="w-full h-auto object-cover rounded-lg shadow-lg"
          />
        </div>
      </section>

      {/* Our Beloved Director Section */}
      {/* <Director /> */}

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
