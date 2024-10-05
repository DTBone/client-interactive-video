import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { Divider } from '@mui/material';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import ImportContactsOutlinedIcon from '@mui/icons-material/ImportContactsOutlined';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import { useTab } from './Context/TabContext';
import CloseIcon from '@mui/icons-material/Close';

const Nav = ({ onNavClick }) => {
    const { openDetailSubmission, submissionStatus, setOpenDetailSubmission } = useTab();
    const handleCloseDetail = () => {
        setOpenDetailSubmission(false);
    }
    return (
        <div className="bg-[#fafafa] w-full h-5 flex items-center ">
            <Stack direction="row" alignItems="center" sx={{ padding: '4px', }}>
                <Button
                    variant="text"
                    onClick={() => onNavClick('description')}
                    startIcon={<DescriptionOutlinedIcon />}
                >

                    Description</Button>
                <Divider orientation="vertical" variant="middle" flexItem />
                <Button
                    variant="text"
                    onClick={() => onNavClick('editorial')}
                    startIcon={<ImportContactsOutlinedIcon />}
                >Editorial</Button>
                <Divider orientation="vertical" variant="middle" flexItem />
                <Button
                    variant="text"
                    onClick={() => onNavClick('submission')}
                    startIcon={<HistoryOutlinedIcon />}
                >Submission</Button>


                {openDetailSubmission && (
                    <>
                        <Divider orientation="vertical" variant="middle" flexItem />
                        <Button
                            variant="text"
                            onClick={() => onNavClick('detailSubmission')}
                            startIcon={<HistoryOutlinedIcon />}
                            endIcon={<CloseIcon onClick={handleCloseDetail} />}
                        >{submissionStatus}</Button>
                    </>
                )}


            </Stack>
        </div>
    )
}

export default Nav
