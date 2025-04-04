"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { PSG_A_block_Cropped, PSG_Medium_Cropped } from "@/assets"

const ParallaxComponent = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  // Using the container as the scroll container for a pronounced yet compact effect
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"])
  const y2 = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"])
  const y3 = useTransform(scrollYProgress, [0, 1], ["20%", "0%"])

  const scale1 = useTransform(scrollYProgress, [0, 1], [0.95, 1.05])
  const scale2 = useTransform(scrollYProgress, [0, 1], [0.9, 1])
  const scale3 = useTransform(scrollYProgress, [0, 1], [0.85, 0.95])

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden"
      style={{ height: "100vh" }} 
    >
      <div className="sticky top-0 w-full h-full flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6 lg:gap-8">
            <motion.div
              style={{
                y: y1,
                scale: scale1,
                zIndex: 3,
              }}
              className="w-full md:w-1/2 lg:w-5/12 order-1"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg shadow-xl">
                <img
                  src={PSG_Medium_Cropped || "/placeholder.svg"}
                  className="w-full h-full object-cover object-center"
                  alt="PSG Campus Main View"
                  loading="lazy"
                />
              </div>
            </motion.div>

            <div className="w-full md:w-1/2 lg:w-7/12 order-2 flex flex-col gap-4">
              <motion.div
                style={{
                  y: y2,
                  scale: scale2,
                  zIndex: 2,
                }}
                className="w-full"
              >
                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg shadow-xl">
                  <img
                    src={PSG_A_block_Cropped || "/placeholder.svg"}
                    className="w-full h-full object-cover object-center"
                    alt="PSG A Block View 1"
                    loading="lazy"
                  />
                </div>
              </motion.div>

              <motion.div
                style={{
                  y: y3,
                  scale: scale3,
                  zIndex: 1,
                }}
                className="w-full"
              >
                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg shadow-xl">
                  <img
                    src={PSG_A_block_Cropped || "/placeholder.svg"}
                    className="w-full h-full object-cover object-center"
                    alt="PSG A Block View 2"
                    loading="lazy"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ParallaxComponent
