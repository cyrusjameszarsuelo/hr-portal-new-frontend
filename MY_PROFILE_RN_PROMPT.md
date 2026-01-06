# React Native My Profile Module - UI/UX Development Prompt

## 📱 Project Context
You are building the **My Profile Module** for an HR Portal React Native app. This module allows employees to view their comprehensive profile information including personal details, job profile, performance management, and team members.

**Target File:** `screens/human-resources/MyProfile.js`

---

## 🎯 Module Overview

The My Profile module consists of **5 main tabs** with rich, interactive UI components displaying read-only employee information (no CRUD operations for now).

---

## 📋 Tab Structure & Requirements

### **Tab 1: About** ⭐ (Primary Tab)

#### **Layout:**
- Use `ScrollView` for vertical scrolling
- Collapsible sections using Accordion/Expandable cards
- Modern card-based design with shadows and borders

#### **Sections to Include:**

##### **1. Personal Information** (Collapsible)
Display in a clean grid layout (2 columns on larger screens, 1 on mobile):
- Employee ID
- Nickname
- Birth Date
- Age (calculated from birthdate)
- Gender
- Civil Status
- Phone Number
- Blood Type
- Citizenship
- Birth Place (full width)

**Emergency Contact Subsection:**
- Contact Name
- Relationship
- Contact Number

**Address Subsections:**
- **Current Address:** Street, City, Region, Zip Code
- **Permanent Address:** Street, City, Region, Zip Code

##### **2. Interests** (Collapsible)
- Display as bullet list or tag chips
- Show array of interests
- Empty state: "No interests added"

##### **3. Skills** (Collapsible)
- Display as bullet list or tag chips
- Show array of skills
- Empty state: "No skills added"

##### **4. Educational Background** (Collapsible)
- List view with card items
- Each card shows:
  - Education Level
  - School Attended
  - Degree/Program/Course
  - Academic Achievements
  - Period (Year Started - Year Ended or "Present")

##### **5. Licenses & Certifications** (Collapsible)
- List view with card items
- Each card shows:
  - License/Certification Name
  - Issuing Organization
  - License Number
  - Date Issued
  - Date of Expiration (or "Non-Expiring")

##### **6. Megawide Work Experience** (Collapsible)
- Job Title
- Department
- Unit
- Job Level
- Employment Status
- Start Date
- End Date (or "Currently Working")
- Previous Assignments (list of cards with Position, Department, Date Range)

##### **7. Previous Work Experience** (Collapsible)
- List of cards showing:
  - Company Name
  - Job Title
  - Location
  - Date Range
  - Key Responsibilities/Achievements

##### **8. Technical Proficiencies** (Collapsible)
- List items with:
  - Tool/Technology Name
  - Proficiency Level (Beginner/Intermediate/Advanced/Expert)

##### **9. Language Proficiencies** (Collapsible)
- List items with:
  - Language
  - Proficiency Level

---

### **Tab 2: Job Profile** 📋

#### **Layout:**
- Sticky header with job title and metadata
- Scrollable content sections
- Expand/collapse functionality for job descriptions

#### **Sections to Include:**

