import { Colors } from '@/constants/colors'
import React from 'react'

const CheckoutProduct = ({name,price=699,quantity=2,image={
url:"https://images.pexels.com/photos/31761380/pexels-photo-31761380/free-photo-of-lush-tea-gardens-pathway-in-damak-nepal.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
},color=Colors.customYellow}) => {
  return (
    <div className='flex justify-between items-start p-3 rounded-lg bg-gray-100 dark:bg-zinc-900'>
        <div className='flex flex-row items-center gap-2'>
            <img src={image} alt={name} className='w-20 sm:w-24 rounded-lg'/>
            <div className='font-semibold text-sm sm:text-base'>
                <h1>Custom Designed</h1>
                <p className='flex flex-col sm:flex-row sm:gap-2 text-gray-500 dark:text-customGray text-xs sm:text-sm my-0'>
                    <span>
                        Color: <span style={{backgroundColor: color}}>{color}</span>
                    </span>
                    <span className='hidden sm:block'>|</span>
                    <span className='font-semibold'>
                        Qty:{""}
                        <span className='font-medium text-customYellow'>{quantity}</span>
                    </span>
                    <span className='hidden sm:block'>|</span>
                    <span className='font-semibold'>
                        Price:{""}
                        <span className='font-medium text-customYellow'>599</span>
                    </span>
                </p>
            </div>
        </div>
    </div>
  )
}

export default CheckoutProduct