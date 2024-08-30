import { Loader2, PlusSquare } from 'lucide-react';
import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import GlobalApi from './../../../service/GlobalApi';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

const AddResume = () => {
    const [openDialog, setOpenDialog] = useState(false);
    const [resumeTitle, setResumeTitle] = useState("");
    const { user } = useUser();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onCreate = () => {
        setLoading(true);

        const data = {
            title: resumeTitle,
            userEmail: user?.primaryEmailAddress?.emailAddress,
            userName: user?.fullName
        };

        const payload = { data };

        console.log("Sending data: ", payload);

        GlobalApi.createNewResume(payload).then(response => {
            console.log("API response:", response);
            // Check if the response structure is as expected
            if (response && response.data && response.data.data && response.data.data.id) {
                const strapiId = response.data.data.id; // Capture Strapi-generated ID
                setLoading(false);
                console.log("Navigating to:", '/dashboard/resume/' + strapiId + "/edit");
                navigate('/dashboard/resume/' + strapiId + "/edit");
                setOpenDialog(false); // Close dialog on success
                setResumeTitle(""); // Clear input field
            } else {
                console.error("Unexpected response structure:", response);
                setLoading(false);
            }
        }).catch(err => {
            console.error("Error response:", err.response); // Log detailed error response
            console.error("Error data:", err.response?.data); // Log server's error message
            setLoading(false);
        });
    };

    return (
        <div>
            <div className='p-14 py-24 border items-center flex justify-center bg-secondary rounded-lg h-[280px] hover:scale-105 transition-all hover:shadow-md cursor-pointer border-dashed'
                onClick={() => setOpenDialog(true)}>
                <PlusSquare />
            </div>

            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New Resume</DialogTitle>
                        <DialogDescription>
                            <p>Add a title for your new resume</p>
                            <Input className="my-2" placeholder="Ex. Mern Stack resume"
                                value={resumeTitle}
                                onChange={(e) => setResumeTitle(e.target.value)}
                            />
                        </DialogDescription>
                        <div className='flex justify-end gap-5'>
                            <Button onClick={() => setOpenDialog(false)} variant="ghost">Cancel</Button>
                            <Button
                                disabled={!resumeTitle || loading}
                                onClick={onCreate}>
                                {loading ? <Loader2 className='animate-spin' /> : 'Create'}
                            </Button>
                        </div>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default AddResume;
