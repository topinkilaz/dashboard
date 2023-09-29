import BlogList from "components/blog/BlogList"
import Layouts from "hocs/layout/layouts"
import { Fragment, useEffect, useState } from "react"
import { Helmet } from "react-helmet-async"
import { connect } from "react-redux"
import { Navigate, useNavigate, useParams } from "react-router-dom"
import { get_author_blog_list, get_author_blog_list_page, get_blog,get_blog_author } from "redux/actions/blog/blog"
import { get_categories } from "redux/actions/categories/categories"
import { PaperClipIcon } from '@heroicons/react/20/solid'
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'

import axios from "axios"
import DOMPurify from 'dompurify'
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Dialog, Transition } from '@headlessui/react'


function EditPost({
  post,
  get_blog,
  isAuthenticated,
  get_categories,
  categories,
  get_blog_author
}){

    const [open, setOpen] = useState(false)
    const [openDelete, setOpenDelete] = useState(false)

  const params =useParams()
  const post_id =params.post_id
  useEffect(()=>{
    window.scrollTo(0,0)
    get_blog_author(post_id)
    categories ? <></>: get_categories()
  },[post_id])

  const [updateTitle, setUpdateTitle]=useState(false)
  const [updateSlug, setUpdateSlug]=useState(false)
  const [updateDescription, setUpdateDescription]=useState(false)
  const [updateContent, setUpdateContent]=useState(false)
  const [updateCategory, setUpdateCategory]=useState(false)
  const [updateThumbnail, setUpdateThumbnail]=useState(false)
  const [updateTime, setUpdateTime]=useState(false)
  const [content, setContent]=useState('')

  const [formData, setFormData]=useState({
    title:'',
    new_slug:'',
    description:'',
    category:'',
    time_read:'',
})

const {
    title,
    new_slug,
    description,
    category,
    time_read,
} = formData

const onchange = (e) =>{
  setFormData({ ...formData, [e.target.name]: e.target.value})
}
const [loading, setLoading] = useState(false)
const [showFullContent, setShowFullContent] = useState(false)
const [previewImage, setPreviewImage] = useState()
const [thumbnail, setThumbnail] = useState(null)

const navigate = useNavigate()

const fileSelectedHandler = (e)=> {
    const file = e.target.files[0]
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = (e) => {
        setPreviewImage(reader.result);
    };
    setThumbnail(file)
}

const resetStates=()=>{
    setUpdateTitle(false)
    setUpdateSlug(false)
    setUpdateDescription(false)
    setUpdateContent(false)
    setUpdateCategory(false)
    setUpdateThumbnail(false)
    setUpdateTime(false)
}

  const onSubmit= e =>{
    e.preventDefault()
   
    const config = {
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
          'Authorization': `JWT ${localStorage.getItem('access')}`
      }
  };
  
        const formData = new FormData()
        formData.append('title', title)
        formData.append('slug', post&&post.slug)
        formData.append('post_id', post_id)
        formData.append('new_slug', new_slug)
        formData.append('description', description)
        formData.append('category', category)
        formData.append('time_read', time_read)
     

   if(thumbnail){

          formData.append('thumbnail', thumbnail, thumbnail.name)
      }else{
          formData.append('thumbnail', '')

      }

      if(content){
          formData.append('content', content)
      }else{
          formData.append('content', '')
      }

        const fetchData = async()=>{
          setLoading(true)
          try{
              const res = await axios.put(`${process.env.REACT_APP_API_URL}/api/blog/edit`,
              formData,
              config)

              if(res.status === 200){

                 
                await get_blog_author(post_id)
                  

                setFormData({ 
                      title:'',
                      new_slug:'',
                      description:'',
                      content:'',
                      time_read:''
                  })

                  setLoading(false)

                  resetStates()

                  if(thumbnail){
                      setThumbnail(null)
                      setPreviewImage(null)
                  }
                  if(content){
                      setContent('')
                  }
              }else{
                  setLoading(false)
                  resetStates()
                  if(thumbnail){
                      setThumbnail(null)
                      setPreviewImage(null)
                  }
                  if(content){
                      setContent('')
                  }
              }
          }catch(err){
              setLoading(false)
              resetStates()
              if(thumbnail){
                  setThumbnail(null)
                  setPreviewImage(null)
              }
              if(content){
                  setContent('')
              }
              alert('Error al enviar')
          }
      }
      fetchData()
  }
  const onSubmitDraft = e =>{
    e.preventDefault()
    
    const config = {
        headers: {
            'Accept': 'application/json',
            'Authorization': `JWT ${localStorage.getItem('access')}`
        }
    };

    const formData = new FormData()
    formData.append('post_id', post_id)

    const fetchData = async()=>{
        setLoading(true)
        try{
            const res = await axios.put(`${process.env.REACT_APP_API_URL}/api/blog/draft`,
            formData,
            config)

            if(res.status === 200){
                setOpen(false)
               
                    await get_blog_author(post_id)
            

                setFormData({ 
                    title:'',
                    new_slug:'',
                    description:'',
                    content:'',
                })

                setLoading(false)
                resetStates()
                if(thumbnail){
                    setThumbnail(null)
                    setPreviewImage(null)
                }
                if(content){
                    setContent('')
                }
            }else{
                setOpen(false)
                setLoading(false)
                resetStates()
                if(thumbnail){
                    setThumbnail(null)
                    setPreviewImage(null)
                }
                if(content){
                    setContent('')
                }
            }
        }catch(err){
            setOpen(false)
            setLoading(false)
            resetStates()
            if(thumbnail){
                setThumbnail(null)
                setPreviewImage(null)
            }
            if(content){
                setContent('')
            }
            alert('Error al enviar')
        }
    }
    fetchData()
}

