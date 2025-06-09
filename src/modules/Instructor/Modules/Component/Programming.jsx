import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Switch,
  FormControlLabel,
  Divider,
} from "@mui/material";
import Editor from "@monaco-editor/react";
import JoditEditor from "jodit-react";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { useNotification } from "~/Hooks/useNotification";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { createModuleItemProgramming } from "~/store/slices/ModuleItem/action";
import { toggleRefresh } from "~/store/slices/Module/moduleSlice";
import LanguageSelector from "./LanguageSelector";

const programProblemSchema = Yup.object().shape({
  problemName: Yup.string()
    .required("Problem name is required")
    .max(100, "Problem name cannot be more than 100 characters")
    .trim(),
  content: Yup.string().required("Problem content is required"),
  // .max(5000, 'Problem content cannot be more than 5000 characters'),
  difficulty: Yup.string()
    .required("Difficulty is required")
    .oneOf(
      ["Easy", "Medium", "Hard"],
      "Difficulty must be one of: Easy, Medium, Hard"
    ),
  tags: Yup.array()
    .of(Yup.string().trim())
    .max(10, "Maximum of 10 tags allowed"),
  constraints: Yup.string().required("Constraints are required"),
  inputFormat: Yup.string().required("Input format is required"),
  outputFormat: Yup.string().required("Output format is required"),
  sampleInput: Yup.string().required("Sample input is required"),
  sampleOutput: Yup.string().required("Sample output is required"),
  explanation: Yup.string(),

  editorial: Yup.string(),
  baseScore: Yup.number()

    .min(0, "Base score must be at least 0"),
  timeBonus: Yup.number().min(0, "Time bonus must be at least 0"),
  memoryBonus: Yup.number().min(0, "Memory bonus must be at least 0"),
  testcases: Yup.array()
    .of(
      Yup.object().shape({
        input: Yup.string().required("Input is required"),
        expectedOutput: Yup.string().required("Expected output is required"),
        executeTimeLimit: Yup.number()
          .required("Time limit is required")
          .min(100, "Time limit must be at least 100ms")
          .max(15000, "Time limit cannot exceed 15000ms"),
        weight: Yup.number()
          .required("Weight is required")
          .min(0, "Weight must be at least 0")
          .max(100, "Weight cannot exceed 100"),
        isHidden: Yup.boolean(),
      })
    )
    .min(1, "At least one testcase is required"),
  // .test('total-weight', 'Total weight of all testcases must equal 100', function (testcases) {
  //     if (!testcases) return false;
  //     const totalWeight = testcases.reduce((sum, testcase) => sum + Number(testcase.weight), 0);
  //     return totalWeight === 100;
  // }),
});

// Simple fallback editor when Monaco fails to load
const FallbackEditor = ({
  value,
  onChange,
  placeholder = "# Enter your code here",
}) => {
  return (
    <div className="h-[30vh] w-full relative border rounded bg-white">
      <textarea
        value={value || ""}
        onChange={(e) => onChange && onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-full p-4 border-0 rounded font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
        style={{
          fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
          fontSize: "14px",
          lineHeight: "1.5",
          tabSize: 4,
          backgroundColor: "#ffffff",
          color: "#1f2937",
          border: "none",
        }}
      />
    </div>
  );
};

FallbackEditor.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};

