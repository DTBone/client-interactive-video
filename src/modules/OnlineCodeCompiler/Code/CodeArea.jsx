import MonacoEditor from "@monaco-editor/react";
import { useCode } from "../CodeContext";
import { useEffect, useState, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import { debounce } from "lodash";
import axiosInstance from "~/Config/axiosInstance";

const CodeArea = () => {
  const { userLang, setUserCode, userInput, userOutput } = useCode();
  const { problem } = useSelector((state) => state.compile);

  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const ghostTextDecorationsRef = useRef([]);
  const completionProviderRef = useRef(null);
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState("// Enter Your Code Here...");
  const isFetchingRef = useRef(false); // Track if a fetch is already in progress

  // Update language when userLang changes
  useEffect(() => {
    setLanguage(userLang || "python");
  }, [userLang]);

  // Update code when problem or language changes
  useEffect(() => {
    if (problem?.codeFormat && problem.codeFormat.length > 0) {
      const matchedFormat = problem.codeFormat.find(
        (format) => format.language === userLang
      );
      setCode(
        matchedFormat ? matchedFormat.codeDefault : "// Enter Your Code Here..."
      );
    } else {
      setCode("// Enter Your Code Here...");
    }
  }, [problem, userLang]);

  // Save user input/output to localStorage
  useEffect(() => {
    localStorage.setItem("userInput", userInput);
    localStorage.setItem("userOutput", userOutput);
  }, [userInput, userOutput]);

  // Create a fetchCompletions function that also handles ghost text
  const createFetchCompletions = useCallback(
    (monacoInstance, editor) => {
      return debounce(async (model, position) => {
        if (isFetchingRef.current) {
          console.log("Previous completion request in progress, skipping...");
          return [];
        }

        isFetchingRef.current = true;
        console.log("Fetching completions for position:", position);

        const entireCode = model.getValue();
        const textUntilPosition = model.getValueInRange({
          startLineNumber: 1,
          startColumn: 1,
          endLineNumber: position.lineNumber,
          endColumn: position.column,
        });

        const textAfterPosition = model.getValueInRange({
          startLineNumber: position.lineNumber,
          startColumn: position.column,
          endLineNumber: model.getLineCount(),
          endColumn: model.getLineMaxColumn(model.getLineCount()),
        });

        const currentLine = model.getLineContent(position.lineNumber);
        const contextLineCount = 5;
        const startLineForContext = Math.max(
          1,
          position.lineNumber - contextLineCount
        );
        const lineContext = [];

        for (let i = startLineForContext; i <= position.lineNumber; i++) {
          lineContext.push(model.getLineContent(i));
        }

        try {
          // Add a timeout to prevent hanging requests
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

          const response = await axiosInstance.post(
            "/problem/code-completion",
            {
              fullCode: entireCode,
              codeBeforeCursor: textUntilPosition,
              codeAfterCursor: textAfterPosition,
              currentLine: currentLine,
              lineContext: lineContext.join("\n"),
              cursorPosition: {
                lineNumber: position.lineNumber,
                column: position.column,
              },
              language,
            },
            {
              signal: controller.signal,
              timeout: 10000,
            }
          );

          clearTimeout(timeoutId);

          // Log the full response to understand the structure
          console.log("Full API response:", response);
          console.log("Response data:", response.data);
          console.log("Response data type:", typeof response.data);

          // Handle different possible response structures
          let completionsData = null;

          if (response.data) {
            // First check if it's a direct string response (most likely case for GEMINI AI)
            if (
              typeof response.data === "string" &&
              response.data.trim().length > 0
            ) {
              console.log("Response data is a string - creating completion");
              completionsData = [{ text: response.data.trim() }];
            }
            // Check if response.data.data exists and is a string (API wrapper format)
            else if (
              response.data.data &&
              typeof response.data.data === "string"
            ) {
              console.log(
                "Response data.data is a string - creating completion"
              );
              completionsData = [{ text: response.data.data.trim() }];
            }
            // Check various possible array structures
            else if (Array.isArray(response.data)) {
              console.log("Response data is an array");
              completionsData = response.data;
            } else if (
              response.data.data &&
              Array.isArray(response.data.data)
            ) {
              console.log("Response data.data is an array");
              completionsData = response.data.data;
            } else if (
              response.data.suggestions &&
              Array.isArray(response.data.suggestions)
            ) {
              console.log("Response data.suggestions is an array");
              completionsData = response.data.suggestions;
            } else if (
              response.data.completions &&
              Array.isArray(response.data.completions)
            ) {
              console.log("Response data.completions is an array");
              completionsData = response.data.completions;
            } else if (
              response.data.choices &&
              Array.isArray(response.data.choices)
            ) {
              console.log("Response data.choices is an array");
              completionsData = response.data.choices;
            } else if (response.data.message || response.data.content) {
              console.log("Response has message/content field");
              // Handle single message/content response
              const textContent =
                response.data.message || response.data.content;
              if (
                typeof textContent === "string" &&
                textContent.trim().length > 0
              ) {
                completionsData = [{ text: textContent.trim() }];
              }
            } else if (response.data.success && response.data.data) {
              console.log("Response has success wrapper");
              // Handle wrapped response
              const innerData = response.data.data;
              if (Array.isArray(innerData)) {
                completionsData = innerData;
              } else if (
                typeof innerData === "string" &&
                innerData.trim().length > 0
              ) {
                completionsData = [{ text: innerData.trim() }];
              }
            } else {
              console.log(
                "Unknown response structure, extracting string values:",
                response.data
              );

              // Try to extract any string values from the object
              const extractStrings = (obj, path = "") => {
                const strings = [];
                for (const [key, value] of Object.entries(obj)) {
                  if (typeof value === "string" && value.trim().length > 0) {
                    strings.push({
                      text: value.trim(),
                      source: `${path}${key}`,
                    });
                  } else if (
                    typeof value === "object" &&
                    value !== null &&
                    !Array.isArray(value)
                  ) {
                    strings.push(...extractStrings(value, `${path}${key}.`));
                  }
                }
                return strings;
              };

              const extractedStrings = extractStrings(response.data);
              console.log("Extracted strings:", extractedStrings);

              if (extractedStrings.length > 0) {
                completionsData = extractedStrings;
              } else {
                console.log("No valid completion strings found");
                return [];
              }
            }
          }

          if (!completionsData || completionsData.length === 0) {
            console.log("No completions found in response");
            return [];
          }

          console.log("Completions data found:", completionsData);

          // Show ghost text for the first suggestion
          if (completionsData.length > 0 && editor) {
            const firstCompletion = completionsData[0];
            const completionText =
              firstCompletion.text ||
              firstCompletion.content ||
              firstCompletion.suggestion ||
              firstCompletion;
            if (
              typeof completionText === "string" &&
              completionText.trim().length > 0
            ) {
              showGhostText(editor, model, position, completionText.trim());
            }
          }

          // Map completions to Monaco format with flexible property access
          return completionsData
            .map((item, index) => {
              let completionText = "";
              let completionDetail = "AI Suggestion";

              if (typeof item === "string") {
                completionText = item.trim();
              } else if (typeof item === "object" && item !== null) {
                // Try different possible property names
                completionText = (
                  item.text ||
                  item.content ||
                  item.suggestion ||
                  item.completion ||
                  item.value ||
                  item.message ||
                  ""
                ).trim();
                completionDetail =
                  item.detail ||
                  item.description ||
                  item.source ||
                  "AI Suggestion";
              }

              // Only return completion if we have valid text
              if (!completionText || completionText.length === 0) {
                return null;
              }

              return {
                label:
                  completionText.split("\n")[0] +
                  (completionText.includes("\n") ? "..." : ""), // Show first line as label
                kind: monacoInstance.languages.CompletionItemKind.Snippet,
                insertText: completionText,
                detail: completionDetail,
                documentation: {
                  value: `Generated by GEMINI AI\n\nFull completion:\n${completionText}`,
                },
                sortText: `0${String(index).padStart(3, "0")}`, // Ensure AI suggestions appear at the top with proper ordering
              };
            })
            .filter((item) => item !== null); // Filter out null items
        } catch (error) {
          console.error("Error fetching completions:", error);
          console.error("Error details:", {
            message: error.message,
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            name: error.name,
          });

          // If it's a timeout or network error, show a helpful message
          if (error.name === "AbortError") {
            console.log("Request timed out after 10 seconds");
          } else if (error.code === "ECONNABORTED") {
            console.log("Connection timeout");
          }

          return [];
        } finally {
          isFetchingRef.current = false; // Reset the fetching state
        }
      }, 300); // Reduce debounce time for better responsiveness
    },
    [language]
  );

  // Function to show ghost text
  // This function displays a ghost text suggestion in the editor at the specified position.
  // It clears any previous ghost text decorations and applies a new decoration with the provided text.
  const showGhostText = useCallback((editor, model, position, text) => {
    if (!editor || !text || !monacoRef.current) return;

    // Clear previous ghost text decorations
    if (ghostTextDecorationsRef.current.length) {
      editor.deltaDecorations(ghostTextDecorationsRef.current, []);
      ghostTextDecorationsRef.current = [];
    }

    // Create ghost text decoration
    const ghostTextDecoration = {
      range: new monacoRef.current.Range(
        position.lineNumber,
        position.column,
        position.lineNumber,
        position.column
      ),
      options: {
        after: {
          content: text,
          inlineClassName: "ghost-text-suggestion",
        },
      },
    };

    // Apply the decoration
    ghostTextDecorationsRef.current = editor.deltaDecorations(
      [],
      [ghostTextDecoration]
    );

    console.log("Ghost text displayed:", text);
  }, []);

  // Function to accept ghost text suggestion
  // This function inserts the ghost text suggestion into the editor at the current cursor position.
  // It ensures the text is not duplicated and moves the cursor to the end of the inserted text.
  const acceptGhostTextSuggestion = useCallback(() => {
    if (!editorRef.current || ghostTextDecorationsRef.current.length === 0)
      return;

    const model = editorRef.current.getModel();
    if (!model || !monacoRef.current) return;

    const decorations = model.getDecorationOptions(
      ghostTextDecorationsRef.current[0]
    );
    if (!decorations || !decorations.after) return;

    const position = editorRef.current.getPosition();
    const text = decorations.after.content;

    // Check if the text is already present at the current position
    const existingText = model.getValueInRange({
      startLineNumber: position.lineNumber,
      startColumn: position.column,
      endLineNumber: position.lineNumber,
      endColumn: position.column + text.length,
    });

    if (existingText === text) {
      // If the text is already present, do not insert it again
      editorRef.current.deltaDecorations(ghostTextDecorationsRef.current, []);
      ghostTextDecorationsRef.current = [];
      return;
    }

    // Insert the ghost text at current position
    model.pushEditOperations(
      [],
      [
        {
          range: new monacoRef.current.Range(
            position.lineNumber,
            position.column,
            position.lineNumber,
            position.column
          ),
          text: text,
        },
      ],
      () => null
    );

    // Clear ghost text decoration
    editorRef.current.deltaDecorations(ghostTextDecorationsRef.current, []);
    ghostTextDecorationsRef.current = [];

    // Move the cursor to the end of the inserted text
    editorRef.current.setPosition({
      lineNumber: position.lineNumber,
      column: position.column + text.length,
    });

    console.log("Ghost text accepted:", text);
  }, []);

  // Set up completion provider when editor is mounted
  useEffect(() => {
    if (!editorRef.current || !monacoRef.current) {
      console.log("Editor or Monaco instance not ready");
      return;
    }

    console.log("Setting up completion provider for language:", language);
    const monacoInstance = monacoRef.current;
    const editor = editorRef.current;
    const fetchCompletions = createFetchCompletions(monacoInstance, editor);

    // Dispose previous completion provider if exists
    if (completionProviderRef.current) {
      completionProviderRef.current.dispose();
    }

    const disposable = monacoInstance.languages.registerCompletionItemProvider(
      language,
      {
        triggerCharacters: [".", " ", "\n", "(", "{", "[", ";", "=", "+", "-"],
        provideCompletionItems: async (model, position, context) => {
          console.log("Completion triggered:", { position, context });

          try {
            const suggestions = await fetchCompletions(model, position);
            console.log("Returning suggestions:", suggestions);

            return {
              suggestions: suggestions || [],
              incomplete: false,
            };
          } catch (error) {
            console.error("Error in provideCompletionItems:", error);
            return { suggestions: [] };
          }
        },
      }
    );

    completionProviderRef.current = disposable;

    // Listen for Tab key to accept ghost text suggestion
    const onKeyDown = editor.onKeyDown((e) => {
      if (
        e.keyCode === monacoInstance.KeyCode.Tab &&
        ghostTextDecorationsRef.current.length > 0
      ) {
        e.preventDefault();
        e.stopPropagation();
        acceptGhostTextSuggestion();
      }
    });

    return () => {
      disposable.dispose();
      onKeyDown.dispose();
      fetchCompletions.cancel();
      // Clear ghost text decorations
      if (ghostTextDecorationsRef.current.length) {
        editor.deltaDecorations(ghostTextDecorationsRef.current, []);
        ghostTextDecorationsRef.current = [];
      }
    };
  }, [language, createFetchCompletions, acceptGhostTextSuggestion]);

  const handleEditorDidMount = (editor, monacoInstance) => {
    // Save references to editor and monacoInstance
    editorRef.current = editor;
    monacoRef.current = monacoInstance;

    console.log("Editor mounted successfully");

    // Set up key events
    editor.onKeyUp((e) => {
      // If Escape key is pressed, clear ghost text
      if (
        e.keyCode === monacoInstance.KeyCode.Escape &&
        ghostTextDecorationsRef.current.length > 0
      ) {
        editor.deltaDecorations(ghostTextDecorationsRef.current, []);
        ghostTextDecorationsRef.current = [];
        console.log("Ghost text cleared via Escape key");
      }
    });

    // Add shortcut to trigger suggestions manually
    editor.addCommand(
      monacoInstance.KeyMod.CtrlCmd | monacoInstance.KeyCode.Space,
      () => {
        console.log("Manual completion trigger");
        editor.trigger("", "editor.action.triggerSuggest", {});
      }
    );

    // Add CSS for ghost text
    if (!document.querySelector("#ghost-text-styles")) {
      const style = document.createElement("style");
      style.id = "ghost-text-styles";
      style.innerHTML = `
        .ghost-text-suggestion {
          opacity: 0.6;
          color: #888888;
          font-style: italic;
        }
      `;
      document.head.appendChild(style);
    }
  };

  const editorOptions = {
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    fontSize: 16,
    lineNumbers: "on",
    automaticLayout: true,
    tabCompletion: "on",
    suggestOnTriggerCharacters: true,
    quickSuggestions: {
      other: true,
      comments: false,
      strings: false,
    },
    acceptSuggestionOnEnter: "on",
    wordBasedSuggestions: false, // Disable word-based suggestions to prioritize our AI suggestions
    suggest: {
      showMethods: true,
      showFunctions: true,
      showConstructors: true,
      showFields: true,
      showVariables: true,
      showClasses: true,
      showStructs: true,
      showInterfaces: true,
      showModules: true,
      showProperties: true,
      showEvents: true,
      showOperators: true,
      showUnits: true,
      showValues: true,
      showConstants: true,
      showEnums: true,
      showEnumMembers: true,
      showKeywords: true,
      showText: true,
      showColors: true,
      showFiles: true,
      showReferences: true,
      showCustomcolors: true,
      showFolders: true,
      showTypeParameters: true,
      showSnippets: true,
    },
  };

  return (
    <div className="h-full w-full">
      <MonacoEditor
        options={editorOptions}
        height="100%"
        width="100%"
        theme="vs-light"
        language={language}
        defaultLanguage="python"
        value={code}
        defaultValue="#Enter your code here..."
        onChange={(value) => setUserCode(value)}
        onMount={handleEditorDidMount}
      />
    </div>
  );
};

export default CodeArea;
