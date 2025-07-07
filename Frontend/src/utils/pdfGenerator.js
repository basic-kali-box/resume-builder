import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/**
 * Generate and download PDF from resume preview with proper multi-page handling
 * @param {Object} resumeData - Resume data object
 * @param {string} elementId - ID of the element to convert to PDF
 */
export const generateResumePDF = async (resumeData, elementId = 'resume-preview') => {
  try {
    // Get the resume preview element
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Resume preview element not found');
    }

    // Show loading state
    const originalCursor = document.body.style.cursor;
    document.body.style.cursor = 'wait';

    // Prepare element for PDF generation
    const { element: preparedElement, restore } = prepareElementForPDF(elementId);

    // Configure html2canvas options for high quality and proper page handling
    const canvas = await html2canvas(preparedElement, {
      scale: 2, // Higher resolution for crisp output
      useCORS: true,
      allowTaint: false,
      backgroundColor: '#ffffff',
      logging: false,
      width: preparedElement.scrollWidth,
      height: preparedElement.scrollHeight,
      scrollX: 0,
      scrollY: 0,
      windowWidth: preparedElement.scrollWidth,
      windowHeight: preparedElement.scrollHeight,
      onclone: (clonedDoc) => {
        // Ensure proper styling in cloned document
        const clonedElement = clonedDoc.getElementById(elementId);
        if (clonedElement) {
          clonedElement.style.transform = 'none';
          clonedElement.style.boxShadow = 'none';
          clonedElement.style.border = 'none';
          clonedElement.style.margin = '0';
          clonedElement.style.padding = '56px'; // Standard A4 margins (2cm = 56px at 72dpi)
        }
      }
    });

    // A4 dimensions in mm
    const A4_WIDTH = 210;
    const A4_HEIGHT = 297;
    const MARGIN = 20; // 20mm margins on all sides
    const CONTENT_WIDTH = A4_WIDTH - (MARGIN * 2);
    const CONTENT_HEIGHT = A4_HEIGHT - (MARGIN * 2);

    // Calculate scaling to fit content width
    const scale = CONTENT_WIDTH / (canvas.width / 2); // Divide by 2 because we use scale: 2
    const scaledHeight = (canvas.height / 2) * scale; // Divide by 2 because we use scale: 2

    // Create PDF with proper settings
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    // Convert canvas to image data
    const imgData = canvas.toDataURL('image/png', 1.0);

    // Calculate how many pages we need
    const totalPages = Math.ceil(scaledHeight / CONTENT_HEIGHT);

    // Add content to PDF with proper page breaks
    for (let pageIndex = 0; pageIndex < totalPages; pageIndex++) {
      if (pageIndex > 0) {
        pdf.addPage();
      }

      // Calculate the portion of the image for this page
      const sourceY = (pageIndex * CONTENT_HEIGHT) / scale * 2; // Multiply by 2 for scale
      const sourceHeight = Math.min(CONTENT_HEIGHT / scale * 2, canvas.height - sourceY);

      // Only add image if there's content for this page
      if (sourceHeight > 0) {
        // Create a temporary canvas for this page's content
        const pageCanvas = document.createElement('canvas');
        const pageCtx = pageCanvas.getContext('2d');

        pageCanvas.width = canvas.width;
        pageCanvas.height = sourceHeight;

        // Fill with white background
        pageCtx.fillStyle = '#ffffff';
        pageCtx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);

        // Draw the portion of the original canvas for this page
        pageCtx.drawImage(
          canvas,
          0, sourceY, canvas.width, sourceHeight,
          0, 0, pageCanvas.width, pageCanvas.height
        );

        // Convert page canvas to image data
        const pageImgData = pageCanvas.toDataURL('image/png', 1.0);

        // Add image to PDF with proper positioning
        pdf.addImage(
          pageImgData,
          'PNG',
          MARGIN,
          MARGIN,
          CONTENT_WIDTH,
          Math.min(CONTENT_HEIGHT, sourceHeight / 2 * scale),
          '',
          'FAST'
        );
      }
    }

    // Restore element styles
    restore();

    // Generate filename
    const firstName = resumeData?.firstName || 'Resume';
    const lastName = resumeData?.lastName || '';
    const filename = `${firstName}${lastName ? '_' + lastName : ''}_Resume.pdf`;

    // Download the PDF
    pdf.save(filename);

    // Restore cursor
    document.body.style.cursor = originalCursor;

    return {
      success: true,
      filename: filename,
      pages: totalPages,
      message: `PDF downloaded successfully (${totalPages} page${totalPages > 1 ? 's' : ''})`
    };

  } catch (error) {
    // Restore cursor on error
    document.body.style.cursor = 'default';

    console.error('Error generating PDF:', error);
    throw new Error(`Failed to generate PDF: ${error.message}`);
  }
};

