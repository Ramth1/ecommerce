import React from 'react'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel"

  
const HeaderDisplay = () => {
    const imagesData=[
        "https://images.pexels.com/photos/2177708/pexels-photo-2177708.jpeg?auto=compress&cs=tinysrgb&w=600",
        "https://images.pexels.com/photos/1531660/pexels-photo-1531660.jpeg?auto=compress&cs=tinysrgb&w=600",
        "https://images.pexels.com/photos/2104882/pexels-photo-2104882.jpeg?auto=compress&cs=tinysrgb&w=600",
        "https://images.pexels.com/photos/750895/pexels-photo-750895.jpeg?auto=compress&cs=tinysrgb&w=600"
    ]
  return (
    <Carousel className="my-10 mx-auto w-[90vw] overflow-x-clip sm:overflow-visible">
        <CarouselContent>
           { imagesData.map((image)=>(
            <CarouselItem key={image}>
                <img                   
                    src={image}
                    loading='lazy'
                    className='object-cover mx-auto w-20% h-[60vh] rounded-3xl'
                />
            </CarouselItem>)               
            )}         
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
    </Carousel>
  )
}

export default HeaderDisplay