// Enhanced Monaco Editor with fallback
const EditorWithFallback = ({
  language,
  value,
  onChange,
  placeholder = "# Enter your code here",
}) => {
  const [useFallback, setUseFallback] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleEditorDidMount = () => {
    console.log("Monaco Editor mounted successfully for language:", language);
    setIsLoading(false);
  };

  const handleBeforeMount = (monaco) => {
    console.log("Monaco beforeMount for language:", language);
    // Configure Monaco for better performance
    monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true);
  };

  // Fallback after timeout
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoading) {
        console.warn(
          "Monaco Editor timeout, using fallback for language:",
          language
        );
        setUseFallback(true);
        setIsLoading(false);
      }
    }, 3000); // Reduce timeout to 3 seconds
    return () => clearTimeout(timer);
  }, [isLoading, language]);

  if (useFallback) {
    return (
      <FallbackEditor
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    );
  }

  return (
    <div className="h-[30vh] w-full relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white border rounded z-10 shadow-sm">
          <div className="text-gray-600 text-center">
            <div className="mb-2">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            </div>
            <div>Loading Monaco Editor...</div>
            <div className="text-xs text-gray-500 mt-1">
              Language: {language || "python"}
            </div>
            <button
              className="mt-2 text-sm text-blue-600 hover:text-blue-800 underline"
              onClick={() => setUseFallback(true)}
            >
              Use simple editor instead
            </button>
          </div>
        </div>
      )}
      <Editor
        height="100%"
        width="100%"
        language={language || "python"}
        value={value || ""}
        defaultValue={placeholder}
        theme="vs-light"
        onMount={handleEditorDidMount}
        beforeMount={handleBeforeMount}
        onChange={onChange}
        options={{
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: 14,
          lineNumbers: "on",
          automaticLayout: true,
          wordWrap: "on",
          folding: true,
          contextmenu: true,
          selectOnLineNumbers: true,
          roundedSelection: false,
          readOnly: false,
          cursorStyle: "line",
          glyphMargin: true,
          useTabStops: false,
          lineNumbersMinChars: 3,
        }}
        loading={
          <div className="flex items-center justify-center h-full bg-white">
            <div className="text-gray-500">Initializing Editor...</div>
          </div>
        }
      />
    </div>
  );
};

EditorWithFallback.propTypes = {
  language: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};

