import React, { useEffect, useState } from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useDispatch, useSelector } from 'react-redux'
import { setProducts } from '@/redux/slices/productSlice';
import axios from 'axios';

const categoryData={
    trigger:"Category",
    items:['keyboard','mouse','headset']
}
const priceData={ 
    trigger:"Price",
    items:[1000,3000,5000,8000]
}

const FilterMenu = () => {

const dispatch = useDispatch();

    const [category,setCategory] = useState("")
    const [price, setPrice] = useState("");
    const [search,setSearch] = useState("");

    useEffect(()=>{
        const getFilterProduct = async() =>{
            const res= await axios.get(import.meta.env.VITE_API_URL+`/get-products?category=${category}&price=${price}&search=${search}`);

            const data = await res.data;
            dispatch(setProducts(data.data));
        }

        getFilterProduct();
    },[category,search,price])

  return (
    <div className='w-[93vw] flex flex-col sm:flex-row justify-between items-center mx-auto my-10 gap-3 sm:gap-0'>
     <div className='flex sm:w-[30%] w-full gap-3'>
        {/*DROPDOWN FILTERS */}
     
        {/* FOR CATEGORY */}
     <Select onValueChange={(value)=> setCategory(value)}>
        <SelectTrigger id={categoryData.trigger}>
            <SelectValue placeholder={categoryData.trigger} />
        </SelectTrigger>
        <SelectContent position="popper">
            {
                categoryData.items.map((item)=>(
                    <SelectItem key={item} id={item} value={item} className="capitalize">
                        {item}
                    </SelectItem>
                ))
            }           
        </SelectContent>
     </Select>   
     
        {/*FOR PRICE */}
     <Select onValueChange={(value)=> setPrice(value)}>
        <SelectTrigger id={priceData.trigger}>
            <SelectValue placeholder={priceData.trigger} />
        </SelectTrigger>
        <SelectContent position="popper">
            {
                priceData.items.map((item)=>(
                    <SelectItem key={item} id={item} value={item}>
                        Less Than {item}
                    </SelectItem>
                ))
            }           
        </SelectContent>
     </Select>   
    </div>

    {/*SEARCH INPUT*/}
    <div className='sm:w-[40%] w-full'>
        <Input 
            id="search"
            placeholder="Search Here..."
            onChange={(e)=> setSearch(e.target.value)}
        />
    </div>
    

    </div>
    

  )
}

export default FilterMenu