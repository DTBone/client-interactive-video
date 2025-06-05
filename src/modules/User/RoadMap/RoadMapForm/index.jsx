/* eslint-disable react/prop-types */
import { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Paper,
    ToggleButton,
    ToggleButtonGroup,
    Stack,
    Divider,
    Chip,
    IconButton,
    Tooltip,
    FormControl,
    FormLabel,
    FormGroup,
    Checkbox,
    FormControlLabel,
    MenuItem,
    Select,
    InputLabel,
    CircularProgress,
    OutlinedInput
} from '@mui/material';
import {
    Code as CodeIcon,
    DataThresholding as DatabaseIcon,
    Cloud as CloudIcon,
    Security as SecurityIcon,
    Phone as PhoneIcon,
    Web as WebIcon,
    Psychology as AIIcon,
    Token as BlockchainIcon,
    Help as HelpIcon,
    Schedule as ScheduleIcon,
    Language as LanguageIcon
} from '@mui/icons-material';
import loading from '~/assets/duckLoading.gif';

const EXPERIENCE_LEVELS = [
    { value: 'Beginner', label: 'Beginner', color: '#4CAF50' },
    { value: 'Intermediate', label: 'Intermediate', color: '#2196F3' },
    { value: 'Advanced', label: 'Advanced', color: '#9C27B0' }
];

const GOALS = [
    {
        id: 'web',
        label: 'Web Development',
        icon: <WebIcon />,
        color: '#2196F3',
        description: 'Frontend & Backend Development'
    },
    {
        id: 'mobile',
        label: 'Mobile Development',
        icon: <PhoneIcon />,
        color: '#4CAF50',
        description: 'iOS & Android Development'
    },
    {
        id: 'data',
        label: 'Data Science',
        icon: <DatabaseIcon />,
        color: '#FF9800',
        description: 'Data Analysis & Visualization'
    },
    {
        id: 'devops',
        label: 'DevOps',
        icon: <CodeIcon />,
        color: '#F44336',
        description: 'CI/CD & Infrastructure'
    },
    {
        id: 'cloud',
        label: 'Cloud Computing',
        icon: <CloudIcon />,
        color: '#00BCD4',
        description: 'AWS, Azure & GCP'
    },
    {
        id: 'ml',
        label: 'Machine Learning',
        icon: <AIIcon />,
        color: '#9C27B0',
        description: 'AI & Deep Learning'
    },
    {
        id: 'blockchain',
        label: 'Blockchain',
        icon: <BlockchainIcon />,
        color: '#FF5722',
        description: 'Web3 & Smart Contracts'
    },
    {
        id: 'security',
        label: 'Cyber Security',
        icon: <SecurityIcon />,
        color: '#607D8B',
        description: 'Security & Penetration Testing'
    }
];

