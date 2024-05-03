import * as React from "react";

const DragDropFile = (props: any) => {
  // drag state
  const [dragActive, setDragActive] = React.useState(false);

  // ref
  const inputRef: any = React.useRef(null);

  // handle drag events
  const handleDrag = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // triggers when file is dropped
  const handleDrop = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files.length) {
      let file = e.dataTransfer.files;

      let _imgType: string = file[0].name.split(".")[1].toLowerCase();

      if (
        _imgType === "jpg" ||
        _imgType === "jpeg" ||
        _imgType === "png" ||
        _imgType === "svg" ||
        _imgType === "avif" ||
        _imgType === "gif" ||
        _imgType === "webp"
      ) {
        props.setNewVisitor({
          ...props.newVisitor,
          content: file,
        });
      }
    }
  };

  // triggers when file is selected with click
  const handleChange = (e: any) => {
    e.preventDefault();

    if (e.target.files.length) {
      let file = e.target.files;

      let _imgType: string = file[0].name.split(".")[1].toLowerCase();

      if (
        _imgType === "jpg" ||
        _imgType === "jpeg" ||
        _imgType === "png" ||
        _imgType === "svg" ||
        _imgType === "avif" ||
        _imgType === "gif" ||
        _imgType === "webp"
      ) {
        props.setNewVisitor({
          ...props.newVisitor,
          content: file,
        });
      }
    }
  };

  // triggers the input when the button is clicked
  const onButtonClick = () => {
    inputRef.current.click();
  };

  return (
    <form
      id="form-file-upload"
      onDragEnter={handleDrag}
      onSubmit={(e) => e.preventDefault()}
    >
      <input
        ref={inputRef}
        type="file"
        id="input-file-upload"
        multiple={false}
        onChange={handleChange}
        accept="image/*"
      />
      <label
        id="label-file-upload"
        htmlFor="input-file-upload"
        className={dragActive ? "drag-active" : ""}
      >
        <div>
          <p>Drag and drop your file here or</p>
          <button className="upload-button" onClick={onButtonClick}>
            Upload a file
          </button>
        </div>
      </label>
      {dragActive && (
        <div
          id="drag-file-element"
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        ></div>
      )}
    </form>
  );
};

export default DragDropFile;
