import React from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button';
import useErrorLogout from '@/hooks/use-error-logout';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';

const Settings = () => {

  const {toast} = useToast();
  const {handleErrorLogout} = useErrorLogout();

  const changeUsername = async(e) =>{
    e.preventDefault();

    const formData = new FormData(e.target);
    const previousUsername = formData.get("previousUsername");
    const newUsername = formData.get("newUsername");

    if(!newUsername){
      toast({
        title: "Username to change is required",
        variant:"destructive"
      });
      return;
    }

    try{
      const res= await axios.put(import.meta.env.VITE_API_URL+"/change-username",{
        previousUsername,
        newUsername,
      },{
        headers:{
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      });
      console.log(res)
      const data = await res.data;
      localStorage.setItem("user", JSON.stringify(data.user));

      return toast({
          title: "Success",
          description: data.response.message,
      })
    }catch(error){
          return res.status(500).json({success:false, message: error.message});
    }


  }

  const changePassword = async(e) =>{
    e.preventDefault();

    const formData = new FormData(e.target);
    const previousPassword = formData.get("previousPassword");
    const newPassword = formData.get("newPassword");

    if(!newPassword || !previousPassword){
      toast({
        title: "Newpassword and Previouspassword is required",
        variant:"destructive"
      });
      return;
    }

    try{
      const res= await axios.put(import.meta.env.VITE_API_URL+"/change-password",{
        previousPassword,
        newPassword,
      },{
        headers:{
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      });

      const data = await res.data;
      localStorage.setItem("user", JSON.stringify(data.user));

      return toast({
          title: "Success",
          description: data.message,
      })
    }catch(error){
        return res.status(500).json({success:false, message: error.message});
    }


  }

  return (
    <div className='flex flex-col sm:flex-row justify-center items-center gap-3 w-screen sm:w-[80vw] sm:justify-start'>
    {/* Change UserName */}
      <div >
        <h1 className='text-2xl font-bold mb-3'>Change UserName</h1>
        <form className='grid gap-3 w-[88vw] sm:w-[30vw]' onSubmit={changeUsername}>
          <Input type="text" name="previousUsername" placeholder="Enter your Previous Name"/>
          <Input type="text" name="newUsername" placeholder="Enter your New Name"/>
          <Button type="submit">Change Username</Button>
        </form>
      </div>
      {/* Change Password */}
      <div>
        <h1 className='text-2xl font-bold mb-3'>Change Password</h1>
        <form className='grid gap-3 w-[88vw] sm:w-[30vw]' onSubmit={changePassword}>
          <Input type="text" name="previousPassword" placeholder="Enter your Previous Password"/>
          <Input type="text" name="newPassword" placeholder="Enter your New Password"/>
          <Button type="submit">Change Password</Button>
        </form>
      </div>
    </div>
  )
}

export default Settings