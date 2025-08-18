import React from 'react'

type Props = {}

const Login = (props: Props) => {
  return (
    <div className='w-full h-full'>
       <form className='flex flex-col gap-4 w-full h-full'>
            <input placeholder='email' className='w-full h-10 rounded-md border border-gray-300 p-2'></input>
            <input placeholder='password' className='w-full h-10 rounded-md border border-gray-300 p-2'></input>
            <button className='w-full h-10 rounded-md bg-blue-500 text-white'>Login</button> 
       </form>
    </div>
  )
}

export default Login