// list of nus faculties
export const facultyList = [
  "Faculty of Arts and Social Sciences",
  "School of Business",
  "School of Computing",
  "College of Design and Engineering",
  "Faculty of Law",
  "Faculty of Science",
  "Yong Siew Toh Conservatory of Music",
];

// dictionary of nus majors by faculty
export const majorDict = {
  "Faculty of Arts and Social Sciences": [
    "Chinese Language",
    "Chinese Studies",
    "Communications and New Media",
    "Economics",
    "English Language and Linguistics",
    "English Literature",
    "Geography",
    "Global Studies",
    "History",
    "Japanese Studies",
    "Malay Studies",
    "Philosophy",
    "Political Science",
    "Psychology",
    "Social Work",
    "Sociology",
    "South Asian Studies",
    "Southeast Asian Studies",
    "Theatre and Performance Studies",
    "Philosophy, Politics, and Economics (PPE)",
    "Anthropology",
  ],
  "School of Business": [
    "Business Administration",
    "Accountancy",
    "Real Estate",
    "Management",
    "Entrepreneurship",
  ],
  "School of Computing": [
    "Computer Science",
    "Information Systems",
    "Business Analytics",
    "Information Security",
    "Computer Engineering",
  ],
  "College of Design and Engineering": [
    "Architecture",
    "Biomedical Engineering",
    "Chemical Engineering",
    "Civil Engineering",
    "Computer Engineering",
    "Electrical Engineering",
    "Engineering Science",
    "Environmental Engineering",
    "Industrial Design",
    "Industrial Systems Engineering",
    "Infrastructure & Project Management",
    "Landscape Architecture",
    "Materials Science and Engineering",
    "Mechanical Engineering",
  ],
  "Faculty of Law": ["Law"],
  "Faculty of Science": [
    "Chemistry",
    "Data Science and Analytics",
    "Data Science and Economics",
    "Environmental Studies",
    "Food Science and Technology",
    "Life Sciences",
    "Mathematics",
    "Pharmaceutical Science",
    "Pharmacy",
    "Physics",
    "Quantitative Finance",
    "Statistics",
  ],
  "Yong Siew Toh Conservatory of Music": ["Music"],
};

// list of nus majors
export const majorList = Array.from(new Set(Object.values(majorDict).flat()));

// list of special programmes available (tbc, include scholarships)
export const progsList = ["SEP", "NOC", "UTCP", "RVRC", "NUS College"];
export const acadPlanList = ["Single Degree", "Double Degree", "Double Major"];

export const interestsDict = {
  "module related": ["easy to score", "light workload"],
  "career progression": ["internship", "research"],
  business: ["management", "finance"],
  computing: ["machine-learning", "OOP", "data analysis"],
};

// sample personal details for user profile setup. meant to extract from database
export const sampleProfile = {
  name: "Hannah Tan",
  avatar: "/sample_icon.png",
  studentId: "12345678",
  username: "hannah_tan",
  password: "hannah123",
  email: "hannah@gmail.com",
  faculty: "School of Computing",
  primaryDegree: "Information Systems",
  secondDegree: "",
  secondMajor: "Economics",
  minor: ["Geography", "History"],
  programme: "RVRC",
};

export const btCoreModules = [
  "IS1108",
  "MA1522",
  "MA1521",
  "BT2101",
  "BT2102",
  "CS2030",
  "CS2040",
  "IS2101",
  "ST2334",
  "BT3103",
  "IS3103",
  "BT4103",
  "BT4101",
];

export const csCoreModules = [
  "IS1108",
  "MA1522",
  "MA1521",
  "ST2334",
  "CS1231S",
  "CS2030S",
  "CS2040S",
  "CS2100",
  "CS2101",
  "CS2103T",
  "CS2106",
  "CS2109S",
  "CS3230",
];

export const isCoreModules = [
  "IS1108",
  "BT2102",
  "CS2030",
  "CS2040",
  "IS2101",
  "IS2102",
  "IS2103",
  "IS3103",
  "IS3106",
  "CP4101",
  "IS4103",
  "MA1521",
  "ST2334",
];
