/**
 * Test utility for PDF generation with sample multi-page resume data
 * This helps verify that the PDF generation handles long content properly
 */

export const createTestResumeData = () => {
  return {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1-555-0123",
    address: "123 Main Street, New York, NY 10001",
    themeColor: "#2563eb",
    
    summary: "Experienced Full-Stack Software Engineer with 8+ years of expertise in developing scalable web applications, leading cross-functional teams, and implementing modern technologies. Proven track record of delivering high-quality software solutions that drive business growth and improve user experience. Passionate about clean code, agile methodologies, and continuous learning. Strong background in both frontend and backend development with expertise in React, Node.js, Python, and cloud technologies.",
    
    experience: [
      {
        title: "Senior Full-Stack Developer",
        companyName: "Tech Innovations Inc.",
        city: "San Francisco",
        state: "CA",
        startDate: "01/2020",
        endDate: "",
        currentlyWorking: "Yes",
        workSummary: "Lead development of enterprise-level web applications serving 100,000+ users. Architected and implemented microservices architecture using Node.js and Docker, resulting in 40% improved system performance. Mentored junior developers and established coding standards and best practices. Collaborated with product managers and designers to deliver user-centric features. Implemented CI/CD pipelines using Jenkins and AWS, reducing deployment time by 60%. Developed RESTful APIs and integrated third-party services including payment gateways and analytics platforms."
      },
      {
        title: "Full-Stack Developer",
        companyName: "Digital Solutions LLC",
        city: "Austin",
        state: "TX",
        startDate: "06/2018",
        endDate: "12/2019",
        currentlyWorking: "",
        workSummary: "Developed and maintained multiple client-facing web applications using React, Redux, and Node.js. Built responsive user interfaces that improved user engagement by 35%. Implemented automated testing suites using Jest and Cypress, achieving 90% code coverage. Optimized database queries and implemented caching strategies, reducing page load times by 50%. Worked closely with UX/UI designers to implement pixel-perfect designs and ensure cross-browser compatibility."
      },
      {
        title: "Software Developer",
        companyName: "StartupXYZ",
        city: "Boston",
        state: "MA",
        startDate: "08/2016",
        endDate: "05/2018",
        currentlyWorking: "",
        workSummary: "Contributed to the development of a SaaS platform from ground up, serving early-stage startups. Built scalable backend services using Python Django and PostgreSQL. Developed real-time features using WebSocket technology for collaborative editing. Implemented user authentication and authorization systems with role-based access control. Created comprehensive API documentation and conducted code reviews to maintain high code quality standards."
      },
      {
        title: "Junior Developer",
        companyName: "WebDev Agency",
        city: "Chicago",
        state: "IL",
        startDate: "01/2015",
        endDate: "07/2016",
        currentlyWorking: "",
        workSummary: "Developed custom WordPress themes and plugins for various client projects. Built responsive websites using HTML5, CSS3, and JavaScript. Collaborated with design team to implement creative solutions and ensure brand consistency. Performed website maintenance, updates, and troubleshooting. Gained experience with version control systems (Git) and agile development methodologies."
      }
    ],
    
    projects: [
      {
        title: "E-Commerce Platform",
        startDate: "03/2023",
        endDate: "08/2023",
        summary: "Developed a comprehensive e-commerce platform using React, Node.js, and MongoDB. Implemented features including product catalog, shopping cart, payment processing with Stripe, order management, and admin dashboard. Utilized Redux for state management and implemented real-time inventory updates. Deployed on AWS with auto-scaling capabilities to handle traffic spikes during sales events."
      },
      {
        title: "Task Management Application",
        startDate: "10/2022",
        endDate: "02/2023",
        summary: "Built a collaborative task management application similar to Trello using React, Express.js, and Socket.io for real-time updates. Implemented drag-and-drop functionality, user authentication with JWT, file attachments, and email notifications. Used PostgreSQL for data persistence and Redis for session management. Achieved 99.9% uptime with comprehensive error handling and monitoring."
      },
      {
        title: "Data Visualization Dashboard",
        startDate: "05/2022",
        endDate: "09/2022",
        summary: "Created an interactive data visualization dashboard for business analytics using React, D3.js, and Python Flask. Integrated with multiple data sources including REST APIs and CSV files. Implemented various chart types including line graphs, bar charts, pie charts, and heat maps. Added filtering, sorting, and export functionality. Optimized for performance to handle large datasets with virtual scrolling and data pagination."
      }
    ],
    
    education: [
      {
        universityName: "Massachusetts Institute of Technology",
        startDate: "2011",
        endDate: "2015",
        degree: "Bachelor of Science",
        major: "Computer Science",
        description: "Graduated Magna Cum Laude with a focus on software engineering and algorithms. Completed coursework in data structures, computer systems, artificial intelligence, and software design. Participated in hackathons and coding competitions. Senior thesis on machine learning applications in web development."
      },
      {
        universityName: "Stanford University",
        startDate: "2019",
        endDate: "2021",
        degree: "Master of Science",
        major: "Computer Science",
        description: "Specialized in distributed systems and cloud computing. Conducted research on microservices architecture and container orchestration. Published paper on 'Optimizing Container Deployment in Cloud Environments' in IEEE conference. Maintained 3.9 GPA while working part-time as a teaching assistant for undergraduate programming courses."
      }
    ],
    
    skills: [
      {
        name: "JavaScript/TypeScript",
        rating: 5
      },
      {
        name: "React/Redux",
        rating: 5
      },
      {
        name: "Node.js/Express",
        rating: 4
      },
      {
        name: "Python/Django",
        rating: 4
      }
    ]
  };
};

