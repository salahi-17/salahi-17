import Image from 'next/image'

export function AboutHero(){
    return (
        <section className="relative h-[600px] w-full overflow-hidden">
        <img 
          src="about-us-zafiri-hero.jpg" 
          alt="Beautiful Zanzibar beach"
          className="absolute inset-0 w-full h-full object-cover"
        />
            <h1 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl font-bold text-white">
                About us
            </h1>
        </section>
    )
}