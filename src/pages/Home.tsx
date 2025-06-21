import { background, primary } from "@/constants/styles.ts"
import Logo from "@/components/home/Logo.tsx"
import ParallaxComponent from "@/components/home/ParallelaxComponent"
import FlippedWords from "@/components/home/FlippedWords.tsx"
import AnimateSentences from "@/components/home/AnimateSentences.tsx"
import { FileText, User } from 'lucide-react'
import PhotoGallery from "@/components/home/Gallery"
import Timer from "@/components/home/Timer"
import facultiesPic from "@/assets/faculties.png"
import { Phone, Mail } from "lucide-react"

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
            href="/ALUMNIMEETAGENA.pdf"
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

  {/* Footer Section */}
  <footer className="w-full text-black font-cormorant font-semibold text-3xl py-4 px-6 mt-6">
  <div className="flex flex-col md:flex-row justify-between items-start gap-10">
    {/* Contact Info */}
    <div className="w-full md:w-1/2 lg:w-[45%]">
      <h4 className="text-2xl font-extrabold tracking-wide mb-4">Contact Us</h4>

      <p className="text-xl mb-6">
        <strong>Event-related inquiries: Prof. Mohanraj</strong><br />
        <span className="flex items-center gap-2 mt-1">
          <Phone className="w-4 h-4" />
          +91 9865854615
        </span>
        <span className="flex items-center gap-2 mt-1">
          <Mail className="w-4 h-4" />
          <a href="mailto: nmr.amcs@psgtech.ac.in" className="text-blue-400 hover:underline">
            nmr.amcs@psgtech.ac.in</a>
        </span>
      </p>

      <p className="text-xl">
        <strong>Registration support contact: Aklamaash</strong><br />
        <span className="flex items-center gap-2 mt-1">
          <Phone className="w-4 h-4" />
          +91 6369202355
        </span>
      </p>
    </div>

    {/* Embedded Map */}
    <div className="w-full md:w-1/2 lg:w-[45%]">
      <h4 className="text-2xl font-semibold mb-4">Location</h4>
      <iframe
        title="PSG College of Technology Map"
        src="https://maps.google.com/maps?q=PSG%20College%20of%20Technology&z=15&output=embed"
        loading="lazy"
        allowFullScreen
        className="w-full h-[300px] rounded-lg shadow-md border border-white"
      />
    </div>
  </div>

  <hr className="border-t border-grey-400 my-6" />  
  <div className="text-center text-xl text-grey font-medium">
    &copy; {new Date().getFullYear()} PSG College of Technology. All rights reserved.
  </div>
</footer>

    </section>
  )
}

export default Home
