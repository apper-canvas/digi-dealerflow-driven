import leadsData from "@/services/mockData/leads.json";

let leads = [...leadsData];

const delay = () => new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));

export const leadService = {
  async getAll() {
    await delay();
    return leads.map(lead => ({ ...lead }));
  },

  async getById(id) {
    await delay();
    const lead = leads.find(l => l.Id === parseInt(id));
    return lead ? { ...lead } : null;
  },

  async create(leadData) {
    await delay();
    const maxId = Math.max(...leads.map(l => l.Id), 0);
    const newLead = {
      ...leadData,
      Id: maxId + 1,
      status: "New",
      leadScore: 50,
      contactHistory: [],
      appointments: []
    };
    leads.push(newLead);
    return { ...newLead };
  },

  async update(id, leadData) {
    await delay();
    const index = leads.findIndex(l => l.Id === parseInt(id));
    if (index !== -1) {
      leads[index] = { ...leads[index], ...leadData };
      return { ...leads[index] };
    }
    return null;
  },

  async delete(id) {
    await delay();
    const index = leads.findIndex(l => l.Id === parseInt(id));
    if (index !== -1) {
      const deletedLead = leads.splice(index, 1)[0];
      return { ...deletedLead };
    }
    return null;
  },

  async addContactHistory(id, contact) {
    await delay();
    const lead = leads.find(l => l.Id === parseInt(id));
    if (lead) {
      if (!lead.contactHistory) lead.contactHistory = [];
      lead.contactHistory.unshift({
        ...contact,
        date: new Date().toISOString()
      });
      lead.lastContact = new Date().toISOString();
      return { ...lead };
    }
    return null;
  },

  async scheduleAppointment(id, appointment) {
    await delay();
    const lead = leads.find(l => l.Id === parseInt(id));
    if (lead) {
      if (!lead.appointments) lead.appointments = [];
      lead.appointments.push({
        ...appointment,
        status: "Scheduled"
      });
      return { ...lead };
    }
    return null;
  }
};