/**
 * Test function to verify PDF generation with long content
 */
export const testMultiPagePDF = async () => {
  try {
    console.log('🧪 Testing multi-page PDF generation...');
    
    const testData = createTestResumeData();
    console.log('✅ Test resume data created');
    console.log('📄 Content includes:');
    console.log(`   - ${testData.experience.length} experience entries`);
    console.log(`   - ${testData.projects.length} project entries`);
    console.log(`   - ${testData.education.length} education entries`);
    console.log(`   - ${testData.skills.length} skills`);
    
    // Calculate estimated content length
    const summaryLength = testData.summary.length;
    const experienceLength = testData.experience.reduce((total, exp) => total + exp.workSummary.length, 0);
    const projectsLength = testData.projects.reduce((total, proj) => total + proj.summary.length, 0);
    const educationLength = testData.education.reduce((total, edu) => total + (edu.description || '').length, 0);
    
    const totalContentLength = summaryLength + experienceLength + projectsLength + educationLength;
    console.log(`📏 Total content length: ${totalContentLength} characters`);
    console.log(`📄 Estimated pages: ${Math.ceil(totalContentLength / 2000)} (rough estimate)`);
    
    return testData;
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    throw error;
  }
};

/**
 * Instructions for manual testing
 */
export const getPDFTestInstructions = () => {
  return `
🧪 PDF Generation Testing Instructions:

1. **Load Test Data:**
   - Import testMultiPagePDF from this file
   - Call testMultiPagePDF() to get sample resume data
   - Load this data into the resume form

2. **Test Multi-Page Generation:**
   - Navigate to the resume preview
   - Click "Download PDF" button
   - Verify the generated PDF has multiple pages
   - Check for proper page breaks and content flow

3. **Verify Quality:**
   - Ensure text is crisp and readable
   - Check that content doesn't overlap between pages
   - Verify consistent margins and spacing
   - Confirm all sections are included

4. **Test Different Content Lengths:**
   - Try with minimal content (should be 1 page)
   - Try with extensive content (should be 2+ pages)
   - Verify page breaks occur at logical points

5. **Check Edge Cases:**
   - Very long experience descriptions
   - Multiple projects and education entries
   - Different theme colors
   - Various name lengths for filename generation
  `;
};
