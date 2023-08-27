import React, { useState } from 'react';
import axios from 'axios';
import Dropzone from 'react-dropzone';
import { TailSpin } from 'react-loader-spinner';

const VideoUploader = () => {
  const [uploadedUrls, setUploadedUrls] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedVideos, setSelectedVideos] = useState([]);

  const onDrop = async (acceptedFiles) => {
    const formData = new FormData();
    acceptedFiles.forEach((file) => {
      formData.append('videos', file);
    });
    setSelectedVideos([...selectedVideos, ...acceptedFiles]);
  }
  
  const removeVideo = (file) => {
    const updatedSelectedVideos = selectedVideos.filter((video) => video !== file);
    setSelectedVideos(updatedSelectedVideos);
  };
  
  const handleUpload = async () => {
    setIsLoading(true);

    const formData = new FormData();
    selectedVideos.forEach((video) => {
      formData.append('videos', video);
    });
    try {
        const response = await axios.post('http://45.76.155.253:3001/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
  
        setUploadedUrls(response.data.uploadedUrls);
      } catch (error) {
        console.error('Error uploading videos:', error);
      } finally {
          setIsLoading(false);
        }

    
    };

    return (
        <div className="main-content">
          <h2>Upload Videos</h2>
          <Dropzone onDrop={onDrop}>
            {({ getRootProps, getInputProps }) => (
              <div {...getRootProps()} className="dropzone">
                <input {...getInputProps()} />
                <p>Drag and drop video files here, or click to select files</p>
              </div>
            )}
          </Dropzone>
          {selectedVideos.length > 0 && (
            <div className="selected-videos">
              <h3>Selected Videos:</h3>
              <ul>
                {selectedVideos.map((video, index) => (
                  <li key={index}>
                    {video.name} <button onClick={() => removeVideo(video)}>Remove</button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <button className="upload-button" onClick={handleUpload} disabled={isLoading || selectedVideos.length === 0}>
            Upload Videos
          </button>
      {isLoading && (
        <div className="loader">
          <TailSpin color="#00BFFF" height={40} width={40} />
          <p>Uploading videos... Please wait.</p>
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
