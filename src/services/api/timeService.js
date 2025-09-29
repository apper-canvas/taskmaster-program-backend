import timeEntriesData from "@/services/mockData/timeEntries.json";

class TimeService {
  constructor() {
    this.timeEntries = [...timeEntriesData];
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 150));
  }

  async getAll() {
    await this.delay();
    return [...this.timeEntries];
  }

  async getById(id) {
    await this.delay();
    const entry = this.timeEntries.find(entry => entry.Id === parseInt(id));
    if (!entry) {
      throw new Error(`Time entry with id ${id} not found`);
    }
    return { ...entry };
  }

  async getByTaskId(taskId) {
    await this.delay();
    return this.timeEntries
      .filter(entry => entry.taskId === parseInt(taskId))
      .map(entry => ({ ...entry }));
  }

  async create(entryData) {
    await this.delay();
    const maxId = Math.max(...this.timeEntries.map(entry => entry.Id), 0);
    const newEntry = {
      Id: maxId + 1,
      taskId: parseInt(entryData.taskId),
      startTime: entryData.startTime || new Date().toISOString(),
      endTime: entryData.endTime || new Date().toISOString(),
      duration: entryData.duration || 0
    };
    this.timeEntries.push(newEntry);
    return { ...newEntry };
  }

  async update(id, updateData) {
    await this.delay();
    const index = this.timeEntries.findIndex(entry => entry.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Time entry with id ${id} not found`);
    }
    
    const updatedEntry = {
      ...this.timeEntries[index],
      ...updateData
    };
    
    this.timeEntries[index] = updatedEntry;
    return { ...updatedEntry };
  }

  async delete(id) {
    await this.delay();
    const index = this.timeEntries.findIndex(entry => entry.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Time entry with id ${id} not found`);
    }
    const deletedEntry = this.timeEntries.splice(index, 1)[0];
    return { ...deletedEntry };
  }

  async getTotalTimeForTask(taskId) {
    await this.delay();
    const entries = this.timeEntries.filter(entry => entry.taskId === parseInt(taskId));
    return entries.reduce((total, entry) => total + entry.duration, 0);
  }

  async getTimeEntriesForDateRange(startDate, endDate) {
    await this.delay();
    return this.timeEntries
      .filter(entry => {
        const entryDate = new Date(entry.startTime).toISOString().split("T")[0];
        return entryDate >= startDate && entryDate <= endDate;
      })
      .map(entry => ({ ...entry }));
  }
}

export default new TimeService();