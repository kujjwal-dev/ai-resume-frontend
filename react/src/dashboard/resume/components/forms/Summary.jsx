import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import GlobalApi from '../../../../../service/GlobalApi';
import { toast } from 'sonner';
import { Brain, LoaderCircle } from 'lucide-react';
import { AIChatSession } from '../../../../../service/AIModal';

const prompt = 'Job Title: {jobTitle}. Provide a summary for my resume within 4-5 lines in JSON format. Each experience level (Fresher, Mid-Level, Experienced) should be a separate JSON object with the fields "experience_level" and "summary". The output should be a JSON array containing these objects with placeholders for specific details like [insert specific game genre/platform], [insert number] years, and so on.';

const Summary = ({ enabledNext }) => {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const [summery, setSummery] = useState(resumeInfo.summery || '');
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const [aiGeneratedSummeryList, setAiGeneratedSummeryList] = useState([]);

  // Update resumeInfo when summery changes, but only if it's different
  useEffect(() => {
    if (summery !== resumeInfo.summery) {
      setResumeInfo((prevInfo) => ({
        ...prevInfo,
        summery: summery,
      }));
    }
  }, [summery, resumeInfo.summery, setResumeInfo]);

  const GenerateSummeryFromAI = async () => {
    if (!resumeInfo?.jobTitle) {
      toast.error('Job title is required to generate summary');
      return;
    }

    setLoading(true);

    const PROMPT = prompt.replace('{jobTitle}', resumeInfo?.jobTitle);
    console.log('PROMPT:', PROMPT);

    try {
      const result = await AIChatSession.sendMessage(PROMPT);
      console.log("result", result);
      const parsedResult = JSON.parse(await result.response.text());
      console.log(parsedResult);
      setAiGeneratedSummeryList(parsedResult);

    } catch (error) {
      console.error('Error generating summary:', error);
      toast.error('Failed to generate summary from AI');
    } finally {
      setLoading(false);
    }
  };

  const onSave = (e) => {
    e.preventDefault();
    setLoading(true);
    const data = {
      data: {
        summery: summery,
      },
    };
    GlobalApi.UpdateResumeDetail(params?.resumeId, data).then((response) => {
      console.log(response);
      enabledNext(true);
      setLoading(false);
      toast("Details updated");
    }, (error) => {
      setLoading(false);
    });
  };

  const handleSummaryClick = (summary) => {
    setSummery(summary);
  };

  return (
    <div>
      <div className='p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10'>
        <h2 className='font-bold text-lg'>Summary</h2>
        <p>Add Summary for your job title</p>
        <form className='mt-7' onSubmit={onSave}>
          <div className='flex justify-between items-end'>
            <label>Add Summary</label>
            <Button variant='outline' onClick={GenerateSummeryFromAI} type="button" className="size='sm' border-primary text-primary">
              <Brain className='h-4 w-4' /> Generate from AI
            </Button>
          </div>
          <Textarea
            className='mt-5'
            value={summery}
            onChange={(e) => setSummery(e.target.value)}
            required
          />
          <div className='mt-3 flex justify-end'>
            <Button type="submit" disabled={loading}>
              {loading ? <LoaderCircle className='animate-spin' /> : 'Save'}
            </Button>
          </div>
        </form>
      </div>

      {aiGeneratedSummeryList.length > 0 && (
        <div>
          <h2 className='font-bold text-lg'>Suggestions</h2>
          {aiGeneratedSummeryList.map((item, index) => (
            <div key={index} className='cursor-pointer hover:bg-gray-200 p-2 rounded' onClick={() => handleSummaryClick(item?.summary)}>
              <h2 className='font-bold my-1'>Level: {item?.experience_level}</h2>
              <p>{item?.summary}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Summary;
