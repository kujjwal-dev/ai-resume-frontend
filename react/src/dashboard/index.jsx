import React, { useEffect, useState } from 'react';
import AddResume from './components/AddResume';
import { useUser } from '@clerk/clerk-react';
import GlobalApi from './../../service/GlobalApi';
import ResumeCardItem from './components/ResumeCardItem';

const Dashboard = () => {
  const { user } = useUser();
  const [resumeList, setResumeList] = useState([]);

  useEffect(() => {
    if (user) {
     user &&  GetResumesList();
    }
  }, [user]);

  const GetResumesList = () => {
    GlobalApi.getUserResumes(user?.primaryEmailAddress.emailAddress)
      .then(response => {
        console.log(response.data);
        setResumeList(response.data.data);
        console.log(resumeList);
      })
      .catch(error => {
        console.error('Error fetching resumes:', error);
      });
  };

  return (
    <div className='p-10 md:px-20 lg:px-32'>
      <h2 className='font-bold text-3xl'>My Resumes</h2>
      <p>Start Creating AI resumes for your next Job role</p>
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 mt-10'>
        <AddResume />
        {/* Map over resumeList to render ResumeCardItem components */}
        {resumeList.length > 0 ? <>
        {resumeList.length > 0 ? 
      resumeList.map((resume, index) => (
        <ResumeCardItem resume={resume} key={index} refreshData={GetResumesList} />
      )) : "Loading..."  
      }
        </>
: <>
<h1>No resume found</h1>
</>
}

      </div>
    </div>
  );
};

export default Dashboard;
