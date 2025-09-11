import { useRef, useEffect, useState } from "react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Highlighter,
  Image,
} from "lucide-react";
import { uploadImage } from "../pages/CMS/actions";

const Editor = ({ name, value, error, onChange }) => {
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);
  const savedSelection = useRef(null);
  const [fontSize, setFontSize] = useState(16);
  const [activeFormats, setActiveFormats] = useState({ bold: false });

  const updateActiveFormats = () => {
    setActiveFormats({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      underline: document.queryCommandState("underline"),
      strike: document.queryCommandState("strikeThrough"),
    });
  };

  // Listen whenever selection changes
  useEffect(() => {
    document.addEventListener("selectionchange", updateActiveFormats);
    return () =>
      document.removeEventListener("selectionchange", updateActiveFormats);
  }, []);

  // Sync initial value with editor content
  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  const triggerChange = () => {
    if (editorRef.current) {
      onChange({
        target: { name, value: editorRef.current.innerHTML },
      });
    }
  };

  const handleInput = () => {
    triggerChange();
  };

  const executeCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current.focus();
    triggerChange();
  };

  // capitalize
  const handleCapitalize = () => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    const text = selection.toString();
    if (!text) return;

    const isUpper = text === text.toUpperCase();
    const newText = isUpper ? text.toLowerCase() : text.toUpperCase();

    executeCommand("insertText", newText);
    editorRef.current.focus();
  };

  // highlight
  const handleHighlight = () => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    const range = selection.getRangeAt(0);
    if (!range.toString()) return;

    const span = document.createElement("span");
    span.style.backgroundColor = "blue";
    span.style.color = "white";

    // Check if already highlighted
    if (
      range.commonAncestorContainer.parentNode &&
      range.commonAncestorContainer.parentNode.style?.backgroundColor ===
        "blue" &&
      range.commonAncestorContainer.parentNode.style?.color === "white"
    ) {
      // Remove highlight
      const parent = range.commonAncestorContainer.parentNode;
      parent.style.backgroundColor = "inherit";
    } else {
      // Apply highlight
      range.surroundContents(span);
    }
  };

  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel.rangeCount > 0) {
      savedSelection.current = sel.getRangeAt(0);
    }
  };

  const restoreSelection = () => {
    const sel = window.getSelection();
    if (savedSelection.current) {
      sel.removeAllRanges();
      sel.addRange(savedSelection.current);
    }
  };

  // Font size
  const handleFontSize = (e) => {
    restoreSelection(); // restore text selection
    const size = e.target.value;
    setFontSize(size);

    executeCommand("fontSize", 7);
    const editor = editorRef.current;
    editor.querySelectorAll("font[size='7']").forEach((el) => {
      el.removeAttribute("size");
      el.style.fontSize = `${size}px`;
    });
  };

  const handleHeading = (level) => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const parent = selection.anchorNode.parentNode;
    const isHeading = parent.nodeName === `H${level}`;

    if (isHeading) {
      // Convert back to paragraph
      executeCommand("formatBlock", "<p>");
    } else {
      // Apply heading
      executeCommand("formatBlock", `<h${level}>`);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file); // <-- send raw file, not base64
    formData.append("type", "0");

    if (file) {
      try {
        const result = await uploadImage(formData); // must return { url }

        const url = `https://detty.archyuniq.com/upload/upload/${result}`;
        const imgHtml = `<img src="${url}" alt="Uploaded image" class="max-w-96 h-auto" />`;

        executeCommand("insertHTML", imgHtml);
        triggerChange();
      } catch (error) {
        console.error("Image upload failed:", error);
      }
    }
  };

  return (
    <div className="rounded-lg overflow-hidden border border-white/10">
      {/* Toolbar */}
      <div className="p-2 bg-black flex flex-wrap items-center gap-2">
        {/* Text Formatting */}
        <button
          type="button"
          onClick={handleCapitalize}
          className="px-3 py-2 text-gray-300 hover:text-white rounded transition-colors text-sm font-medium underline cursor-pointer"
          title="Capitalize"
        >
          A
        </button>

        <button
          type="button"
          onClick={handleHighlight}
          className={`px-3 py-2 ${
            activeFormats.highlight
              ? "bg-gray-800/50 text-white"
              : "text-gray-300"
          } hover:text-white transition-colors text-sm font-medium cursor-pointer`}
          title="Highlight"
        >
          <Highlighter className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => executeCommand("bold")}
          className={`px-3 py-2 ${
            activeFormats.bold ? "bg-gray-800/50 text-white" : "text-gray-300"
          } hover:text-white transition-colors text-sm font-medium cursor-pointer`}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => executeCommand("italic")}
          className={`px-3 py-2 ${
            activeFormats.italic ? "bg-gray-800/50 text-white" : "text-gray-300"
          } hover:text-white transition-colors text-sm font-medium cursor-pointer`}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => executeCommand("underline")}
          className={`px-3 py-2 ${
            activeFormats.underline
              ? "bg-gray-800/50 text-white"
              : "text-gray-300"
          } hover:text-white transition-colors text-sm font-medium cursor-pointer`}
          title="Underline"
        >
          <Underline className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => executeCommand("strikeThrough")}
          className={`px-3 py-2 ${
            activeFormats.strike ? "bg-gray-800/50 text-white" : "text-gray-300"
          } hover:text-white transition-colors text-sm font-medium cursor-pointer`}
          title="Strikethrough"
        >
          <Strikethrough className="w-4 h-4" />
        </button>

        {/* Divider */}
        <div className="h-6 w-px bg-gray-400"></div>

        {/* Font Size */}
        <select
          value={fontSize}
          type="number"
          onChange={handleFontSize}
          className=" w-14 outline-none focus:outline-none focus:ring-[0.5px] focus:ring-white"
          title="Font Size"
        >
          <option value="12px">12px</option>
          <option value="16px">16px</option>
          <option value="20px">20px</option>
          <option value="24px">24px</option>
          <option value="32px">32px</option>
        </select>

        {/* Divider */}
        <div className="h-6 w-px bg-gray-400"></div>

        {/* Text Alignment */}
        <button
          type="button"
          onClick={() => executeCommand("justifyLeft")}
          className="px-3 py-2 text-gray-300 hover:text-white transition-colors text-sm font-medium cursor-pointer"
          title="Align Left"
        >
          <AlignLeft className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => executeCommand("justifyCenter")}
          className="px-3 py-2 text-gray-300 hover:text-white transition-colors text-sm font-medium cursor-pointer"
          title="Align Center"
        >
          <AlignCenter className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => executeCommand("justifyRight")}
          className="px-3 py-2 text-gray-300 hover:text-white transition-colors text-sm font-medium cursor-pointer"
          title="Align Right"
        >
          <AlignRight className="w-4 h-4" />
        </button>

        {/* Divider */}
        <div className="h-6 w-px bg-gray-400 mx-2"></div>

        {/* Headings */}
        {[1, 2, 3, 4, 5].map((level) => (
          <button
            type="button"
            key={level}
            onClick={() => handleHeading(level)}
            className="px-3 py-2 text-gray-300 hover:text-white transition-colors text-xs cursor-pointer"
            title={`Heading ${level}`}
          >
            H{level}
          </button>
        ))}

        {/* Divider */}
        <div className="h-full w-px bg-gray-400"></div>

        {/* Image Upload */}
        <button
          type="button"
          onClick={() => fileInputRef.current.click()}
          className=" text-gray-300 hover:text-white cursor-pointer transition-colors"
          title="Upload Image"
        >
          <Image className="w-4 h-4" />
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        onMouseUp={saveSelection}
        onKeyUp={saveSelection}
        contentEditable
        style={{ whiteSpace: "pre-wrap" }}
        className={`editor-content border min-h-96 p-4 outline-none w-full focus:text-white text-gray-400 rounded-b-lg  bg-[#131313] ${
          error ? "border-red-500 focus:ring-red-500" : ""
        }`}
        suppressContentEditableWarning={true}
        onInput={handleInput}
      />
    </div>
  );
};

export default Editor;
