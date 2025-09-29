import projectsData from "@/services/mockData/projects.json";

class ProjectService {
  constructor() {
    this.projects = [...projectsData];
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, 250 + Math.random() * 200));
  }

  async getAll() {
    await this.delay();
    return [...this.projects];
  }

  async getById(id) {
    await this.delay();
    const project = this.projects.find(project => project.Id === parseInt(id));
    if (!project) {
      throw new Error(`Project with id ${id} not found`);
    }
    return { ...project };
  }

  async create(projectData) {
    await this.delay();
const maxId = Math.max(...this.projects.map(project => project.Id), 0);
    const newProject = {
      Id: maxId + 1,
      description: projectData.description || "",
      dueDate: projectData.dueDate || null,
      color: projectData.color || "#3b82f6",
      assignee: projectData.assignee || null,
      status: projectData.status || "Active",
      createdAt: new Date().toISOString().split('T')[0],
      tasks: []
    };
    this.projects.push(newProject);
    return { ...newProject };
  }

  async update(id, updateData) {
    await this.delay();
    const index = this.projects.findIndex(project => project.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Project with id ${id} not found`);
    }
// Update project
    const updatedProject = {
      ...this.projects[index],
      ...updateData,
      assignee: updateData.assignee !== undefined ? updateData.assignee : this.projects[index].assignee
    };
    
    this.projects[index] = updatedProject;
    return { ...updatedProject };
  }

  async delete(id) {
    await this.delay();
    const index = this.projects.findIndex(project => project.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Project with id ${id} not found`);
    }
    const deletedProject = this.projects.splice(index, 1)[0];
    return { ...deletedProject };
  }

  async addTaskToProject(projectId, taskId) {
    await this.delay();
    const project = this.projects.find(project => project.Id === parseInt(projectId));
    if (!project) {
      throw new Error(`Project with id ${projectId} not found`);
    }
    if (!project.tasks.includes(parseInt(taskId))) {
      project.tasks.push(parseInt(taskId));
    }
    return { ...project };
  }

  async removeTaskFromProject(projectId, taskId) {
    await this.delay();
    const project = this.projects.find(project => project.Id === parseInt(projectId));
    if (!project) {
      throw new Error(`Project with id ${projectId} not found`);
    }
    project.tasks = project.tasks.filter(id => id !== parseInt(taskId));
    return { ...project };
  }
}

export default new ProjectService();