##### **1. Job Profile Header** (Sticky at top)
- Position Title (large, bold)
- Department
- Position Level
- Reports To (name)
- Use gradient background (red theme: #ee3124)

##### **2. Job Purpose Section**
- Bordered left accent (red)
- Display job purpose text
- Clean typography

##### **3. Job Descriptions/KRAs** (Key Result Areas)
- **Expand All / Collapse All** button at section header
- List of expandable items:
  - **Count number** (1, 2, 3...)
  - **KRA Title/Description** (collapsed view)
  - When expanded, show:
    - Full description
    - Expected outputs/deliverables
    - Performance indicators

##### **4. Additional Sections** (Dropdown/Collapsible)
Each in its own collapsible card:

- **Performance Standards**
  - List of performance criteria
  - Expected standards for the role

- **Job Specifications**
  - Educational requirements
  - Work experience requirements
  - Technical skills required
  - Behavioral competencies

- **Reporting Relationships**
  - Direct reports (if any)
  - Indirect reports (if any)
  - Matrix reporting relationships

- **Levels of Authority**
  - Financial authority limits
  - Decision-making authority
  - Approval authority

---

### **Tab 3: Performance Management** 📊

#### **Layout:**
- Overview section at top
- Expandable table/list view for performance areas
- Rating display with visual indicators

#### **Sections to Include:**

##### **1. Overall Rating Summary Card**
- Large card at top showing:
  - Overall Performance Rating (large number with color coding)
  - Rating description (e.g., "Exceeds Expectations")
  - Performance period

##### **2. Performance Areas Table**
Main table with expandable rows:

**Table Columns:**
- Performance Area (e.g., "Individual Objectives & Deliverables")
- Weight (%)
- Actual Rating
- Calculated Rating
- Calibrated Rating
- Expand/Collapse icon

**Expanded Row Content:**
Show detailed objectives for each performance area:
- Objective Description
- Weight (%)
- Actual Rating
- Calculated Rating
- Calibrated Rating

##### **3. Summary Footer**
- Total Weight: 100%
- Average Actual Rating
- Average Calculated Rating
- Average Calibrated Rating

##### **4. Visual Enhancements**
- Color-coded ratings:
  - 4.5-5.0: Green (Exceptional)
  - 3.5-4.4: Blue (Exceeds)
  - 2.5-3.4: Yellow (Meets)
  - 1.5-2.4: Orange (Needs Improvement)
  - 0-1.4: Red (Unsatisfactory)

---

### **Tab 4: Development Plan** 🎯

#### **Layout:**
- Simple placeholder for now
- Future implementation area

#### **Content:**
- Display placeholder message:
  - "Individual Development Plan"
  - "Coming soon..."
  - Icon/illustration

---

### **Tab 5: MCAT** 📈

#### **Layout:**
- Simple placeholder for now
- Future implementation area

#### **Content:**
- Display placeholder message:
  - "Megawide Competency Assessment Tool"
  - "Coming soon..."
  - Icon/illustration

---

## 👥 Additional Components

### **Profile Header** (Above tabs)

Display at the very top of the screen:

#### **Elements:**
- **Profile Picture/Avatar** (circular, 80-100px)
  - Use placeholder avatar if no image
  - Fallback: User initials in colored circle

- **Employee Name** (large, bold)
- **Position Title** (subtitle)
- **Department** (smaller text)

#### **Action Buttons** (Icon buttons in header right)
- **Edit Profile Button** (pencil icon)
  - Shows "Edit Profile" label
  - Disabled for now (since no CRUD)
  - Optional: Show toast "Edit functionality coming soon"

- **Download PDF Button** (download icon)
  - Shows "Download PDF" label
  - Disabled for now
  - Optional: Show toast "Download functionality coming soon"

### **Team Section** (Expandable below profile header, above tabs)

Show collapsible sections:

#### **1. Direct Reports**
- List of team members (if user is a manager)
- Each item shows:
  - Avatar
  - Name
  - Position
  - Tap to view their profile

#### **2. Indirect Reports**
- Similar to direct reports
- Shows extended team members

---

## 🎨 Design Guidelines

### **Color Scheme**
- **Primary Red:** `#ee3124` (Megawide red)
- **Background:** `#f9fafb` (light gray)
- **Card Background:** `#ffffff` (white)
- **Text Primary:** `#1f2937` (dark gray)
- **Text Secondary:** `#6b7280` (medium gray)
- **Borders:** `#e5e7eb` (light border)
- **Success:** `#10b981` (green)
- **Warning:** `#f59e0b` (orange)
- **Error:** `#ef4444` (red)

### **Typography**
- **Headers:** Bold, 18-24px
- **Subheaders:** Semi-bold, 16-18px
- **Body Text:** Regular, 14-16px
- **Small Text:** Regular, 12-14px
- **Font Family:** System default (San Francisco for iOS, Roboto for Android)

### **Spacing**
- **Section Padding:** 16-20px
- **Card Padding:** 12-16px
- **Item Spacing:** 8-12px
- **Section Margins:** 12-16px

### **Components**
- **Cards:** Rounded corners (8-12px), subtle shadow
- **Buttons:** Rounded (6-8px), clear tap targets (min 44px height)
- **Icons:** Use react-native-vector-icons (Heroicons style recommended)
- **Collapsible:** Smooth animations (200-300ms)

---

## 📦 Component Suggestions

### **Recommended React Native Libraries:**
1. **react-native-collapsible** - For collapsible sections
2. **react-native-vector-icons** - For icons
3. **@react-navigation/material-top-tabs** - For tab navigation
4. **react-native-paper** OR **react-native-elements** - UI component library
5. **react-native-flash-message** - For toast messages

### **Component Structure:**

```
screens/human-resources/
├── MyProfile.js (Main container with tabs)
└── components/
    ├── ProfileHeader.js
    ├── TeamSection.js
    ├── AboutTab/
    │   ├── PersonalInfoSection.js
    │   ├── InterestsSection.js
    │   ├── SkillsSection.js
    │   ├── EducationSection.js
    │   ├── LicensesSection.js
    │   ├── MegawideWorkSection.js
    │   └── ...
    ├── JobProfileTab/
    │   ├── JobProfileHeader.js
    │   ├── JobPurposeSection.js
    │   ├── JobDescriptionsSection.js
    │   └── ...
    ├── PerformanceTab/
    │   ├── OverallRatingCard.js
    │   ├── PerformanceAreaRow.js
    │   └── ...
    └── shared/
        ├── InfoCard.js
        ├── InfoField.js
        ├── CollapsibleCard.js
        └── SectionTitle.js
```

---

## 📊 Mock Data Structure

Use this mock data structure for initial UI development:

```javascript
const mockProfile = {
  // Profile Header
  profile_picture: null, // or image URL
  full_name: "Juan Dela Cruz",
  position: "Senior Software Engineer",
  department: "Information Technology",
  
  // About Tab
  about: {
    employee_id: "EMP-12345",
    nickname: "Juan",
    birthdate: "1990-05-15",
    gender: "Male",
    civil_status: "Married",
    phone_number: "+63 917 123 4567",
    blood_type: "O+",
    citizenship: "Filipino",
    birth_place: "Manila, Philippines",
    
    // Emergency Contact
    emergency_contact_name: "Maria Dela Cruz",
    relationship_to_employee: "Spouse",
    emergency_contact_number: "+63 917 765 4321",
    
    // Addresses
    current_address_street: "123 Main St, Brgy. Sample",
    current_address_city: "Quezon City",
    current_address_region: "NCR",
    current_address_zip_code: "1100",
    permanent_address_street: "456 Home Ave, Brgy. Hometown",
    permanent_address_city: "Manila",
    permanent_address_region: "NCR",
    permanent_address_zip_code: "1000",
    
    // Arrays
    interests: ["Reading", "Coding", "Basketball", "Travel"],
    skills: ["JavaScript", "React Native", "Leadership", "Communication"],
    
    educational_backgrounds: [
      {
        education_level: "Bachelor's Degree",
        school_attended: "University of the Philippines",
        degree_program_course: "BS Computer Science",
        academic_achievements: "Cum Laude",
        year_started: "2008",
        year_ended: "2012"
      }
    ],
    
    licenses_certifications: [
      {
        license_certification_name: "AWS Certified Solutions Architect",
        issuing_organization: "Amazon Web Services",
        license_certification_number: "AWS-123456",
        date_issued: "2020-06-15",
        date_of_expiration: "2023-06-15",
        non_expiring: false
      }
    ],
    
    megawide_work_experience: {
      job_title: "Senior Software Engineer",
      department: "Information Technology",
      unit: "Application Development",
      job_level: "Senior Level",
      employment_status: "Regular",
      current_role_start_date: "2020-01-15",
      is_current: true,
      previous_assignments: [
        {
          position: "Software Engineer",
          department: "IT",
          start_date: "2018-03-01",
          end_date: "2019-12-31"
        }
      ]
    },
    
    previous_work_experiences: [
      {
        company_name: "TechCorp Inc.",
        job_title: "Junior Developer",
        location: "Makati City",
        start_date: "2015-07-01",
        end_date: "2017-12-31",
        responsibilities: "Developed web applications"
      }
    ],
    
    technical_proficiencies: [
      { tool_technology: "React Native", proficiency_level: "Expert" },
      { tool_technology: "Node.js", proficiency_level: "Advanced" },
      { tool_technology: "Python", proficiency_level: "Intermediate" }
    ],
    
    language_proficiencies: [
      { language: "English", proficiency_level: "Fluent" },
      { language: "Filipino", proficiency_level: "Native" }
    ]
  },
  
  // Job Profile Tab
  job_profile: {
    position: "Senior Software Engineer",
    department: "Information Technology",
    level: "Senior Level",
    reporting_to: { name: "John Manager" },
    job_purpose: "Lead development of mobile applications and mentor junior developers...",
    
    job_descriptions: [
      {
        kra_number: 1,
        title: "Mobile Application Development",
        description: "Develop and maintain mobile applications using React Native",
        outputs: ["Working mobile app", "Code reviews"],
        indicators: ["App performance", "Code quality"]
      },
      {
        kra_number: 2,
        title: "Team Leadership",
        description: "Mentor junior developers and lead technical discussions",
        outputs: ["Training sessions", "Technical documentation"],
        indicators: ["Team productivity", "Code quality improvement"]
      }
    ],
    
    job_performance_standards: [
      "Deliver high-quality code within timeline",
      "Maintain 90% unit test coverage",
      "Complete all assigned tasks on time"
    ],
    
    job_specifications: {
      education: "Bachelor's degree in Computer Science or related field",
      experience: "5+ years in software development",
      technical_skills: ["React Native", "JavaScript", "Git"],
      behavioral_competencies: ["Leadership", "Communication", "Problem-solving"]
    },
    
    reporting_relationships: {
      direct_reports: ["Developer 1", "Developer 2"],
      indirect_reports: ["Intern 1"],
      matrix_reports: []
    },
    
    levels_of_authority: [
      "Approve code merges up to major releases",
      "Technical decisions within the team",
      "Budget approval up to PHP 50,000"
    ]
  },
  
  // Performance Management Tab
  performance: {
    overall_rating: 4.3,
    rating_description: "Exceeds Expectations",
    performance_period: "2024",
    
    performance_areas: [
      {
        performance_area: "Individual Objectives & Deliverables",
        weight: "80%",
        actual_rating: "4.5",
        calculated_rating: "3.6",
        calibrated_rating: "4.3",
        objectives: [
          {
            description: "Complete Mobile App Project",
            weight: "40%",
            actual_rating: "5",
            calculated_rating: "2.0",
            calibrated_rating: "4.5"
          },
          {
            description: "Code Review and Quality Assurance",
            weight: "40%",
            actual_rating: "4",
            calculated_rating: "1.6",
            calibrated_rating: "4.0"
          }
        ]
      },
      {
        performance_area: "Competencies & Values",
        weight: "20%",
        actual_rating: "4.0",
        calculated_rating: "0.8",
        calibrated_rating: "4.0",
        objectives: [
          {
            description: "Demonstrate leadership and teamwork",
            weight: "20%",
            actual_rating: "4",
            calculated_rating: "0.8",
            calibrated_rating: "4.0"
          }
        ]
      }
    ]
  },
  
  // Team Members
  team_members: [
    {
      id: 1,
      name: "Alice Developer",
      position: "Software Engineer",
      avatar: null
    },
    {
      id: 2,
      name: "Bob Junior",
      position: "Junior Developer",
      avatar: null
    }
  ],
  
  indirect_reports: [
    {
      id: 3,
      name: "Charlie Intern",
      position: "Intern",
      avatar: null
    }
  ]
};
```

---

## ✅ Implementation Checklist

### **Phase 1: Basic Structure**
- [ ] Setup tab navigation (5 tabs)
- [ ] Create profile header component
- [ ] Implement mock data structure
- [ ] Setup basic styling/theme

### **Phase 2: About Tab**
- [ ] Personal Information section (collapsible)
- [ ] Interests section (collapsible)
- [ ] Skills section (collapsible)
- [ ] Educational Background section (collapsible)
- [ ] Licenses & Certifications section (collapsible)
- [ ] Megawide Work Experience section (collapsible)
- [ ] Previous Work Experience section (collapsible)
- [ ] Technical Proficiencies section (collapsible)
- [ ] Language Proficiencies section (collapsible)

### **Phase 3: Job Profile Tab**
- [ ] Sticky job profile header
- [ ] Job purpose section
- [ ] Job descriptions with expand/collapse all
- [ ] Performance standards section
- [ ] Job specifications section
- [ ] Reporting relationships section
- [ ] Levels of authority section

### **Phase 4: Performance Management Tab**
- [ ] Overall rating card
- [ ] Performance areas expandable table
- [ ] Nested objectives display
- [ ] Rating color coding
- [ ] Summary footer

### **Phase 5: Placeholders**
- [ ] Development Plan tab placeholder
- [ ] MCAT tab placeholder

### **Phase 6: Team Section**
- [ ] Direct reports list (collapsible)
- [ ] Indirect reports list (collapsible)
- [ ] Member profile navigation (optional for now)

### **Phase 7: Polish**
- [ ] Loading states
- [ ] Empty states
- [ ] Error states
- [ ] Smooth animations
- [ ] Responsive design (tablet support)
- [ ] Accessibility (screen reader support)

---

## 🚀 Getting Started

1. **Create the main screen:** `screens/human-resources/MyProfile.js`
2. **Setup tab navigation** using `@react-navigation/material-top-tabs`
3. **Import and use mock data** from above structure
4. **Build components incrementally** starting with Profile Header and About tab
5. **Test on both iOS and Android** simulators/devices
6. **Ensure smooth scrolling** and performance with large data sets

---

## 🎯 Success Criteria

- ✅ All 5 tabs are functional and navigable
- ✅ All sections are collapsible/expandable smoothly
- ✅ UI matches design guidelines (colors, spacing, typography)
- ✅ Profile displays mock data correctly in all sections
- ✅ Smooth scrolling and animations
- ✅ Responsive on different screen sizes
- ✅ Performance is optimized (no lag)
- ✅ Clean, maintainable component structure

---

## 📝 Notes

- **No API calls needed** - Use mock data for now
- **No forms or editing** - Read-only display only
- **Focus on UI/UX polish** - Smooth interactions, beautiful design
- **Keep components reusable** - May need them for other profiles later
- **Consider future CRUD** - Structure data to easily integrate API later

---

**Good luck with your My Profile module development! 🚀**
