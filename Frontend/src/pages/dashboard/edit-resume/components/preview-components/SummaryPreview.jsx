import React from 'react'

// Utility function to convert markdown bold to HTML
const convertMarkdownToHTML = (text) => {
  if (!text) return '';
  return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
};

function SummeryPreview({resumeInfo}) {
  const htmlContent = convertMarkdownToHTML(resumeInfo?.summary);

  return (
    <p
      className='text-xs'
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  )
}

export default SummeryPreview