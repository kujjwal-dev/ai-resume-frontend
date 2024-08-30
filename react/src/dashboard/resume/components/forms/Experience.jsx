import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import React, { useContext, useEffect, useState } from 'react';
import RichTextEditor from '../RichTextEditor';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import { useParams } from 'react-router-dom';
import GlobalApi from './../../../../../service/GlobalApi';
import { toast } from 'sonner';
import { LoaderCircle } from 'lucide-react';

const formField = {
  title: '',
  companyName: '',
  city: '',
  state: '',
  startDate: '',
  endDate: '',
  workSummery: '', // Updated to workSummery
};

function Experience() {
  const [experienceList, setExperienceList] = useState([]);
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const params = useParams();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (resumeInfo?.Experience?.length > 0) {
      setExperienceList(resumeInfo.Experience);
    }
  }, [resumeInfo]);

  const handleChange = (index, event) => {
    const newEntries = [...experienceList];
    const { name, value } = event.target;
    newEntries[index][name] = value;
    setExperienceList(newEntries);
  };

  const AddNewExperience = () => {
    setExperienceList([...experienceList, formField]);
  };

  const RemoveExperience = () => {
    setExperienceList(experienceList.slice(0, -1));
  };

  const handleRichTextEditor = (e, name, index) => {
    const newEntries = [...experienceList];
    newEntries[index][name] = e.target.value;
    setExperienceList(newEntries);
  };

  useEffect(() => {
    setResumeInfo({
      ...resumeInfo,
      Experience: experienceList
    });
  }, [experienceList]);

  const onSave = async () => {
    setLoading(true);
    const data = {
      data: {
        Experience: experienceList.map(({ id, ...rest }) => rest)
      }
    };

    try {
      const res = await GlobalApi.UpdateResumeDetail(params?.resumeId, data);
      console.log(res);
      toast('Details updated!');
    } catch (error) {
      console.error('Error updating resume details:', error);
      toast.error('Failed to update details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className='p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10'>
        <h2 className='font-bold text-lg'>Professional Experience</h2>
        <p>Add Your previous Job experience</p>
        <div>
          {experienceList.map((item, index) => (
            <div key={index}>
              <div className='grid grid-cols-2 gap-3 border p-3 my-5 rounded-lg'>
                <div>
                  <label className='text-xs'>Position Title</label>
                  <Input name="title"
                    onChange={(event) => handleChange(index, event)}
                    defaultValue={item?.title}
                  />
                </div>
                <div>
                  <label className='text-xs'>Company Name</label>
                  <Input name="companyName"
                    onChange={(event) => handleChange(index, event)}
                    defaultValue={item?.companyName} />
                </div>
                <div>
                  <label className='text-xs'>City</label>
                  <Input name="city"
                    onChange={(event) => handleChange(index, event)}
                    defaultValue={item?.city} />
                </div>
                <div>
                  <label className='text-xs'>State</label>
                  <Input name="state"
                    onChange={(event) => handleChange(index, event)}
                    defaultValue={item?.state}
                  />
                </div>
                <div>
                  <label className='text-xs'>Start Date</label>
                  <Input type="date"
                    name="startDate"
                    onChange={(event) => handleChange(index, event)}
                    defaultValue={item?.startDate} />
                </div>
                <div>
                  <label className='text-xs'>End Date</label>
                  <Input type="date" name="endDate"
                    onChange={(event) => handleChange(index, event)}
                    defaultValue={item?.endDate}
                  />
                </div>
                <div className='col-span-2'>
                  <RichTextEditor
                    index={index}
                    value={item?.workSummery} // Updated to workSummery
                    onRichTextEditorChange={(event) => handleRichTextEditor(event, 'workSummery', index)} />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className='flex justify-between'>
          <div className='flex gap-2'>
            <Button className='flex gap-2 ' onClick={AddNewExperience}>
              Add New Experience
            </Button>
            <Button className='flex gap-2 ' onClick={RemoveExperience}>
              Remove Experience
            </Button>
          </div>
          <Button className='' onClick={onSave}>
            {loading ? <LoaderCircle className='animate-spin' /> : 'Save Experience'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Experience;