const onSubmitPublish = e =>{
    e.preventDefault()
    
    const config = {
        headers: {
            'Accept': 'application/json',
            'Authorization': `JWT ${localStorage.getItem('access')}`
        }
    };

    const formData = new FormData()
    formData.append('post_id', post_id)

    const fetchData = async()=>{
        setLoading(true)
        try{
            const res = await axios.put(`${process.env.REACT_APP_API_URL}/api/blog/publish`,
            formData,
            config)

            if(res.status === 200){
                setOpen(false)
            
                await get_blog_author(post_id)
                

                setFormData({ 
                    title:'',
                    new_slug:'',
                    description:'',
                    content:'',
                })

                setLoading(false)
                resetStates()
                if(thumbnail){
                    setThumbnail(null)
                    setPreviewImage(null)
                }
                if(content){
                    setContent('')
                }
            }else{
                setOpen(false)
                setLoading(false)
                resetStates()
                if(thumbnail){
                    setThumbnail(null)
                    setPreviewImage(null)
                }
                if(content){
                    setContent('')
                }
            }
        }catch(err){
            setOpen(false)
            setLoading(false)
            resetStates()
            if(thumbnail){
                setThumbnail(null)
                setPreviewImage(null)
            }
            if(content){
                setContent('')
            }
            alert('Error al enviar')
        }
    }
    fetchData()
}

