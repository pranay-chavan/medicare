const doctors = [
  { id: 1, name: "Dr. Priya Sharma", department: "Emergency", available: true, avatar: "PS", patients: 0 },
  { id: 2, name: "Dr. Arjun Mehta", department: "Cardiology", available: true, avatar: "AM", patients: 0 },
  { id: 3, name: "Dr. Sunita Rao", department: "General", available: true, avatar: "SR", patients: 0 },
  { id: 4, name: "Dr. Vikram Nair", department: "ICU", available: true, avatar: "VN", patients: 0 },
  { id: 5, name: "Dr. Anjali Singh", department: "Radiology", available: true, avatar: "AS", patients: 0 },
  { id: 6, name: "Dr. Rahul Gupta", department: "General", available: true, avatar: "RG", patients: 0 },
  { id: 7, name: "Dr. Meera Pillai", department: "Maternity", available: true, avatar: "MP", patients: 0 },
  { id: 8, name: "Dr. Karan Verma", department: "Surgery", available: true, avatar: "KV", patients: 0 },
];

export const getAvailableDoctor = (department) => {
  const available = doctors.filter(d => d.available);

  // First try to find exact department match
  const exactMatch = available.find(d => d.department === department);
  if (exactMatch) return exactMatch;

  // Fallback to any available doctor
  return available[0] || null;
};

export default doctors;