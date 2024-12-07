/* eslint-disable react/prop-types */
import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react"
import { getProgress } from "~/store/slices/Progress/action"
import { CheckCircleOutline, FlagOutlined, School, StartOutlined } from "@mui/icons-material"
import { Card, CardContent, CardHeader, Chip, Step, StepConnector, stepConnectorClasses, StepLabel, Stepper, Typography } from "@mui/material";
import styled from "@mui/material/styles/styled";
import '~/index.css'
import { useNavigate } from "react-router-dom";
import { getAllModules } from "~/store/slices/Module/action";
import youImage from '~/assets/you.png'

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
      top: 43,
    },
    [`&.${stepConnectorClasses.active}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        backgroundImage:
          'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
      },
    },
    [`&.${stepConnectorClasses.completed}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        backgroundImage:
          'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
      },
    },
    [`& .${stepConnectorClasses.line}`]: {
      height: 3,
      border: 0,
      scale: '1 !important',
      backgroundColor: '#eaeaf0',
      borderRadius: 1,
      ...theme.applyStyles('dark', {
        backgroundColor: theme.palette.grey[800],
      }),
    },
  }));
  
const ColorlibStepIconRoot = styled('div')(({ theme }) => ({
    backgroundColor: '#ccc',
    zIndex: 1,
    color: '#fff',
    width: 90,
    height: 90,
    display: 'flex',
    borderRadius: '50%',
    border: '6px solid #fff',
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.applyStyles('dark', {
      backgroundColor: theme.palette.grey[700],
    }),
    variants: [
      {
        props: ({ ownerState }) => ownerState.active,
        style: {
          backgroundImage:
            'linear-gradient(136deg, rgb(201 181 219) 0%, rgb(152 122 201) 50%, rgb(138, 35, 135) 100%)',
          boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
          scale: 1.15
        },
      },
      {
        props: ({ ownerState }) => ownerState.completed,
        style: {
          backgroundImage:
            'linear-gradient(95deg, rgb(70 249 132) 0%, rgb(35 153 79) 50%, rgb(74 100 82) 100%)',
            boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
        },
      },
    ],
  }));

  // Location indicator with pulsing animation
const LocationIndicator = styled('div')({
    position: 'absolute',
    top: '-80px',
    left: '50%',
    width: '60px',
    height: '100px',
    transform: 'translateX(-50%)',
    animation: 'pulse 1.5s infinite',
    '@keyframes pulse': {
      '0%': {
        transform: 'translateX(-50%) scale(1)',
        opacity: 1
      },
      '50%': {
        transform: 'translateX(-50%) scale(1.2)',
        opacity: 0.7
      },
      '100%': {
        transform: 'translateX(-50%) scale(1)',
        opacity: 1
      }
    }
  });

  function ColorlibStepIcon(props) {
    const { active, completed, className } = props;
    const icons = {
      1: <StartOutlined />,
      2: <School />,
      3: <FlagOutlined />,
    };
  
    return (
      <ColorlibStepIconRoot sx={{
        ":hover": {
            cursor: 'pointer',
            transform: 'scale(1.15)',
            transition: 'all 0.3s',
        },
        transition: 'all 0.3s',
      }} ownerState={{ completed, active }} className={className}>
        {icons[String(props.icon)]}
        {active && (
        <LocationIndicator>
          <img src={youImage} alt="You are here" style={{ width: '100%', height: '100%', backgroundColor:'transparent' }} />
        </LocationIndicator>
      )}
      </ColorlibStepIconRoot>
    );
  }
const Progress = ({course}) => {
    const navigate = useNavigate()
    const [progress, setProgress] = useState(useSelector(state => state.progress.progress) || [])
    const dispatch = useDispatch()
    const [moduleDatas, setModuleDatas] = useState({})


    const fetchProgress = async () => {
        try {
            const rep = await dispatch(getProgress(course._id))
            console.log(rep.payload.data)
            setProgress(rep.payload.data)
        }
        catch (error) {
            console.log(error)
        }
    }
    const fetchModule = async () => {
        try {
            const rep = await dispatch(getAllModules(course._id))
            console.log(rep.payload)
            if(rep.payload) {
                setModuleDatas(rep.payload)
            }
        }
        catch (error) {
            console.log(error)
        }
    }
    const currentModuleIndex = progress.length > 0 ? progress.findIndex((module) => module.status !== 'completed') : 0;
    useEffect(() => {
        if(!progress || progress.length === 0 || !Array.isArray(progress)) {
            fetchProgress()
        }
        fetchModule()
    }, [dispatch])

    return (
        <div className="w-full mx-auto">
          <Card className="bg-white shadow-lg"
          sx={{
            backgroundColor: '#BFFAFA',
          }}
          >
            <CardHeader title={'Your Progress'} />
            <CardContent>
              {/* Timeline container */}
              <div className="flex items-center justify-between pt-4 pb-8">
                <Stepper 
                    alternativeLabel
                    sx={{ width: '100%',
                        height: '100%',
                     }}
                    activeStep={currentModuleIndex}
                    connector={<ColorlibConnector />}
                >
                    {progress.length > 0 && progress.map((module, index) => (
                        <Step sx={{
                            
                        ":hover": {
                            cursor: 'pointer',
                        }
                        }} key={module._id}
                        onClick={() => {
                            console.log('clicked', moduleDatas)
                            navigate(`/learns/${course._id}/module/${index+1}`, {state: {course: course, module: moduleDatas[index]}})
                        }}>
                            <StepLabel StepIconComponent={ColorlibStepIcon} active={index + 1 === currentModuleIndex} completed={index < currentModuleIndex} icon={index === progress.length -1 ? 3 : index === 0 ? 1 : 2}>
                                <div className="flex flex-col items-center">
                                    <Typography variant="h6" className="mt-2 mb-2 capitalize">{module.moduleId.title}</Typography>
                                    {module.status === 'completed' ? <CheckCircleOutline sx={{ color: 'green' }} /> : <Chip variant="outlined" label={module.status} />}
                                </div>
                            </StepLabel>
                        </Step>
                    ))}
                    </Stepper>
              </div>
            </CardContent>
          </Card>
        </div>
      );
};

export default Progress
