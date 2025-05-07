import nattu_pic1 from "@/assets/nattu_fun.jpg"
import nattu_pic2 from "@/assets/nattu_studs.jpg"
import { primary } from "@/constants/styles.ts"

export default function Director() {
    return (
        <section className="flex flex-col items-center justify-center py-10 sm:py-16">
            <h3 className={`font-bold ${primary} font-cormorant uppercase text-xl sm:text-2xl md:text-3xl mb-6 text-center`}>
                Our Beloved Director
            </h3>
            <div className="flex flex-col md:flex-row gap-6 md:gap-10 w-full max-w-4xl justify-center items-center">
                <div className="w-full md:w-1/2">
                    <img
                        src={nattu_pic1}
                        alt="Director Portrait"
                        className="w-full h-auto object-cover rounded-lg shadow-lg mx-auto"
                    />
                </div>
                <div className="w-full md:w-1/2">
                    <img
                        src={nattu_pic2}
                        alt="Director with Faculty"
                        className="w-full h-auto object-cover rounded-lg shadow-lg mx-auto"
                    />
                </div>
            </div>
        </section>
    )
}