// Danh sách ngôn ngữ lập trình theo lĩnh vực
const PROGRAMMING_LANGUAGES = {
    web: [
        { id: 'html', name: 'HTML/CSS', category: 'frontend' },
        { id: 'javascript', name: 'JavaScript', category: 'frontend' },
        { id: 'typescript', name: 'TypeScript', category: 'frontend' },
        { id: 'react', name: 'React', category: 'frontend' },
        { id: 'vue', name: 'Vue.js', category: 'frontend' },
        { id: 'angular', name: 'Angular', category: 'frontend' },
        { id: 'php', name: 'PHP', category: 'backend' },
        { id: 'nodejs', name: 'Node.js', category: 'backend' },
        { id: 'python', name: 'Python', category: 'backend' },
        { id: 'ruby', name: 'Ruby', category: 'backend' },
        { id: 'java', name: 'Java', category: 'backend' },
        { id: 'csharp', name: 'C#', category: 'backend' }
    ],
    mobile: [
        { id: 'swift', name: 'Swift', category: 'ios' },
        { id: 'objectivec', name: 'Objective-C', category: 'ios' },
        { id: 'java', name: 'Java', category: 'android' },
        { id: 'kotlin', name: 'Kotlin', category: 'android' },
        { id: 'reactnative', name: 'React Native', category: 'cross-platform' },
        { id: 'flutter', name: 'Flutter/Dart', category: 'cross-platform' },
        { id: 'xamarin', name: 'Xamarin', category: 'cross-platform' }
    ],
    data: [
        { id: 'python', name: 'Python', category: 'analysis' },
        { id: 'r', name: 'R', category: 'analysis' },
        { id: 'sql', name: 'SQL', category: 'database' },
        { id: 'scala', name: 'Scala', category: 'bigdata' },
        { id: 'julia', name: 'Julia', category: 'scientific' }
    ],
    devops: [
        { id: 'bash', name: 'Bash/Shell', category: 'scripting' },
        { id: 'python', name: 'Python', category: 'scripting' },
        { id: 'go', name: 'Go', category: 'tooling' },
        { id: 'yaml', name: 'YAML', category: 'configuration' },
        { id: 'terraform', name: 'Terraform', category: 'iac' }
    ],
    cloud: [
        { id: 'python', name: 'Python', category: 'aws' },
        { id: 'csharp', name: 'C#', category: 'azure' },
        { id: 'go', name: 'Go', category: 'gcp' },
        { id: 'typescript', name: 'TypeScript', category: 'serverless' }
    ],
    ml: [
        { id: 'python', name: 'Python', category: 'ml' },
        { id: 'r', name: 'R', category: 'statistics' },
        { id: 'cpp', name: 'C++', category: 'performance' },
        { id: 'julia', name: 'Julia', category: 'scientific' }
    ],
    blockchain: [
        { id: 'solidity', name: 'Solidity', category: 'ethereum' },
        { id: 'rust', name: 'Rust', category: 'blockchain' },
        { id: 'go', name: 'Go', category: 'blockchain' },
        { id: 'javascript', name: 'JavaScript', category: 'web3' }
    ],
    security: [
        { id: 'python', name: 'Python', category: 'scripting' },
        { id: 'bash', name: 'Bash/Shell', category: 'scripting' },
        { id: 'c', name: 'C', category: 'lowlevel' },
        { id: 'go', name: 'Go', category: 'tooling' },
        { id: 'ruby', name: 'Ruby', category: 'testing' }
    ]
};

// Định nghĩa các khoảng thời gian mục tiêu
const GOAL_TIMEFRAMES = [
    { id: '1-month', value: 1, unit: 'month', label: '1 month' },
    { id: '3-months', value: 3, unit: 'months', label: '3 months' },
    { id: '6-months', value: 6, unit: 'months', label: '6 months' },
    { id: '1-year', value: 12, unit: 'months', label: '1 year' },
    { id: '2-years', value: 24, unit: 'months', label: '2 years' },
    { id: 'custom', value: 'custom', unit: 'custom', label: 'Custom' }
];

