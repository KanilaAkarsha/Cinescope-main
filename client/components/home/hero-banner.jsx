import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

export default function HeroBanner({
    title= "Discover Amazing Movies", description="Explore our collection of the best movies from around the world. ",}) {
  return (
    <section id="hero-section" className="relative overflow-hidden ">
        <div className=" absolute inset-0 z-0">
            {/* dark overlay */}
            <div className="bg-linear-to-r absolute inset-0 z-10 from-black/70 via-black/50 to-black/70 "></div>
            {/* background image */}
            <div className=" absolute inset-0 bg-[url('/images/hero-1.jpg')] bg-cover bg-center opacity-60 dark:opacity-40"></div>
        </div>

        <div className="z-20 relative container px-4 py-32 md:py-40 lg:py-52">
            <div className="flex flex-col items-center justify-center space-y-6 text-center">
                <div className="max-w-3xl space-y-4">
                    <h1 className="text-white sm:text-5xl md:text-6xl lg:text-7xl tracking-tighter drop-shadow-md font-bold ">{title}</h1>
                    <p className=" mx-auto max-w-[700px] text-white/80 drop-shadow-sm md:text-xl text-lg">{description}</p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                    <Button size="lg" className="bg-primary hover:bg-primary/90 gap-2">
                    <Play className="size-4"/>
                    Browse Movies</Button>
                    <Button size="lg" variant="outline" className="bg-primary/10 backdrop-blur-xs border-primary/30 hover:bg-primary/20 text-white hover:text-white">Latest Releases</Button>
                </div>
            </div>
        </div>
    </section>
  )
}
