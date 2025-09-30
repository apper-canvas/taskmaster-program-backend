import users from '@/services/mockData/users.json';

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory data store (simulates database)
let userData = [...users];

const userService = {
  // Get all users
  async getAll() {
    await delay(200);
    return [...userData]; // Return copy to prevent mutations
  },

  // Get user by ID
  async getById(id) {
    await delay(150);
    const user = userData.find(u => u.Id === parseInt(id));
    return user ? { ...user } : null; // Return copy to prevent mutations
  },

  // Create new user
  async create(userData) {
    await delay(300);
    const newUser = {
      ...userData,
      Id: Math.max(...userData.map(u => u.Id), 0) + 1,
      joinDate: new Date().toISOString().split('T')[0],
      status: 'Active'
    };
    userData.push(newUser);
    return { ...newUser };
  },

  // Update existing user
  async update(id, updateData) {
    await delay(250);
    const index = userData.findIndex(u => u.Id === parseInt(id));
    if (index === -1) {
      throw new Error('User not found');
    }
    
    userData[index] = { 
      ...userData[index], 
      ...updateData,
      Id: parseInt(id) // Ensure ID doesn't change
    };
    return { ...userData[index] };
  },

  // Delete user
  async delete(id) {
    await delay(200);
    const index = userData.findIndex(u => u.Id === parseInt(id));
    if (index === -1) {
      throw new Error('User not found');
    }
    
    userData.splice(index, 1);
    return true;
  },

  // Get users by department
  async getByDepartment(department) {
    await delay(180);
    return userData
      .filter(u => u.department.toLowerCase() === department.toLowerCase())
      .map(u => ({ ...u }));
  },

  // Search users by name or email
  async search(query) {
    await delay(150);
    const searchTerm = query.toLowerCase();
    return userData
      .filter(u => 
        u.name.toLowerCase().includes(searchTerm) ||
        u.email.toLowerCase().includes(searchTerm)
      )
      .map(u => ({ ...u }));
  }
};

export default userService;