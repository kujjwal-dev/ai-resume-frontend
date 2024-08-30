import React, { useState } from 'react'
import PersonalDetail from './forms/PersonalDetail'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Home, LayoutGrid } from 'lucide-react'
import Summary from './forms/Summary'
import Experience from './forms/Experience'
import Education from './forms/Education'
import Skills from './forms/Skills'
import { Link, Navigate, useParams } from 'react-router-dom'
import ThemeColor from './ThemeColor'

const FormSection = () => {
  const[activeFormIndex,setActiveFormIndex] = useState(1);
  const[enableNext,setEnableNext]=useState(false);
  const{resumeId} = useParams();
  return (
    <div>
      <div className='flex justify-between items-center'>
        <div className='flex gap-5'>
        <Link to={'/dashboard'}>
          <Button> <Home/> </Button>
        </Link>
        <ThemeColor/>
        </div>
        <div className='flex gap-2'>
          {activeFormIndex>1 
          && 
          <Button size="sm" className="" 
          onClick={() => setActiveFormIndex(activeFormIndex-1)}><ArrowLeft/>Previous</Button>}
          <Button 
          disabled={!enableNext}
          className="flex gap-2" size="sm" 
          onClick={() => setActiveFormIndex(activeFormIndex+1)}>Next</Button>
        </div>
      </div>
      {/* Personal Detail Form */}

     {activeFormIndex==1? <PersonalDetail enabledNext={(v) => setEnableNext(v)} />
      : activeFormIndex==2 ?
      <Summary enabledNext={(v) => setEnableNext(v)} />
       : activeFormIndex==3 ? 
      <Experience enabledNext={(v) => setEnableNext(v)}/>
        : activeFormIndex==4 ?
      <Education enabledNext={(v) => setEnableNext(v)} />
        : activeFormIndex==5 ? 
      <Skills enabledNext={(v) => setEnableNext(v)}/>
        : activeFormIndex==6 ?
       <Navigate to={'/my-resume/' + resumeId + "/view" } /> : null}

      {/* Sumamry */}

      {/* Experience */}


      {/* Educatioanl Detail */}


      {/* Skills */}



    </div>
  )
}

export default FormSection