const Programming = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showNotice } = useNotification();
  const { courseId, moduleId } = useParams();

  //const [htmlContent, setHtmlContent] = useState('');
  //const [previewMode, setPreviewMode] = useState(false);
  const [problemData, setProblemData] = useState({
    title: "",
    description: "",
    type: "programming",
    contentType: "Programming Assignment",
    icon: "code",
    isGrade: false,
    problemName: "",
    content: "",
    difficulty: "Easy",
    tags: [],
    constraints: "",
    inputFormat: "",
    outputFormat: "",
    codeFormat: [
      {
        language: "python",
        codeDefault: "",
        codeExecute: "",
      },
    ],
    sampleInput: "",
    sampleOutput: "",
    explanation: "",
    editorial: "",
    baseScore: 100,
    timeBonus: 0,
    memoryBonus: 0,
    testcases: [
      {
        input: "",
        expectedOutput: "",
        executeTimeLimit: 1000,
        isHidden: false,
        weight: 1,
      },
    ],
  });

  const editor = useRef(null);
  const [editorContent, setEditorContent] = useState("");
  // Cấu hình Jodit
  const config = {
    readonly: false, // Cho phép chỉnh sửa
    placeholder: "Enter your description...",
    height: 300,
    minHeight: 200,
    maxHeight: 600,
    // Các nút trong thanh công cụ
    buttons: [
      "bold",
      "italic",
      "underline",
      "strikethrough",
      "|",
      "font",
      "fontsize",
      "brush",
      "paragraph",
      "|",
      "image",
      "link",
      "|",
      "align",
      "list",
      "indent",
      "outdent",
      "|",
      "hr",
      "copyformat",
      "|",
      "undo",
      "redo",
      "|",
      "fullsize",
      "preview",
      "print",
      "|",
      "source", // Nút xem mã HTML
    ],
    // Cấu hình ngôn ngữ
    language: "vi",

    // Tùy chọn xuất HTML
    defaultMode: 1, // Chế độ WYSIWYG
    beautyHTML: true,

    // Cấu hình upload hình ảnh (nếu cần)
    uploader: {
      url: "/upload", // Điều chỉnh đường dẫn upload
      insertImageAsBase64URI: true,
    },
  };

  const [newTag, setNewTag] = useState("");

  // Handle basic problem info changes
  const handleProblemChange = (field) => (event) => {
    const updatedProblemData = {
      ...problemData,
      [field]: event.target.value,
    };
    setProblemData(updatedProblemData);
  };
  const handleEditorChange = (newContent) => {
    // Log để kiểm tra
    console.log("Current content:", newContent);

    setEditorContent((prevContent) => {
      // Nếu nội dung mới trống, giữ nội dung cũ
      if (!newContent && prevContent) {
        return prevContent;
      }
      return newContent;
    });

    // Cập nhật problemData
    setProblemData((prevData) => ({
      ...prevData,
      content: newContent || prevData.content,
    }));
  };
  // Handle tags
  const handleAddTag = () => {
    if (newTag && !problemData.tags.includes(newTag)) {
      const updatedTags = [...problemData.tags, newTag];
      setProblemData({
        ...problemData,
        tags: updatedTags,
      });
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    const updatedTags = problemData.tags.filter((tag) => tag !== tagToRemove);
    setProblemData({
      ...problemData,
      tags: updatedTags,
    });
  };

  // Handle testcases
  const addTestcase = () => {
    setProblemData({
      ...problemData,
      testcases: [
        ...problemData.testcases,
        {
          input: "",
          expectedOutput: "",
          executeTimeLimit: 1000,
          isHidden: false,
          weight: 1,
        },
      ],
    });
  };
  const addCode = () => {
    setProblemData({
      ...problemData,
      codeFormat: [
        ...problemData.codeFormat,
        {
          language: "python",
          codeDefault: "",
          codeExecute: "",
        },
      ],
    });
  };

  const removeTestcase = (index) => {
    const updatedTestcases = problemData.testcases.filter(
      (_, i) => i !== index
    );
    setProblemData({
      ...problemData,
      testcases: updatedTestcases,
    });
  };

  const removeCode = (index) => {
    const updatedCode = problemData.codeFormat.filter((_, i) => i !== index);
    setProblemData({
      ...problemData,
      codeFormat: updatedCode,
    });
  };
  const [selectedLanguage, setSelectedLanguage] = useState("python");

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
    console.log("Language changed to:", language);
  };

  // Thêm function để handle language change cho từng code block
  const handleCodeLanguageChange = (index, language) => {
    setProblemData((prevData) => ({
      ...prevData,
      codeFormat: prevData.codeFormat.map((format, i) =>
        i === index ? { ...format, language: language } : format
      ),
    }));
    console.log("Code block", index, "language changed to:", language);
  };

  const handleCodeDefaultChange = (index, newValue, language) => {
    setProblemData((prevData) => ({
      ...prevData,
      codeFormat: prevData.codeFormat.map((format, i) =>
        i === index
          ? { ...format, codeDefault: newValue, language: language || "python" }
          : format
      ),
    }));
  };
  const handleCodeExecuteChange = (index, newValue, language) => {
    setProblemData((prevData) => ({
      ...prevData,
      codeFormat: prevData.codeFormat.map((format, i) =>
        i === index
          ? { ...format, codeExecute: newValue, language: language || "python" }
          : format
      ),
    }));
  };

  const handleTestcaseChange = (index, field) => (event) => {
    const value =
      field === "isHidden" ? event.target.checked : event.target.value;
    const updatedTestcases = problemData.testcases.map((testcase, i) => {
      if (i === index) {
        return { ...testcase, [field]: value };
      }
      return testcase;
    });

    setProblemData({
      ...problemData,
      testcases: updatedTestcases,
    });
  };

  const handleGradeChange = (event) => {
    setProblemData({ ...problemData, isGrade: event.target.checked });
  };
  const handleSubmit = async () => {
    try {
      // Validate the problemData object
      await programProblemSchema.validate(problemData, { abortEarly: false });
      dispatch(
        createModuleItemProgramming({
          courseId,
          moduleId,
          formData: problemData,
        })
      );
      // Submit programming problem
      dispatch(toggleRefresh());
      showNotice("success", "Successfully created programming problem");
      navigate(`/course-management/${courseId}/module/${moduleId}`);
      console.log("Programming problem data:", problemData);
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        // Display validation errors
        error.inner.forEach((validationError) => {
          showNotice("error", validationError.message);
        });
        console.error("Validation errors:", error.errors);
      } else {
        console.error("Error submitting programming problem:", error);
      }
    }
  };
  return (
    <div className="space-y-6">
      {/* Basic Problem Information */}
      <Card className="p-4">
        <CardContent>
          <Typography variant="h6" sx={{ marginBottom: "2rem" }}>
            Module Item
          </Typography>

          <div className="space-y-4">
            <TextField
              fullWidth
              label="Title"
              value={problemData.title}
              onChange={handleProblemChange("title")}
              helperText="Enter a descriptive title for this programming assignment."
            />
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Description"
              value={problemData.description}
              onChange={handleProblemChange("description")}
              helperText="Describe the assignment for students."
            />
          </div>
        </CardContent>
      </Card>
      <Card className="p-4">
        <CardContent>
          <div className="flex justify-between">
            <Typography variant="h6" sx={{ marginBottom: "2rem" }}>
              Problem Information
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={problemData.isGrade}
                  onChange={handleGradeChange}
                />
              }
              label="Grade"
            />
          </div>

          <div className="space-y-4">
            <TextField
              fullWidth
              label="Problem Name"
              value={problemData.problemName}
              onChange={handleProblemChange("problemName")}
              helperText="Unique identifier for the problem."
            />
            <div className="py-4 ">
              <JoditEditor
                ref={editor}
                value={editorContent}
                config={config}
                onBlur={(newContent) => handleEditorChange(newContent)}
                onChange={() => {}}
              />
            </div>
            {/* <TextField
                                    fullWidth
                                    multiline
                                    rows={4}
                                    label="Description"
                                    value={problemData.content}
                                    onChange={handleProblemChange('content')}
                                /> */}

            <FormControl fullWidth>
              <InputLabel>Difficulty</InputLabel>
              <Select
                value={problemData.difficulty}
                label="Difficulty"
                onChange={handleProblemChange("difficulty")}
              >
                <MenuItem value="Easy">Easy</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="Hard">Hard</MenuItem>
              </Select>
            </FormControl>

            {/* Tags */}
            <div>
              <div className="flex gap-2 mb-2">
                <TextField
                  label="Add Tag"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  size="small"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === ",") {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  helperText="Press Enter or comma to add tag."
                />
                <Button onClick={handleAddTag} variant="outlined" size="small">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {problemData.tags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    onDelete={() => handleRemoveTag(tag)}
                    color="primary"
                  />
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Problem Details */}
      <Card className="p-4">
        <CardContent>
          <Typography variant="h6" sx={{ marginBottom: "2rem" }}>
            Problem Details
          </Typography>
          <div className="space-y-4">
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Constraints"
              value={problemData.constraints}
              onChange={handleProblemChange("constraints")}
              helperText="Specify the constraints for the problem."
            />
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Input Format"
              value={problemData.inputFormat}
              onChange={handleProblemChange("inputFormat")}
              helperText="Describe the input format."
            />
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Output Format"
              value={problemData.outputFormat}
              onChange={handleProblemChange("outputFormat")}
              helperText="Describe the output format."
            />

            <div className="grid grid-cols-2 gap-4">
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Sample Input"
                value={problemData.sampleInput}
                onChange={handleProblemChange("sampleInput")}
                helperText="Provide a sample input."
              />
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Sample Output"
                value={problemData.sampleOutput}
                onChange={handleProblemChange("sampleOutput")}
                helperText="Provide the expected output for the sample input."
              />
            </div>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Explanation"
              value={problemData.explanation}
              onChange={handleProblemChange("explanation")}
              helperText="Explain the solution or sample."
            />
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Editorial (optional)"
              value={problemData.editorial}
              onChange={handleProblemChange("editorial")}
              helperText="Provide an editorial or hints for the problem."
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <Typography variant="h6">Sample Code</Typography>
            <Button
              startIcon={<AddIcon />}
              onClick={addCode}
              variant="outlined"
            >
              Add Code
            </Button>
          </div>

          {problemData.codeFormat.map((code, index) => (
            <div key={index} className="mb-6 p-4 border rounded bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <LanguageSelector
                  setLanguage={code.language || selectedLanguage}
                  onLanguageChange={(language) => {
                    handleLanguageChange(language);
                    handleCodeLanguageChange(index, language);
                  }}
                />

                <Typography variant="subtitle1">Code {index + 1}</Typography>
                <IconButton
                  onClick={() => removeCode(index)}
                  disabled={problemData.codeFormat.length === 1}
                >
                  <DeleteIcon />
                </IconButton>
              </div>
              <div className="flex flex-col gap-2">
                <Typography fontWeight={500}>
                  Default Code (shown to students)
                </Typography>
                <EditorWithFallback
                  language={code.language || selectedLanguage}
                  value={code.codeDefault || ""}
                  onChange={(newValue) =>
                    handleCodeDefaultChange(
                      index,
                      newValue,
                      code.language || selectedLanguage
                    )
                  }
                />
                <Divider sx={{ my: 2 }} />
                <Typography fontWeight={500}>
                  Judge Code (used for evaluation)
                </Typography>
                <EditorWithFallback
                  language={code.language || selectedLanguage}
                  value={code.codeExecute || ""}
                  onChange={(newValue) =>
                    handleCodeExecuteChange(
                      index,
                      newValue,
                      code.language || selectedLanguage
                    )
                  }
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Scoring */}
      <Card className="p-4">
        <CardContent>
          <Typography variant="h6" sx={{ marginBottom: "2rem" }}>
            Scoring Configuration
          </Typography>
          <div className="grid grid-cols-3 gap-4">
            <TextField
              type="number"
              label="Base Score"
              value={problemData.baseScore}
              onChange={handleProblemChange("baseScore")}
              helperText="Base score for solving the problem."
            />
            <TextField
              type="number"
              label="Time Bonus"
              value={problemData.timeBonus}
              onChange={handleProblemChange("timeBonus")}
              helperText="Bonus for fast solutions."
            />
            <TextField
              type="number"
              label="Memory Bonus"
              value={problemData.memoryBonus}
              onChange={handleProblemChange("memoryBonus")}
              helperText="Bonus for memory-efficient solutions."
            />
          </div>
        </CardContent>
      </Card>

      {/* Testcases */}
      <Card className="p-4">
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <Typography variant="h6">Testcases</Typography>
            <Button
              startIcon={<AddIcon />}
              onClick={addTestcase}
              variant="outlined"
            >
              Add Testcase
            </Button>
          </div>

          {problemData.testcases.map((testcase, index) => (
            <div key={index} className="mb-6 p-4 border rounded bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <Typography variant="subtitle1">
                  Testcase {index + 1}
                </Typography>
                <IconButton
                  onClick={() => removeTestcase(index)}
                  disabled={problemData.testcases.length === 1}
                >
                  <DeleteIcon />
                </IconButton>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Input"
                    value={testcase.input}
                    onChange={handleTestcaseChange(index, "input")}
                    helperText="Input for this testcase."
                  />
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Expected Output"
                    value={testcase.expectedOutput}
                    onChange={handleTestcaseChange(index, "expectedOutput")}
                    helperText="Expected output for this testcase."
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <TextField
                    type="number"
                    label="Time Limit (ms)"
                    value={testcase.executeTimeLimit}
                    onChange={handleTestcaseChange(index, "executeTimeLimit")}
                    helperText="Execution time limit in milliseconds."
                  />
                  <TextField
                    type="number"
                    label="Weight"
                    value={testcase.weight}
                    onChange={handleTestcaseChange(index, "weight")}
                    helperText="Weight for this testcase (0-100)."
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={testcase.isHidden}
                        onChange={handleTestcaseChange(index, "isHidden")}
                      />
                    }
                    label="Hidden Testcase"
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Create Programming Problem
        </Button>
      </div>
    </div>
  );
};

export default Programming;
