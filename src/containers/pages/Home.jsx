

import { connect } from "react-redux"
import { LockClosedIcon } from '@heroicons/react/20/solid'
import { useEffect, useState } from "react";
import { check_authenticated, load_user, login, refresh } from "redux/actions/auth/auth";
import { Link, Navigate } from "react-router-dom";

function Home({
  login,
  isAuthenticated,
  loading,
  refresh,
  check_authenticated,
  load_user,
}){

  useEffect(()=>{
      isAuthenticated ? <></>:
      <>
      {refresh()}
      {check_authenticated()}
      {load_user()}
      </>
  },[])

  const [formData, setFormData] = useState({
      email: '',
      password: ''
  });

  const { 
      email,
      password
  } = formData;

  const onChange  = e => setFormData({ ...formData, [e.target.name]: e.target.value });


  const onSubmit = e => {
      e.preventDefault();
      login(email, password)
  }

  if(isAuthenticated){
      return <Navigate to='/dashboard'/>
  }

    return(
      <>
      {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-gray-50">
        <body class="h-full">
        ```
      */}
      <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            <img
              className="mx-auto h-12 w-auto"
              src="https://i.ibb.co/B3Lyp3n/logo-png-sombreado.png"
              alt="Your Company"
            />
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Inicia sesión en tu cuenta
            </h2>
            
          </div>
          <form onSubmit={e=>{onSubmit(e)}}className="mt-8 space-y-6" action="#" method="POST">
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="-space-y-px rounded-md shadow-sm">
              <div className="mb-10">
                <label htmlFor="email-address" className="sr-only">
                  Correo Electronico
                </label>
                <input
                  id="email-address"
                  name="email"
                  onChange={e=>onChange(e)}
                  value={email}
                  type="email"
                
                  required
                  className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  placeholder="Correo Electronico"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Contraseña
                </label>
                <input
                  id="password"
                  name="password"
                  onChange={e=>onChange(e)}
                  value={password}
                  type="password"
                  
                  required
                  className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  placeholder="Contraseña"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
           
              <div className="text-sm">
                <Link to="/forgot_password" className="font-medium text-indigo-600 hover:text-indigo-500">
                ¿Olvidó su contraseña?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <LockClosedIcon className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" aria-hidden="true" />
                </span>
                Iniciar Sesión
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
    )
}

const mapStateToProps=state=>({
  isAuthenticated: state.auth.isAuthenticated,
  loading: state.auth.loading
})

export default connect(mapStateToProps,{
  login,
  refresh,
  check_authenticated,
  load_user,
})(Home)