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
  <footer className="bg-gray-900 text-white py-8 px-6 mt-10 rounded-xl">
  <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-8">
    {/* Contact Info */}
    <div>
      <h4 className="text-lg font-semibold mb-2">Contact Us</h4>
      <p className="text-sm">
        <strong>For Details of the event: Prof. Mohanraj</strong><br />
        Phone: <a href= "Phone Number: +91 9865854615" className=" +91 98658 54615">+91 9865854615</a>< br/>
        Email: <a href="mailto: nmr.amcs@psgtech.ac.in" className="text-blue-400 hover:underline">nmr.amcs@psgtech.ac.in</a>
      </p>
      <p className="text-sm mt-2">
        <strong>Issues related registration: Aklamaash</strong><br />
        Phone: <a href= "Phone Number: +91 6369202355" className= "+91 6369202355">+91 6369202355</a>
      </p>
    </div>

    {/* Embedded Map */}
    <div className="w-full md:w-1/2">
      <h4 className="text-lg font-semibold mb-2">Location</h4>
      <iframe
        title="PSG College of Technology Map"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3912.1495705435814!2d76.9992410750589!3d11.02677885519902!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba859a893d06aab%3A0xc42ff9c4d2131225!2sPSG%20College%20of%20Technology!5e0!3m2!1sen!2sin!4v1718200000000!5m2!1sen!2sin"
        width="100%"
        height="200"
        allowFullScreen
        loading="lazy"
        className="rounded-lg shadow-md border border-gray-700"
      />
    </div>
  </div>

  <div className="text-center text-xs text-gray-400 mt-6">
    &copy; {new Date().getFullYear()} PSG College of Technology. All rights reserved.
  </div>
</footer>

    </section>
  )
}

export default Home
