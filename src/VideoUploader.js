import React, { useState } from 'react';
import axios from 'axios';
import Dropzone from 'react-dropzone';
import { TailSpin } from 'react-loader-spinner';

const VideoUploader = () => {
  const [uploadedUrls, setUploadedUrls] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [videoQueue, setVideoQueue] = useState([]);
  const [errorAlert, setErrorAlert] = useState(null);

  const onDrop = (acceptedFiles) => {
    setVideoQueue([...videoQueue, ...acceptedFiles]);
  };

  const removeVideoFromQueue = (index) => {
    const updatedQueue = [...videoQueue];
    updatedQueue.splice(index, 1);
    setVideoQueue(updatedQueue);
  };

  const handleUploadQueue = async () => {
    setIsLoading(true);
    setErrorAlert(null);

    setUploadedUrls([]);
  
    const updatedQueue = [...videoQueue];
    const uploadedUrlsArray = [];
    const failedVideos = []; // Store names of failed videos
  
    while (updatedQueue.length > 0) {
      const currentVideo = updatedQueue.shift();
      const formData = new FormData();
      formData.append('video', currentVideo);
  
      try {
        const response = await axios.post('http://localhost:3001/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
  
        uploadedUrlsArray.push(response.data.uploadedUrl);
      } catch (error) {
        console.error(`Error uploading video ${currentVideo.name}:`, error);
        failedVideos.push(currentVideo.name); // Add failed video name to the array
      }
    }
  
    setUploadedUrls([...uploadedUrls, ...uploadedUrlsArray]);
    setIsLoading(false);
    setVideoQueue([]);
  
    if (failedVideos.length > 0) {
      setErrorAlert(`Failed to upload the following video(s): ${failedVideos.join(', ')}`);
    }
  };

  return (
    <div className="main-content">
      <h2>Upload Videos</h2>
      <Dropzone onDrop={onDrop} accept="video/*" multiple>
        {({ getRootProps, getInputProps }) => (
          <div {...getRootProps()} className="dropzone">
            <input {...getInputProps()} />
            <p>Drag and drop video files here, or click to select files</p>
          </div>
        )}
      </Dropzone>
      {videoQueue.length > 0 && (
        <div className="selected-videos">
          <h3>Selected Videos:</h3>
          <ul>
            {videoQueue.map((video, index) => (
              <li key={index}>
                {video.name}{' '}
                <button className="remove-button" onClick={() => removeVideoFromQueue(index)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <button
            className="upload-button custom-upload-button"
            onClick={handleUploadQueue}
            disabled={isLoading || videoQueue.length === 0}
          >
            Upload Videos
          </button>
        </div>
      )}
      {isLoading && (
        <div className="loader">
          <TailSpin color="#00BFFF" height={40} width={40} />
          <p>Uploading videos... Please wait.</p>
        </div>
      )}
      {errorAlert && (
        <div className="error-alert">
          {errorAlert}
        </div>
      )}
      {uploadedUrls.length > 0 && (
        <div className="uploaded-urls">
          <h3>Uploaded URLs:</h3>
          <ul>
            {uploadedUrls.map((url, index) => (
              <li key={index}>
                <a href={url} target="_blank" rel="noopener noreferrer">
                  {url}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default VideoUploader;
