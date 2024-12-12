export interface User {
  email: string;
  username: string;
  password: string;
  role?: string;
  firstName: string;
  lastName: string;
}

export const dummyUsers: User[] = [
  { email: 'abdul@tecbrix.com', username: 'admin', password: 'design@2212', role: 'Admin', firstName: 'Abdul', lastName: 'Rahman' },
  { email: 'zahid@tecbrix.com', username: 'superadmin', password: 'Front@2212', role: 'Super Admin', firstName: 'Zahid', lastName: 'Khan' },
  { email: 'naveed@tecbrix.com', username: 'admin_backend', password: 'Back@2212', role: 'Backend Admin', firstName: 'Naveed', lastName: 'Ahmed' },
  { email: 'sarah@example.com', username: 'sarah_dev', password: 'securePass123', role: 'Developer', firstName: 'Sarah', lastName: 'Johnson' },
  { email: 'mike@company.org', username: 'mike_manager', password: 'managePass456', role: 'Project Manager', firstName: 'Mike', lastName: 'Smith' },
  { email: 'emily@startup.io', username: 'emily_design', password: 'creativePass789', role: 'UI/UX Designer', firstName: 'Emily', lastName: 'Brown' },
  { email: 'alex@tech.co', username: 'alex_data', password: 'dataScience101', role: 'Data Scientist', firstName: 'Alex', lastName: 'Taylor' },
  { email: 'chris@agency.net', username: 'chris_marketing', password: 'marketPro202', role: 'Marketing Specialist', firstName: 'Chris', lastName: 'Davis' },
  { email: 'lisa@edutech.edu', username: 'lisa_teacher', password: 'eduPass303', role: 'Educator', firstName: 'Lisa', lastName: 'Wilson' },
  { email: 'david@healthcare.med', username: 'david_doctor', password: 'healthPro404', role: 'Healthcare Professional', firstName: 'David', lastName: 'Martinez' },
];