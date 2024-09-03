import React, { useContext, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import RichTextEditor from '../RichTextEditor';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import GlobalApi from '../../../../../service/GlobalApi';
import { useParams } from 'react-router-dom';
import { LoaderCircle } from 'lucide-react';
import { toast } from 'sonner';

const formField = {
    title: '',
    companyName: '',
    city: '',
    state: '',
    startDate: '',
    endDate: '',
    workSummery: ''
};

const Experience = () => {
    const [experienceList, setExperienceList] = useState([formField]);
    const params = useParams();
    const [loading, setLoading] = useState(false);

    const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);

    // Load existing experience data on component mount
    useEffect(() => {
        if (resumeInfo?.Experience?.length) {
            setExperienceList(resumeInfo.Experience);
        }
    }, []); // Empty dependency array to run only once on mount

    // Update resumeInfo whenever experienceList changes
    useEffect(() => {
        setResumeInfo((prevInfo) => ({
            ...prevInfo,
            Experience: experienceList,
        }));
    }, [experienceList, setResumeInfo]); // Dependency array to run when experienceList changes

    const handleChange = (index, event) => {
        const newEntries = [...experienceList];
        const { name, value } = event.target;
        newEntries[index][name] = value;
        setExperienceList(newEntries);
    };

    const handleRichTextEditor = (e, name, index) => {
        const newEntries = [...experienceList];
        newEntries[index][name] = e.target.value;
        setExperienceList(newEntries);
    };

    const AddNewExperience = () => {
        setExperienceList([...experienceList, { ...formField }]);
    };

    const RemoveExperience = () => {
        setExperienceList((experienceList) => experienceList.slice(0, -1));
    };

    const onSave = () => {
        setLoading(true);
        const data = {
            data: {
                Experience: experienceList.map(({ id, ...rest }) => rest),
            },
        };

        GlobalApi.UpdateResumeDetail(params?.resumeId, data).then(
            (res) => {
                console.log(res);
                setLoading(false);
                toast('Details updated!');
            },
            (error) => {
                setLoading(false);
            }
        );
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
                                    <Input name="title" value={item.title} onChange={(event) => handleChange(index, event)} />
                                </div>
                                <div>
                                    <label className='text-xs'>Company Name</label>
                                    <Input name="companyName" value={item.companyName} onChange={(event) => handleChange(index, event)} />
                                </div>
                                <div>
                                    <label className='text-xs'>City</label>
                                    <Input name="city" value={item.city} onChange={(event) => handleChange(index, event)} />
                                </div>
                                <div>
                                    <label className='text-xs'>State</label>
                                    <Input name="state" value={item.state} onChange={(event) => handleChange(index, event)} />
                                </div>
                                <div>
                                    <label className='text-xs'>Start Date</label>
                                    <Input type="date" name="startDate" value={item.startDate} onChange={(event) => handleChange(index, event)} />
                                </div>
                                <div>
                                    <label className='text-xs'>End Date</label>
                                    <Input type="date" name="endDate" value={item.endDate} onChange={(event) => handleChange(index, event)} />
                                </div>
                                <div className='col-span-2'>
                                    <RichTextEditor index={index} onRichTextEditorChange={(event) => handleRichTextEditor(event, 'workSummery', index)} value={item.workSummery} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className='flex justify-between'>
                    <div className='flex gap-2'>
                        <Button variant='outline' onClick={AddNewExperience} className='text-primary'>+ Add More Experience</Button>
                        <Button variant='outline' onClick={RemoveExperience} className='text-primary'>- Remove</Button>
                    </div>
                    <Button disabled={loading} onClick={onSave}>
                        {loading ? <LoaderCircle className='animate-spin' /> : 'Save'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Experience;