/**
 * Validate resume data before PDF generation
 * @param {Object} resumeData - Resume data to validate
 */
export const validateResumeForPDF = (resumeData) => {
  if (!resumeData) {
    throw new Error('Resume data is required');
  }

  // Check if resume has minimum required content
  const hasPersonalDetails = resumeData.firstName || resumeData.lastName || resumeData.email;
  const hasContent = resumeData.summary || 
                    (resumeData.experience && resumeData.experience.length > 0) ||
                    (resumeData.education && resumeData.education.length > 0) ||
                    (resumeData.skills && resumeData.skills.length > 0);

  if (!hasPersonalDetails && !hasContent) {
    throw new Error('Resume must have at least some personal details or content to generate PDF');
  }

  return true;
};

/**
 * Prepare resume element for PDF generation with proper spacing and layout
 * @param {string} elementId - ID of the element to prepare
 */
export const prepareElementForPDF = (elementId) => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Resume preview element not found');
  }

  // Store original styles for restoration
  const originalStyles = {
    transform: element.style.transform,
    boxShadow: element.style.boxShadow,
    border: element.style.border,
    margin: element.style.margin,
    padding: element.style.padding,
    maxWidth: element.style.maxWidth,
    width: element.style.width,
    minHeight: element.style.minHeight,
    pageBreakInside: element.style.pageBreakInside,
  };

  // Apply PDF-optimized styles
  element.style.transform = 'none';
  element.style.boxShadow = 'none';
  element.style.border = 'none';
  element.style.margin = '0';
  element.style.padding = '40px'; // Consistent padding for all content
  element.style.maxWidth = 'none';
  element.style.width = '794px'; // A4 width at 96dpi (210mm * 96/25.4)
  element.style.minHeight = 'auto';
  element.style.pageBreakInside = 'avoid';

  // Optimize child elements for PDF generation
  const childElements = element.querySelectorAll('*');
  const childOriginalStyles = [];

  childElements.forEach((child, index) => {
    const childOriginal = {
      pageBreakInside: child.style.pageBreakInside,
      breakInside: child.style.breakInside,
      orphans: child.style.orphans,
      widows: child.style.widows,
      margin: child.style.margin,
      padding: child.style.padding,
    };
    childOriginalStyles[index] = childOriginal;

    // Apply PDF-friendly styles to child elements
    child.style.pageBreakInside = 'avoid';
    child.style.breakInside = 'avoid';
    child.style.orphans = '3';
    child.style.widows = '3';

    // Ensure consistent spacing for sections
    if (child.tagName === 'DIV' && child.className.includes('mt-')) {
      child.style.marginTop = '24px';
    }
    if (child.tagName === 'DIV' && child.className.includes('mb-')) {
      child.style.marginBottom = '16px';
    }
  });

  return {
    element,
    originalStyles,
    childOriginalStyles,
    restore: () => {
      // Restore main element styles
      Object.keys(originalStyles).forEach(key => {
        element.style[key] = originalStyles[key];
      });

      // Restore child element styles
      childElements.forEach((child, index) => {
        if (childOriginalStyles[index]) {
          Object.keys(childOriginalStyles[index]).forEach(key => {
            child.style[key] = childOriginalStyles[index][key];
          });
        }
      });
    }
  };
};
