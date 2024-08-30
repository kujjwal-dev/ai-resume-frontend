import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'
import { ResumeInfoContext } from '@/context/ResumeInfoContext'
import { data } from 'autoprefixer';
import { Loader, LoaderCircle } from 'lucide-react';
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import GlobalApi from '../../../../../service/GlobalApi';
import { toast } from 'sonner';


const PersonalDetail = ({enabledNext}) => {

    const params= useParams();
    const{resumeInfo,setResumeInfo} = useContext(ResumeInfoContext);

    const[formData,setFormData] = useState();

    const[loading,setLoading] = useState(false)


    useEffect(() => {
      console.log(params)
    },[]);

    const handleInputChange=(e)=> {
        const{name,value} = e.target;
        enabledNext(false)
              setFormData({
                ...formData,
                [name]:value

              })

            setResumeInfo({
                ...resumeInfo,
                [name]:value,
            })
    }

    const onSave = (e) => {
        e.preventDefault();
        setLoading(true)
         const data={
            data: formData
         }

         console.log(data)
        GlobalApi.UpdateResumeDetail(params?.resumeId,data).then((response) => {
            console.log(response);
            enabledNext(true);
            setLoading(false);
            toast("Details updated")
        },(error) => {
            setLoading(false)
        })
        


    }

  return (
    <div className='p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10'>
    <h2 className='font-bold text-lg'>Personal Detail</h2>
    <p>Get Started with the basic information</p>

    <form onSubmit={onSave}>
        <div className='grid grid-cols-2 mt-5 gap-3'>
            <div>
                <label className='text-sm'>First Name</label>
                <Input name="firstName"  required defaultValue={resumeInfo?.firstName} onChange={handleInputChange} />
            </div>
            <div>
                <label className='text-sm'>Last Name</label>
                <Input name="lastName" defaultValue={resumeInfo?.lastName}  required onChange={handleInputChange} />
            </div>
            <div className='col-span-2'>
                <label className='text-sm'>Job Title</label>
                <Input name="jobTitle" required defaultValue={resumeInfo?.jobTitle} onChange={handleInputChange} />
            </div>
            <div className='col-span-2'>
                <label className='text-sm'>Address</label>
                <Input name="address" required defaultValue={resumeInfo?.address}  onChange={handleInputChange} />
            </div>
            <div>
                <label className='text-sm'>Phone</label>
                <Input name="phone" required defaultValue={resumeInfo?.phone} onChange={handleInputChange} />
            </div>
            <div>
                <label className='text-sm'>Email</label>
                <Input name="email" required defaultValue={resumeInfo?.email}  onChange={handleInputChange} />
            </div>
            <div className='mt-3 flex justify-end'>
                <Button type="submit" disabled={loading}>
                    { loading ? <LoaderCircle  className='animate-spin'/> : 'Save'
                    }</Button>
            </div>
        </div>
    </form>




    </div>
  )
}

export default PersonalDetail