function RoadmapForm({ onGenerateRoadmap, isLoading }) {
    const [formData, setFormData] = useState({
        currentSkills: '',
        experienceLevel: 'Beginner',
        learningGoal: '',
        timeCommitment: '',
        additionalInfo: '',
        preferredLanguages: [],
        goalTimeframe: '6-months'
    });
    const [error, setError] = useState(null);
    const [showCustomTimeframe, setShowCustomTimeframe] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Nếu chọn timeframe tùy chỉnh, hiển thị trường nhập liệu
        if (name === 'goalTimeframe' && value === 'custom') {
            setShowCustomTimeframe(true);
        } else if (name === 'goalTimeframe') {
            setShowCustomTimeframe(false);
        }
    };

    const handleGoalsChange = (_, newGoal) => {
        setFormData(prev => ({
            ...prev,
            learningGoal: newGoal,
            // Reset ngôn ngữ ưu tiên khi thay đổi mục tiêu
            preferredLanguages: []
        }));
    };

    const handleExperienceChange = (_, newLevel) => {
        if (newLevel !== null) {
            setFormData(prev => ({
                ...prev,
                experienceLevel: newLevel
            }));
        }
    };

    const handleLanguageChange = (event) => {
        const { value } = event.target;
        setFormData(prev => ({
            ...prev,
            preferredLanguages: value
        }));
    };

    const validateForm = () => {
        if (!formData.learningGoal) {
            setError('Vui lòng chọn mục tiêu học tập của bạn');
            return false;
        }

        if (!formData.timeCommitment) {
            setError('Vui lòng nhập cam kết thời gian của bạn');
            return false;
        }
        if (isNaN(formData.timeCommitment)) {
            setError('Cam kết thời gian phải là một số');
            return false;
        }
        // Cam kết thời gian phải từ 1 đến 168 giờ
        if (formData.timeCommitment < 1 || formData.timeCommitment > 168) {
            setError('Cam kết thời gian phải từ 1 đến 168 giờ');
            return false;
        }

        // Kiểm tra thời gian hoàn thành mục tiêu
        if (formData.goalTimeframe === 'custom') {
            if (!formData.customTimeframe) {
                setError('Vui lòng nhập thời gian hoàn thành mục tiêu');
                return false;
            }
            if (isNaN(formData.customTimeframe) || formData.customTimeframe <= 0) {
                setError('Thời gian hoàn thành mục tiêu phải là số dương');
                return false;
            }
        }

        return true;
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!validateForm()) {
            return;
        }

        // Chuẩn bị dữ liệu để gửi
        const formDataToSubmit = {
            ...formData,
            // Xử lý thời gian hoàn thành mục tiêu nếu là tùy chỉnh
            timeframeInfo: formData.goalTimeframe === 'custom' 
                ? { value: formData.customTimeframe, unit: formData.timeframeUnit }
                : GOAL_TIMEFRAMES.find(tf => tf.id === formData.goalTimeframe)
        };

        onGenerateRoadmap(formDataToSubmit);
    };

    // Lấy danh sách ngôn ngữ dựa vào mục tiêu đã chọn
    const getAvailableLanguages = () => {
        if (!formData.learningGoal) return [];
        return PROGRAMMING_LANGUAGES[formData.learningGoal.id] || [];
    };

    return (
        <Paper
            elevation={3}
            sx={{
                p: 4,
                width: '80%',
                maxWidth: 1000,
                my: 4,
                borderRadius: 2,
                backgroundColor: '#FFFFFF',
                alignSelf: 'center'
            }}
        >
            
            <Typography variant="h4" gutterBottom sx={{
                fontWeight: 600,
                color: '#1a237e',
                textAlign: 'center',
                mb: 4
            }}>
                Create Your Learning Roadmap
            </Typography>
            <div id='overlay' style={{
                        display: isLoading ? 'block' : 'none',
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(73, 72, 72, 0.5)',
                        zIndex: 2,
                        cursor: 'pointer'
                        }}>
                        <img src={loading} alt="loading" style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '500px',
                            borderRadius: '10px'
                        }}/>
                    </div>

            <form onSubmit={handleSubmit}>
                <Stack spacing={4}>
                    {/* Phần Kỹ Năng Hiện Tại */}
                    <Box>
                        <Typography variant="h6" gutterBottom sx={{ color: '#333' }}>
                        Current Skills <Chip label="Optional" color="success" size="small" />
                        </Typography>
                        <TextField
                            fullWidth
                            name="currentSkills"
                            multiline
                            rows={3}
                            value={formData.currentSkills}
                            onChange={handleChange}
                            placeholder="What technologies and skills do you already know?"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    backgroundColor: '#F5F5F5'
                                }
                            }}
                        />
                    </Box>

                    {/* Phần Cấp Độ Kinh Nghiệm */}
                    <Box>
                        <Typography variant="h6" gutterBottom sx={{ color: '#333' }}>
                        Experience Level <Chip label="Required" color="error" size="small" />
                        </Typography>
                        <ToggleButtonGroup
                            exclusive
                            fullWidth
                            value={formData.experienceLevel}
                            onChange={handleExperienceChange}
                            sx={{ mb: 2 }}
                        >
                            {EXPERIENCE_LEVELS.map(level => (
                                <ToggleButton
                                    key={level.value}
                                    value={level.value}
                                    sx={{
                                        py: 1.5,
                                        color: level.color,
                                        '&.Mui-selected': {
                                            backgroundColor: `${level.color}20`,
                                            color: level.color,
                                            '&:hover': {
                                                backgroundColor: `${level.color}30`,
                                            }
                                        }
                                    }}
                                >
                                    {level.label}
                                </ToggleButton>
                            ))}
                        </ToggleButtonGroup>
                    </Box>

                    {/* Phần Mục Tiêu Học Tập */}
                    <Box>
                        <Typography variant="h6" gutterBottom sx={{
                            color: '#333',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                        }}>
                            Learning Goal                            <Tooltip title="Choose the area you want to focus on learning">
                                <IconButton size="small">
                                    <HelpIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                            <Chip label="Required" color="error" size="small" />
                        </Typography>
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                                gap: 2
                            }}
                        >
                            {GOALS.map((goal) => (
                                <Paper
                                    key={goal.id}
                                    sx={{
                                        p: 2,
                                        cursor: 'pointer',
                                        border: '2px solid',
                                        borderColor: formData.learningGoal?.id === goal.id
                                            ? goal.color
                                            : 'transparent',
                                        backgroundColor: formData.learningGoal?.id === goal.id
                                            ? `${goal.color}10`
                                            : '#F5F5F5',
                                        transition: 'all 0.2s ease',
                                        '&:hover': {
                                            backgroundColor: `${goal.color}20`,
                                        }
                                    }}
                                    onClick={() => {
                                        handleGoalsChange(null, goal);
                                    }}
                                >
                                    <Stack direction="row" spacing={2} alignItems="center">
                                        <Box
                                            sx={{
                                                color: goal.color,
                                                display: 'flex',
                                                alignItems: 'center'
                                            }}
                                        >
                                            {goal.icon}
                                        </Box>
                                        <Stack spacing={0.5}>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                                {goal.label}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {goal.description}
                                            </Typography>
                                        </Stack>
                                    </Stack>
                                </Paper>
                            ))}
                        </Box>
                    </Box>

                    {/* Phần Ngôn Ngữ Ưu Tiên (Mới) */}
                    {formData.learningGoal && (
                        <Box>
                            <Typography variant="h6" gutterBottom sx={{
                                color: '#333',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                            }}>
                                <LanguageIcon fontSize="small" sx={{ color: formData.learningGoal.color }} />
                                Preferred Languages
                                <Tooltip title="Choose the programming languages you want to learn">
                                    <IconButton size="small">
                                        <HelpIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                                <Chip label="Optional" color="success" size="small" />
                            </Typography>
                            
                            <FormControl fullWidth sx={{ m:1 }}>
                                <InputLabel id="preferred-languages-label">Choose the programming languages you want to learn</InputLabel>
                                <Select
                                    labelId="preferred-languages-label"
                                    id="preferred-languages"
                                    multiple
                                    value={formData.preferredLanguages}
                                    onChange={handleLanguageChange}
                                    input={<OutlinedInput label="Choose the programming languages you want to learn" />}
                                    renderValue={(selected) => (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {selected.map((value) => {
                                                const language = getAvailableLanguages().find(lang => lang.id === value);
                                                return (
                                                    <Chip 
                                                        key={value} 
                                                        label={language ? language.name : value} 
                                                        size="small"
                                                        sx={{ 
                                                            backgroundColor: `${formData.learningGoal.color}20`,
                                                            color: formData.learningGoal.color
                                                        }}
                                                    />
                                                );
                                            })}
                                        </Box>
                                    )}
                                    MenuProps={{
                                        PaperProps: {
                                            style: {
                                                maxHeight: 48 * 4.5 + 8,
                                                width: '250px',
                                            },
                                        },
                                    }}
                                >
                                    {getAvailableLanguages().map((language) => (
                                        <MenuItem key={language.id} value={language.id}>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox 
                                                        checked={formData.preferredLanguages.indexOf(language.id) > -1}
                                                        sx={{
                                                            color: formData.learningGoal.color,
                                                            '&.Mui-checked': {
                                                                color: formData.learningGoal.color,
                                                            }
                                                        }}
                                                    />
                                                }
                                                label={
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                                        <Typography>{language.name}</Typography>
                                                        <Chip 
                                                            label={language.category} 
                                                            size="small" 
                                                            sx={{ ml: 1, fontSize: '0.7rem' }} 
                                                        />
                                                    </Box>
                                                }
                                                sx={{ width: '100%', my: 0 }}
                                            />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                    )}

                    {/* Phần Cam Kết Thời Gian */}
                    <Box>
                        <Typography variant="h6" gutterBottom sx={{ color: '#333' }}>
                            Time Commitment (hours/week)
                            <Chip label="Required" sx={{
                                ml: 1,
                            }} color="error" size="small" />
                        </Typography>
                        <TextField
                            fullWidth
                            Required={true}
                            name="timeCommitment"
                            value={formData.timeCommitment}
                            onChange={handleChange}
                            placeholder="How many hours per week can you commit to learning?"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    backgroundColor: '#F5F5F5'
                                }
                            }}
                        />
                    </Box>

                    {/* Phần Thời Gian Hoàn Thành Mục Tiêu (Mới) */}
                    <Box>
                        <Typography variant="h6" gutterBottom sx={{
                            color: '#333',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                        }}>
                            <ScheduleIcon fontSize="small" />
                            Goal Timeframe (months)
                            <Tooltip title="Choose the timeframe you want to achieve your learning goal">
                                <IconButton size="small">
                                    <HelpIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                            <Chip label="Required" color="error" size="small" />
                        </Typography>
                        
                        <FormControl fullWidth sx={{ mb: showCustomTimeframe ? 2 : 0 }}>
                            <Select
                                value={formData.goalTimeframe}
                                name="goalTimeframe"
                                onChange={handleChange}
                                displayEmpty
                                sx={{
                                    borderRadius: 2,
                                    backgroundColor: '#F5F5F5'
                                }}
                                MenuProps={{
                                    PaperProps: {
                                        style: {
                                            maxHeight: 48 * 4.5 + 8,
                                        },
                                    },
                                }}
                            >
                                {GOAL_TIMEFRAMES.map((timeframe) => (
                                    <MenuItem key={timeframe.id} value={timeframe.id}>
                                        {timeframe.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        
                        {showCustomTimeframe && (
                            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                                <TextField
                                    fullWidth
                                    name="customTimeframe"
                                    value={formData.customTimeframe}
                                    onChange={handleChange}
                                    placeholder="Enter a custom timeframe"
                                    type="number"
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                            backgroundColor: '#F5F5F5'
                                        }
                                    }}
                                />
                                <FormControl sx={{ minWidth: 120 }}>
                                    <Select
                                        value={formData.timeframeUnit}
                                        name="timeframeUnit"
                                        onChange={handleChange}
                                        sx={{
                                            borderRadius: 2,
                                            backgroundColor: '#F5F5F5'
                                        }}
                                    >
                                        <MenuItem value="days">Days</MenuItem>
                                        <MenuItem value="weeks">Weeks</MenuItem>
                                        <MenuItem value="months">Months</MenuItem>
                                        <MenuItem value="years">Years</MenuItem>
                                    </Select>
                                </FormControl>
                            </Stack>
                        )}
                    </Box>

                    {/* Phần Thông Tin Bổ Sung */}
                    <Box>
                        <Typography variant="h6" gutterBottom sx={{ color: '#333' }}>
                            Additional Information
                            <Chip label="Optional" sx={{
                                ml: 1,
                            }} color="success" size="small" />
                        </Typography>
                        <TextField
                            fullWidth
                            name="additionalInfo"
                            multiline
                            rows={3}
                            value={formData.additionalInfo}
                            onChange={handleChange}
                            placeholder="Is there anything else you'd like to share?"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    backgroundColor: '#F5F5F5'
                                }
                            }}
                        />
                    </Box>
                    
                    {/* Thông Báo Lỗi */}
                    {error && (
                        <Typography variant="body2" sx={{ color: 'error.main' }}>
                            {error}
                        </Typography>
                    )}
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={isLoading}
                        sx={{
                            mt: 2,
                            py: 1.5,
                            backgroundColor: '#1a237e',
                            '&:hover': {
                                backgroundColor: '#0d47a1'
                            },
                            borderRadius: 2
                        }}
                    >
                        {isLoading ? 'Generating...' : 'Generate Roadmap'}
                    </Button>
                </Stack>
            </form>
        </Paper>
    );
}

export default RoadmapForm;