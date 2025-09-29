import tasksData from "@/services/mockData/tasks.json";

class TaskService {
  constructor() {
    this.tasks = [...tasksData];
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 200));
  }

  async getAll() {
    await this.delay();
    return [...this.tasks];
  }

  async getById(id) {
    await this.delay();
    const task = this.tasks.find(task => task.Id === parseInt(id));
    if (!task) {
      throw new Error(`Task with id ${id} not found`);
    }
    return { ...task };
  }

  async getByProjectId(projectId) {
    await this.delay();
    return this.tasks
      .filter(task => task.projectId === parseInt(projectId))
      .map(task => ({ ...task }));
  }

  async create(taskData) {
    await this.delay();
    const maxId = Math.max(...this.tasks.map(task => task.Id), 0);
    const newTask = {
      Id: maxId + 1,
      title: taskData.title || "",
      description: taskData.description || "",
      status: taskData.status || "To Do",
      priority: taskData.priority || "Medium",
      dueDate: taskData.dueDate || null,
      projectId: taskData.projectId || null,
      tags: taskData.tags || [],
      estimatedTime: taskData.estimatedTime || 0,
      actualTime: 0,
      subtasks: taskData.subtasks || [],
      createdAt: new Date().toISOString().split("T")[0],
      completedAt: null
    };
    this.tasks.push(newTask);
    return { ...newTask };
  }

  async update(id, updateData) {
    await this.delay();
    const index = this.tasks.findIndex(task => task.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Task with id ${id} not found`);
    }
    
    const updatedTask = {
      ...this.tasks[index],
      ...updateData,
      completedAt: updateData.status === "Completed" && this.tasks[index].status !== "Completed" 
        ? new Date().toISOString().split("T")[0] 
        : updateData.status !== "Completed" 
        ? null 
        : this.tasks[index].completedAt
    };
    
    this.tasks[index] = updatedTask;
    return { ...updatedTask };
  }

  async delete(id) {
    await this.delay();
    const index = this.tasks.findIndex(task => task.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Task with id ${id} not found`);
    }
    const deletedTask = this.tasks.splice(index, 1)[0];
    return { ...deletedTask };
  }

  async updateStatus(id, status) {
    await this.delay();
    return this.update(id, { status });
  }

  async addTimeEntry(taskId, duration) {
    await this.delay();
    const task = this.tasks.find(task => task.Id === parseInt(taskId));
    if (!task) {
      throw new Error(`Task with id ${taskId} not found`);
    }
    task.actualTime += duration;
    return { ...task };
  }

  async getTasksByStatus(status) {
    await this.delay();
    return this.tasks
      .filter(task => task.status === status)
      .map(task => ({ ...task }));
  }

  async getTasksByPriority(priority) {
    await this.delay();
    return this.tasks
      .filter(task => task.priority === priority)
      .map(task => ({ ...task }));
  }

  async getOverdueTasks() {
    await this.delay();
    const today = new Date().toISOString().split("T")[0];
    return this.tasks
      .filter(task => task.dueDate && task.dueDate < today && task.status !== "Completed")
      .map(task => ({ ...task }));
  }
}

export default new TaskService();