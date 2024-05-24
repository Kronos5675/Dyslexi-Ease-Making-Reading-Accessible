# DyslexiEase
## Overview
Dyslexi-Ease is an innovative web application designed to convert standard documents into dyslexia-friendly formats. This project harnesses advanced text processing techniques to enhance the readability of documents, making them more accessible to individuals with dyslexia. Dyslexia affects approximately 15% of the global population, posing challenges in reading and understanding large amounts of text. Dyslexi-Ease aims to alleviate these challenges by automatically formatting documents in a way that is easier for dyslexic readers to comprehend.

## Features
- Text Extraction: Utilizes optical character recognition (OCR) to accurately extract text from PDF documents.
- Text Summarization: Employs the BART model to generate concise and informative summaries of extracted text, providing a quicker way to grasp the document's content.
- Dyslexia-Friendly Formatting: Applies guidelines from renowned organizations to adjust text formatting, including font changes to sans-serif, increased line spacing, and restructuring paragraphs for better readability.
- User-Friendly Interface: Provides a modern, sleek, and accessible user interface for uploading documents and downloading converted versions.

## How It Works
### Text Extraction
The application uses pdfplumber to extract text from PDF files. This step involves scanning each page of the PDF and extracting readable text, which is then processed for formatting or summarization.

### Text Summarization
For documents requiring summarization, Dyslexi-Ease leverages the BART (Bidirectional and Auto-Regressive Transformers) model. This model is fine-tuned to generate summaries that capture the essence of the original text while maintaining coherence and readability. The summarization process involves:

- Tokenizing the input text using BART's tokenizer.
- Feeding the tokens into the BART model to generate a summarized version.
- Decoding the summary back into human-readable text.

### Dyslexia-Friendly Formatting
#### Font Replacement
Changes fonts to sans-serif options like Arial or Verdana, which are easier to read for dyslexic individuals.
#### Increased Line Spacing
Adds extra space between lines to reduce visual crowding.
#### Paragraph Structuring
Ensures that text is structured into manageable chunks with clear headings, making it easier to navigate.
### User Interface
The front-end, built with React, allows users to easily upload PDF files and choose between 'Pro Conversion' (with summarization) and 'Standard Conversion' (without summarization). The interface includes a sleek, modern file uploader tile, buttons for conversion options, and a progress bar to indicate the status of the conversion process.

## Why It Is Needed
Dyslexia is a common learning disability that affects a significant portion of the population. Traditional documents, especially those in PDF format, are often not designed with dyslexic readers in mind. This can make reading a strenuous and time-consuming task for individuals with dyslexia. Dyslexi-Ease addresses this need by providing an automated solution to convert documents into a more readable format, thus improving accessibility and making information more readily available to everyone.