const onSubmitDelete = e =>{
    e.preventDefault()
    
    const config = {
        headers: {
            'Accept': 'application/json',
            'Authorization': `JWT ${localStorage.getItem('access')}`
        }
    };

    const formData = new FormData()
    formData.append('post_id', post_id)

    const fetchData = async()=>{
        setLoading(true)
        try{
            const res = await axios.delete(`${process.env.REACT_APP_API_URL}/api/blog/delete/${post_id}`,
            formData,
            config)

            if(res.status === 200){
                navigate(-1)
            }else{
                setOpen(false)
                setLoading(false)
                resetStates()
                if(thumbnail){
                    setThumbnail(null)
                    setPreviewImage(null)
                }
                if(content){
                    setContent('')
                }
            }
        }catch(err){
            setOpen(false)
            setLoading(false)
            resetStates()
            if(thumbnail){
                setThumbnail(null)
                setPreviewImage(null)
            }
            if(content){
                setContent('')
            }
            alert('Error al enviar')
        }
    }
    fetchData()
}
      

    return(
      <Layouts>
          <Helmet>
        <title>Infotech | Admin blog</title>
        <meta name="description" content="Ofrecemos soluciones expertas en reparación, mantenimiento y optimización de equipos electrónicos." />
        <meta name="keywords" content='Servicio técnico, Reparación de equipos, Soluciones tecnológicas' />
        <meta name="robots" content='all' />
        <link rel="canonical" href="https://www.infotech.com/" />
        <meta name="author" content='Infotech' />
        <meta name="publisher" content='Infotech' />

        {/* Social Media Tags */}
        <meta property="og:title" content='Infotech  Sucre-Bolivia' />
        <meta property="og:description" content='Ofrecemos soluciones expertas en reparación, mantenimiento y optimización de equipos electrónicos.' />
        <meta property="og:url" content="https://www.infotech.com/" />
        <meta property="og:image" content='https://i.postimg.cc/c4hQJ8p5/Computer-Services.webp' />

        <meta name="twitter:title" content='Infotech  Sucre-Bolivia' />
        <meta
            name="twitter:description"
            content='Ofrecemos soluciones expertas en reparación, mantenimiento y optimización de equipos electrónicos.'
        />
        <meta name="twitter:image" content='https://i.postimg.cc/c4hQJ8p5/Computer-Services.webp' />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      {
            post && isAuthenticated ?
            <>
            <div className=" px-4 py-5 sm:px-6">
                <div className="-ml-4 -mt-4 flex flex-wrap items-center justify-between sm:flex-nowrap">
                    <div className="ml-4 mt-4">
                    <h3 className="text-3xl font-medium leading-6 text-gray-900">Editar Post</h3>
                    <p className="mt-3 text-lg text-gray-500">
                        {post.title}
                    </p>
                    </div>
                    <div className="ml-4 mt-4 flex-shrink-0">
                    <button
                        onClick={e=>setOpenDelete(true)}
                        className="relative mx-1 inline-flex items-center rounded-md border border-transparent bg-rose-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
                    >
                        Eliminar
                    </button>
                    <a
                        href={`${process.env.REACT_APP_URL}/blog/${post.slug}`}
                        target="_blank"
                        className="relative mx-1 inline-flex items-center rounded-md border border-transparent bg-gray-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    >
                        Ver Post
                    </a>
                    <button
                        onClick={e=>setOpen(true)}
                        className="relative mx-1 inline-flex items-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    >
                        {
                            post.status==='published'?
                            <>Editar</>:<>Publicar</>
                        }
                    </button>
                    </div>
                </div>
            </div>
            
            <div className="mt-5 border-t border-gray-200">
                <dl className="divide-y divide-gray-200">

                <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                    <dt className="text-lg font-medium text-gray-500">Titulo</dt>
                    <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                        {
                            updateTitle ?
                            <>
                            <form onSubmit={e=>onSubmit(e)} className="flex w-full">

                                <span className="flex-grow">
                                    <input
                                    value={title}
                                    onChange={e=>onchange(e)}
                                    name='title'
                                    type='text'
                                    className="border border-gray-400 rounded-lg w-full"
                                    required
                                    />
                                </span>
                                <span className="ml-4 flex-shrink-0">
                                    <button
                                    type="submit"
                                    className="rounded-md mr-2 bg-white font-medium text-indigo-600 hover:text-indigo-500"
                                    >
                                    Guardar
                                    </button>
                                    <div
                                    onClick={()=>setUpdateTitle(false)}
                                    className="cursor-pointer inline-flex rounded-md bg-white font-medium text-indigo-600 hover:text-indigo-500"
                                    >
                                    Cancelar
                                    </div>
                                </span>
                            </form>
                            </>
                            :
                            <>
                                <span className="flex-grow text-lg">{post.title}</span>
                                <span className="ml-4 flex-shrink-0">
                                    <div
                                    onClick={()=>setUpdateTitle(true)}
                                    className="cursor-pointer inline-flex rounded-md bg-white font-medium text-indigo-600 hover:text-indigo-500"
                                    >
                                    Actualizar
                                    </div>
                                </span>
                            </>
                        }
                    </dd>
                </div>
                
                

                <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                    <dt className="text-lg font-medium text-gray-500">Slug</dt>
                    <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                        {
                            updateSlug ?
                            <>
                            <form onSubmit={e=>onSubmit(e)} className="flex w-full">

                                <span className="flex-grow">
                                    <input
                                    value={new_slug}
                                    onChange={e=>onchange(e)}
                                    name='new_slug'
                                    type='text'
                                    className="border border-gray-400 rounded-lg w-full"
                                    required
                                    />
                                </span>
                                <span className="ml-4 flex-shrink-0">
                                    <button
                                    type="submit"
                                    className="rounded-md mr-2 bg-white font-medium text-indigo-600 hover:text-indigo-500"
                                    >
                                    Guardar
                                    </button>
                                    <div
                                    onClick={()=>setUpdateSlug(false)}
                                    className="cursor-pointer inline-flex rounded-md bg-white font-medium text-indigo-600 hover:text-indigo-500"
                                    >
                                    Cancelar
                                    </div>
                                </span>
                            </form>
                            </>
                            :
                            <>
                                <span className="flex-grow text-lg">{post.slug}</span>
                                <span className="ml-4 flex-shrink-0">
                                    <div
                                    onClick={()=>setUpdateSlug(true)}
                                    className="cursor-pointer inline-flex rounded-md bg-white font-medium text-indigo-600 hover:text-indigo-500"
                                    >
                                    Actualizar
                                    </div>
                                </span>
                            </>
                        }
                    </dd>
                </div>

                <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                    <dt className="text-lg font-medium text-gray-500">Imagen</dt>
                    <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                        {
                            updateThumbnail ?
                            <>
                            {
                                previewImage&&
                                <img src={previewImage} className='object-cover w-80 h-72 p-4'/>
                            }

                            <form onSubmit={e=>onSubmit(e)} className="flex w-full">
                                <span className="flex-grow">
                                    <input
                                    type='file'
                                    name='thumbnail'
                                    onChange={e=>fileSelectedHandler(e)}
                                    className="w-full py-3 px-2 border border-gray-900 rounded-lg"
                                    required
                                    />
                                </span>
                                <span className="ml-4 flex-shrink-0">
                                    <button
                                    type="submit"
                                    className="rounded-md mr-2 bg-white font-medium text-indigo-600 hover:text-indigo-500"
                                    >
                                    Guardar
                                    </button>
                                    <div
                                    onClick={()=>{
                                        setUpdateThumbnail(false)
                                        setThumbnail(null)
                                        setPreviewImage(null)
                                    }}
                                    className="cursor-pointer inline-flex rounded-md bg-white font-medium text-indigo-600 hover:text-indigo-500"
                                    >
                                    Cancelar
                                    </div>
                                </span>
                            </form>
                            </>
                            :
                            <>
                                <span className="flex-grow text-lg">
                                    {
                                        post.thumbnail &&
                                    <img src={post.thumbnail} className='object-cover w-full h-72'/>
                                    }
                                    </span>
                                <span className="ml-4 flex-shrink-0">
                                    <div
                                    onClick={()=>setUpdateThumbnail(true)}
                                    className="cursor-pointer inline-flex rounded-md bg-white font-medium text-indigo-600 hover:text-indigo-500"
                                    >
                                    Actualizar
                                    </div>
                                </span>
                            </>
                        }
                    </dd>
                </div>

                <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                    <dt className="text-lg font-medium text-gray-500">Descripción</dt>
                    <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                        {
                            updateDescription ?
                            <>
                            <form onSubmit={e=>onSubmit(e)} className="flex w-full">

                                <span className="flex-grow">
                                    <textarea
                                    rows={3}
                                    value={description}
                                    onChange={e=>onchange(e)}
                                    name='description'
                                    type='text'
                                    className="border border-gray-400 rounded-lg w-full"
                                    required
                                    />
                                </span>
                                <span className="ml-4 flex-shrink-0">
                                    <button
                                    type="submit"
                                    className="rounded-md mr-2 bg-white font-medium text-indigo-600 hover:text-indigo-500"
                                    >
                                    Guardar
                                    </button>
                                    <div
                                    onClick={()=>setUpdateDescription(false)}
                                    className="cursor-pointer inline-flex rounded-md bg-white font-medium text-indigo-600 hover:text-indigo-500"
                                    >
                                    Cancelar
                                    </div>
                                </span>
                            </form>
                            </>
                            :
                            <>
                                <span className="flex-grow text-lg">{post.description}</span>
                                <span className="ml-4 flex-shrink-0">
                                    <div
                                    onClick={()=>setUpdateDescription(true)}
                                    className="cursor-pointer inline-flex rounded-md bg-white font-medium text-indigo-600 hover:text-indigo-500"
                                    >
                                    Actualizar
                                    </div>
                                </span>
                            </>
                        }
                    </dd>
                </div>

                <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                    <dt className="text-lg font-medium text-gray-500">Contenido</dt>
                    <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                        {
                            updateContent ?
                            <>
                            <form onSubmit={e=>onSubmit(e)} className="w-full">

                                <span className="flex-grow">
                                    <CKEditor
                                    editor={ClassicEditor}
                                    data={content}
                                    
                                    onChange={(event, editor) =>{
                                        const data = editor.getData()
                                        setContent(data)
                                        }}/>
                                </span>
                                <span className="ml-4 flex-shrink-0">
                                    <button
                                    type="submit"
                                    className="rounded-md mr-2 bg-white font-medium text-indigo-600 hover:text-indigo-500"
                                    >
                                    Guardar
                                    </button>
                                    <div
                                    onClick={()=>setUpdateContent(false)}
                                    className="cursor-pointer inline-flex rounded-md bg-white font-medium text-indigo-600 hover:text-indigo-500"
                                    >
                                    Cancelar
                                    </div>
                                </span>
                            </form>
                            </>
                            :
                            <>
                                <span className="flex-grow text-lg">
                                    {
                                        post.content ?
                                        <div className="prose prose-lg max-w-6xl prose-indigo mx-auto mt-6 text-gray-500">
                                            
                                            {
                                                showFullContent ?
                                                <p dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content)}} />
                                                :
                                                <p dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content.length) > 350 ? DOMPurify.sanitize(post.content.slice(0,249)):DOMPurify.sanitize(post.content)}} />
                                            }
                                            {
                                                DOMPurify.sanitize(post.content.length) > 350 ?
                                                <>
                                                {
                                                    showFullContent ?
                                                    <button
                                                    className="w-full border border-gray-900 text-gray-900 bg-white py-2"
                                                    onClick={()=>setShowFullContent(false)}
                                                    >
                                                        Ver menos
                                                    </button>
                                                    :
                                                    <button
                                                    className="w-full border border-gray-900 text-gray-900 bg-white py-2"
                                                    onClick={()=>setShowFullContent(true)}
                                                    >
                                                        Ver Mas
                                                    </button>
                                                }
                                                </>
                                                :
                                                <>
                                                </>
                                            }
                                        </div>
                                        :
                                        <p className=" w-full py-2 bg-gray-100 mt-4 text-lg font-regular text-gray-800 leading-8"></p>
                                    }
                                    </span>
                                <span className="ml-4 flex-shrink-0">
                                    <div
                                    onClick={()=>setUpdateContent(true)}
                                    className="cursor-pointer inline-flex rounded-md bg-white font-medium text-indigo-600 hover:text-indigo-500"
                                    >
                                    Actualizar
                                    </div>
                                </span>
                            </>
                        }
                    </dd>
                </div>

                <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                    <dt className="text-lg font-medium text-gray-500">Tiempo de Lectura</dt>
                    <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                        {
                            updateTime ?
                            <>
                            <form onSubmit={e=>onSubmit(e)} className="flex w-full">

                                <span className="flex-grow">
                                    <input
                                    value={time_read}
                                    onChange={e=>onchange(e)}
                                    name='time_read'
                                    type='number'
                                    className="border border-gray-400 rounded-lg w-full"
                                    required
                                    />
                                </span>
                                <span className="ml-4 flex-shrink-0">
                                    <button
                                    type="submit"
                                    className="rounded-md mr-2 bg-white font-medium text-indigo-600 hover:text-indigo-500"
                                    >
                                    Guardar
                                    </button>
                                    <div
                                    onClick={()=>setUpdateTime(false)}
                                    className="cursor-pointer inline-flex rounded-md bg-white font-medium text-indigo-600 hover:text-indigo-500"
                                    >
                                    Cancelar
                                    </div>
                                </span>
                            </form>
                            </>
                            :
                            <>
                                <span className="flex-grow text-lg">{post.time_read}</span>
                                <span className="ml-4 flex-shrink-0">
                                    <div
                                    onClick={()=>setUpdateTime(true)}
                                    className="cursor-pointer inline-flex rounded-md bg-white font-medium text-indigo-600 hover:text-indigo-500"
                                    >
                                    Actualizar
                                    </div>
                                </span>
                            </>
                        }
                    </dd>
                </div>

                <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
                    <dt className="text-lg font-medium text-gray-500">Categoria</dt>
                    <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                        {
                            updateCategory ?
                            <>
                            <form onSubmit={e=>onSubmit(e)} className="flex w-full">

                                <span className="flex-grow">
                                    {
                                        categories &&
                                        categories !== null &&
                                        categories !== undefined &&
                                        categories.map(category=>{
                                            if(category.sub_categories.length === 0){
                                                return(
                                                    <div key={category.id} className='flex items-center h-5'>
                                                    <input
                                                        onChange={e => onchange(e)}
                                                        value={category.id.toString()}
                                                        name='category'
                                                        type='radio'
                                                        required
                                                        className='focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded-full'
                                                    />
                                                    <label className="ml-3 text-lg dark:text-dark-txt text-gray-900 font-light">
                                                        {category.name}
                                                    </label>
                                                    </div>
                                                )
                                            }else{

                                                let result = []
                                                result.push(
                                                    <div key={category.id} className='flex items-center h-5 mt-2'>
                                                    <input
                                                        onChange={e => onchange(e)}
                                                        value={category.id.toString()}
                                                        name='category'
                                                        type='radio'
                                                        required
                                                        className='focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded-full'
                                                    />
                                                    <label className="ml-3 text-lg dark:text-dark-txt text-gray-900 font-regular">
                                                        {category.name}
                                                    </label>
                                                    </div>
                                                )

                                                category.sub_categories.map(sub_category=>{
                                                    result.push(
                                                        <div key={sub_category.id} className='flex items-center h-5 ml-2 mt-1'>
                                                        <input
                                                            onChange={e => onchange(e)}
                                                            value={sub_category.id.toString()}
                                                            name='category'
                                                            type='radio'
                                                            className='focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded-full'
                                                        />
                                                        <label className="ml-3 text-lg dark:text-dark-txt text-gray-900 font-light">
                                                            {sub_category.name}
                                                        </label>
                                                        </div>
                                                    )
                                                })
                                                return result
                                            }

                                        })
                                    }
                                </span>
                                <span className="ml-4 flex-shrink-0">
                                    <button
                                    type="submit"
                                    className="rounded-md mr-2 bg-white font-medium text-indigo-600 hover:text-indigo-500"
                                    >
                                    Guardar
                                    </button>
                                    <div
                                    onClick={()=>setUpdateCategory(false)}
                                    className="cursor-pointer inline-flex rounded-md bg-white font-medium text-indigo-600 hover:text-indigo-500"
                                    >
                                    Cancelar
                                    </div>
                                </span>
                            </form>
                            </>
                            :
                            <>
                                <span className="flex-grow text-lg">
                                    {
                                        post.category ?

                                        post.category.name
                                        :
                                        <p className=" w-full py-2 bg-gray-100 mt-4 text-lg font-regular text-gray-800 leading-8"></p>
                                    }
                                    </span>
                                <span className="ml-4 flex-shrink-0">
                                    <div
                                    onClick={()=>setUpdateCategory(true)}
                                    className="cursor-pointer inline-flex rounded-md bg-white font-medium text-indigo-600 hover:text-indigo-500"
                                    >
                                    Actualizar
                                    </div>
                                </span>
                            </>
                        }
                    </dd>
                </div>

                
                </dl>
            </div>

            <Transition.Root show={open} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={setOpen}>
                <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
                >
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                    leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    >
                    <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl sm:p-6">
                        <div>
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                            {
                                post.title && post.description && post.slug&& post.content ?
                                <CheckIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                                :
                                <XMarkIcon className="h-6 w-6 text-rose-600" aria-hidden="true" />

                            }
                        </div>
                        <div className="mt-3 text-center sm:mt-5">
                            <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                            {
                                post.status === 'published' ?
                                <span>¿Redactar este post?</span>
                                :
                                <span>¿Publicar este post?</span>

                            }
                            </Dialog.Title>
                            <div className="mt-2">
                            {
                                post.title && post.description && post.slug&& post.content ?
                                <></>
                                :
                                <p className="text-sm text-gray-500">
                                    Para publicar este post debes añadir: Título, Descripción, Slug y Contenido
                                </p>
                                

                            }
                            </div>
                        </div>
                        </div>
                        {
                            (post.title && post.description && post.slug&& post.content) &&
                            <>
                            
                                {
                                    post.status === 'published' ?
                                    <form onSubmit={e=>onSubmitDraft(e)} className="mt-5 sm:mt-6">
                                            <button
                                                type="submit"
                                                className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
                                                
                                            >
                                                    <span>Editar</span>
                                            </button>
                                            :
                                            <></>
                                    </form>
                                    :
                                    <form onSubmit={e=>onSubmitPublish(e)} className="mt-5 sm:mt-6">
                                            <button
                                                type="submit"
                                                className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
                                                
                                            >
                                                    <span>Publicar</span>
                                            </button>
                                            :
                                            <></>
                                    </form>
                                }
                            </>
                        }
                    </Dialog.Panel>
                    </Transition.Child>
                </div>
                </div>
            </Dialog>
            </Transition.Root>

            <Transition.Root show={openDelete} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={setOpenDelete}>
                <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
                >
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                    leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    >
                    <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl sm:p-6">
                        <div>
                        <div className="mt-3 text-center sm:mt-5">
                            <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                            <span>Eliminar Post</span>
                            </Dialog.Title>
                            <div className="mt-2">
                            
                                <p className="text-sm text-gray-500">
                                ¿Está seguro de que desea eliminar esta publicación?
                                </p>
                            </div>
                        </div>
                        </div>
                        <form onSubmit={e=>onSubmitDelete(e)} className="mt-5 sm:mt-6">
                                <button
                                    type="submit"
                                    className="inline-flex w-full justify-center rounded-md border border-transparent bg-rose-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 sm:text-sm"
                                    
                                >
                                        <span>Eliminar</span>
                                </button>
                        </form>
                    </Dialog.Panel>
                    </Transition.Child>
                </div>
                </div>
            </Dialog>
            </Transition.Root>

            </>
            :
            <>loading</>
        }
        </Layouts>
    )
}

const mapStateToProps=state=>({
    post: state.blog.post,
    isAuthenticated: state.auth.isAuthenticated,
    categories: state.categories.categories
})

export default connect(mapStateToProps,{
    get_blog,
    get_categories,
    get_blog_author
}) (EditPost)