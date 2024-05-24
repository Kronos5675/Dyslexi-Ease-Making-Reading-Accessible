import React, { useState } from 'react';
import axios from 'axios';
import { Button, Typography, Box, CircularProgress } from '@mui/material';
import { CloudUploadOutlined as CloudUploadIcon } from '@mui/icons-material';

import backgroundImage from './sketches-gradient-doodle-logo-wallpaper-preview.png'; // Import the background image
import './fonts.css'; // Import the CSS file for the font

const App = () => {
    const [pdfFile, setPdfFile] = useState(null);
    const [showButtons, setShowButtons] = useState(false);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [fileName, setFileName] = useState('');

    const handleFileChange = (e) => {
        setPdfFile(e.target.files[0]);
        setFileName(e.target.files[0].name);
        setShowButtons(true);
    };

    const handleConversion = (applySummarization) => {
        if (!pdfFile) {
            alert('Please select a PDF file.');
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append('pdf_file', pdfFile);
        formData.append('apply_summarization', applySummarization);

        axios.post('http://localhost:5000/process_pdf', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            responseType: 'blob',
            onUploadProgress: (progressEvent) => {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setProgress(percentCompleted);
            },
        }).then((response) => {
            setLoading(false);
            setProgress(0);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'formatted_pdf.pdf');
            document.body.appendChild(link);
            link.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(link);
            setShowButtons(true); // Revert back to showing upload buttons
            resetFile(); // Reset the file state
        }).catch((error) => {
            setLoading(false);
            setProgress(0);
            console.error('Error processing PDF:', error);
        });
    };

    const resetFile = () => {
        setPdfFile(null);
        setFileName('');
    };

    return (
        <div
            style={{
                backgroundImage: `url(${backgroundImage})`, // Set the background image
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                height: '100vh',
                justifyContent: 'center',
            }}
        >
            <Typography variant="h1" style={{ color: 'white', marginBottom: '30px', fontFamily: 'OpenDyslexic' }}>Dyslexi-Ease</Typography>
            <Typography variant="h2" style={{ color: 'white', marginBottom: '30px', fontFamily: 'OpenDyslexic' }}>Making Reading Accessible</Typography>
            {loading ? (
                <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', padding: '20px', maxWidth: '400px', width: '100%' }}>
                    <CircularProgress style={{ marginBottom: '20px' }} value={progress} />
                    <Typography variant="body1" style={{ fontFamily: 'OpenDyslexic' }}>Please Wait,While we work on your document</Typography>
                </Box>
            ) : (
                <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', padding: '20px', maxWidth: '400px', width: '100%' }}>
                    <input
                        type="file"
                        accept=".pdf"
                        style={{ display: 'none' }}
                        id="pdf-file"
                        onChange={handleFileChange}
                    />
                    <label htmlFor="pdf-file">
                        <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column" style={{ cursor: 'pointer' }}>
                            <CloudUploadIcon style={{ fontSize: 60, color: 'teal' }} />
                            <Typography variant="h6" style={{ marginTop: '10px', color: '#000000', fontFamily: 'OpenDyslexic' }}>Upload PDF File</Typography>
                        </Box>
                    </label>
                    {fileName && (
                        <Typography variant="subtitle1" gutterBottom style={{ marginTop: '10px', fontFamily: 'OpenDyslexic' }}>
                            File Uploaded: {fileName}
                        </Typography>
                    )}
                    {showButtons && (
                        <Box style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handleConversion(true)}
                                size="large"
                                style={{ marginTop: '10px', marginRight: '10px', width: '200px' }}
                            >
                                <Typography variant="button" style={{ fontFamily: 'OpenDyslexic' }}>Pro Conversion</Typography>
                            </Button>
                            <Button
                                variant="contained"
                                color="success"
                                onClick={() => handleConversion(false)}
                                size="large"
                                style={{ marginTop: '10px', width: '200px' }}
                            >
                                <Typography variant="button" style={{ fontFamily: 'OpenDyslexic' }}>Standard Conversion</Typography>
                            </Button>
                        </Box>
                    )}
                </Box>
            )}
        </div>
    );
};

export default App;
