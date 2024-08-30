import { Loader2Icon, MoreVertical, Notebook } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useState } from "react";
import GlobalApi from "../../../service/GlobalApi";
import { toast } from "sonner";



const ResumeCardItem = ({ resume, refreshData }) => {
  console.log(resume);
  const { resumeId, title, userEmail, userName } = resume.attributes;
  console.log(title, userEmail, userName);

  const navigation = useNavigate();

  const [openAlert, setOpenAlert] = useState(false);
  const [loading, setLoading] = useState(false);

  const onDelete = () => {
    setLoading(true)
    GlobalApi.DeleteResumeById(resume.id).then(resp => {
      console.log(resp);
      toast('Resume Deleted')
      refreshData()
      setLoading(false)
      setOpenAlert(false)
    },(error) => {
      setLoading(false);
    })
  }

  return (
    <div>
      <Link to={'/dashboard/resume/' + resume.id + "/edit"} >
        <div className='p-14 py-24 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center h-[280px] border border-primary rounded-lg hover:scale-105 transition-all hover:shadow-md shadow-primary  '>
          {/* <Notebook size='48' /> */}
          <img src="resume.png" alt="" width={180} height={180} />
        </div>
      </Link>
      <div className='border p-3 flex justify-between  text-black rounded-b-lg shadow-lg'
        style={{
          background: resume?.themeColor
        }}>
        <h2 className='text-sm'>{title || "Loading.."}</h2>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <MoreVertical className='h-4 w-4 cursor-pointer' />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => navigation('/dashboard/resume/' + resume.id + "/edit")}>Edit</DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigation('/my-resume/' + resume.id + "/view")}>View</DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigation('/my-resume/' + resume.id + "/view")}>Download</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setOpenAlert(true)}>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <AlertDialog open={openAlert} >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your account
                and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setOpenAlert(false)}>Cancel</AlertDialogCancel>
              <AlertDialogAction disabled={loading} onClick={onDelete}>
               {loading ? <Loader2Icon className="animate-spin"/> : 'Delete'}
                
                </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>


      </div>
    </div>
  );
};

export default ResumeCardItem;
