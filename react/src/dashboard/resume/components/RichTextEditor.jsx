import { Button } from '@/components/ui/button';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import { Brain, LoaderCircle } from 'lucide-react';
import { useContext, useState } from 'react';
import { Editor, EditorProvider, Toolbar, BtnBold, BtnBulletList, BtnItalic, BtnLink, BtnNumberedList, BtnRedo, BtnStrikeThrough, BtnUnderline, BtnUndo, Separator } from 'react-simple-wysiwyg';
import { toast } from 'sonner';
import { AIChatSession } from '../../../../service/AIModal';

const prompt = 'position title: {positionTitle}, depends on position title give 3-5 paragraph suggestions for my experience in resume, in HTML format.';

export default function RichTextEditor({ onRichTextEditorChange, index }) {
  const [value, setValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);

  function onChange(e) {
    setValue(e.target.value);
    onRichTextEditorChange(e);
  }

  const GenerateSummaryFromAI = async () => {
    if (!resumeInfo.Experience[index].title) {
      toast.error('Position title is required to generate summary');
      return;
    }

    setLoading(true);
    const PROMPT = prompt.replace('{positionTitle}', resumeInfo.Experience[index].title);
    console.log('PROMPT:', PROMPT);

    try {
      const result = await AIChatSession.sendMessage(PROMPT);
      const responseText = await result.response.text();

      // Parse HTML response into paragraphs
      const paragraphs = responseText.split('</p>').map(p => p.replace('<p>', ''));
      setSuggestions(paragraphs);

    } catch (error) {
      console.error('Error generating summary:', error);
      toast.error('Failed to generate summary from AI');
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionSelect = (suggestion) => {
    setValue(suggestion);
    onRichTextEditorChange({ target: { value: suggestion } }); // Notify parent component of the change
  };

  return (
    <div>
      <div className='flex justify-between my-2'>
        <label className='text-xs'>Summary</label>
        <Button variant='outline' size='sm' className='flex gap-2 border-primary text-primary' onClick={GenerateSummaryFromAI}>
          {loading ? <LoaderCircle className='animate-spin' /> : <><Brain className='h-4 w-4' /> Generate from AI</>}
        </Button>
      </div>
      {suggestions.length > 0 && (
        <div className='my-2'>
          <h3 className='font-bold'>AI Suggestions</h3>
          {suggestions.map((suggestion, index) => (
            <div key={index} className='border p-2 my-2 cursor-pointer' onClick={() => handleSuggestionSelect(suggestion)}>
              <div dangerouslySetInnerHTML={{ __html: suggestion }} />
            </div>
          ))}
        </div>
      )}
      <EditorProvider>
        <Editor value={value} onChange={onChange}>
          <Toolbar>
            <BtnUndo />
            <BtnRedo />
            <Separator />
            <BtnBold />
            <BtnItalic />
            <BtnUnderline />
            <BtnStrikeThrough />
            <Separator />
            <BtnNumberedList />
            <BtnBulletList />
            <Separator />
            <BtnLink />
          </Toolbar>
        </Editor>
      </EditorProvider>
    </div>
  );
}
