import React, { useEffect, useState } from 'react'
import { Card } from '../ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import OrderProductTile from './OrderProductTile'
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../ui/pagination'
import axios from 'axios'
import useErrorLogout from '@/hooks/use-error-logout'

const Orders = () => {

  const [orders, setOrders]= useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage]= useState(1);
  const {handleErrorLogout} = useErrorLogout();

  useEffect(()=>{
    const fetchOrders = () =>{
      try {
        axios.get(import.meta.env.VITE_API_URL+`/get-all-orders?page=${currentPage}&limit=10`,{
          headers:{
            Authorization: `Bearer ${localStorage.getItem("token")},`
          }
        }).then((res)=>{
          const {data, totalPages, currentPage} = res.data;
          setOrders(data);
          setTotalPages(totalPages);
          setCurrentPage(currentPage);
        })
      } catch (error) {
        handleErrorLogout(error,error.response.data.message);
      }
    }

    fetchOrders();
  },[currentPage])

  const updateOrderStatus = async(status, paymentId)=>{
    try{
      const res=await axios.put(import.meta.env.VITE_API_URL+`/update-order-status/${paymentId}`,{
        status
      },
    {
      headers:{
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
    }catch(error){

    }
  }
  return (
    <div>
      <h2 className='text-3xl font-bold mb-8'>Orders</h2>
      <div className='flex flex-col gap-5 mx-auto my-10'>
        <div className='space-y-8'>
          <div className='p-4 space-y-4'>
            <h2 className='text-xl font-medium'>Order Summary</h2>
          
          
            <div className='grid space-y-1 gap-2'>
                {
                  orders.length ===0? <h2 className='text-primary text-3xl'>Nothing To Show, Please add some products...</h2>:orders.map((item)=>(
                   <Card className="space-y-2 p-3 shadpw-md" key={item._id}>
                    <div className='grid sm:grid-cols-3 gap-2'> 
                      {
                        item?.products?.map((product)=>{
                          
                          <OrderProductTile key={product?._id}{...product}/>
                        })
                      }
                      
                    </div>
                    <hr/>
                    <div>
                      <p className='flex justify-between sm:justify-start gap-2 items-center px-3'>
                        <span className='font-bold'>Total:</span>
                        <span className='text-sm'>Rs.{item?.price}</span>
                      </p>
                      <p className='flex justify-between sm:justify-start gap-2 items-center px-3'>
                        <span className='font-bold'>Address:</span>
                        <span className='text-sm'>{item?.address}</span>
                      </p>
                      <p className='flex justify-between sm:justify-start gap-2 items-center px-3'>
                        <span className='font-bold'>Name:</span>
                        <span className='text-sm'>{item?.name}</span>
                      </p>
                      <p className='flex justify-between sm:justify-start gap-2 items-center px-3'>
                        <span className='font-bold'>Email:</span>
                        <span className='text-sm'>{item?.email}</span>
                      </p>
                      <p className='flex justify-between sm:justify-start gap-2 items-center px-3'>
                        <span className='font-bold'>Payment Id:</span>
                        <span className='text-sm'></span>
                      </p>               
                    </div>
                <Select onValueChange={(value)=>{
                  alert("Do you really want to update the status?");
                  updateOrderStatus(value, item.khaltipaymentId)
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="pending"/>
                  </SelectTrigger>
                  <SelectContent className="capitalize">
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="in transit">In transit</SelectItem>
                    <SelectItem value="packed">Packed</SelectItem>
                  </SelectContent>
                </Select>
                   </Card>
                  ))
                }
            </div>
          </div>
          <Pagination>
  	        <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" onClick={() => setCurrentPage((currentPage)=> currentPage >=2 ? currentPage-1 : 1)}/>
                  </PaginationItem>
                  <PaginationItem>
                    {
                      Array.from({length:totalPages},(data, i) => (
                        <PaginationLink href="#"
                        onClick={()=>setCurrentPage(i+1)}>
                            {i+1}
                        </PaginationLink>
                      ))
                    }
                    
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                  <PaginationItem>
                   <PaginationNext href="#" />
                </PaginationItem>
             </PaginationContent>
          </Pagination>

        </div>
      </div>
    </div>
  )
}

export default Orders