import dealsData from "@/services/mockData/deals.json";

let deals = [...dealsData];

const delay = () => new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));

export const dealService = {
  async getAll() {
    await delay();
    return deals.map(deal => ({ ...deal }));
  },

  async getById(id) {
    await delay();
    const deal = deals.find(d => d.Id === parseInt(id));
    return deal ? { ...deal } : null;
  },

  async create(dealData) {
    await delay();
    const maxId = Math.max(...deals.map(d => d.Id), 0);
    const newDeal = {
      ...dealData,
      Id: maxId + 1,
      status: "Draft",
      dealDate: new Date().toISOString(),
      documents: []
    };
    deals.push(newDeal);
    return { ...newDeal };
  },

  async update(id, dealData) {
    await delay();
    const index = deals.findIndex(d => d.Id === parseInt(id));
    if (index !== -1) {
      deals[index] = { ...deals[index], ...dealData };
      return { ...deals[index] };
    }
    return null;
  },

  async delete(id) {
    await delay();
    const index = deals.findIndex(d => d.Id === parseInt(id));
    if (index !== -1) {
      const deletedDeal = deals.splice(index, 1)[0];
      return { ...deletedDeal };
    }
    return null;
  },

  async calculateFinancing(principal, downPayment, interestRate, termMonths) {
    await delay();
    const loanAmount = principal - downPayment;
    if (loanAmount <= 0) {
      return {
        loanAmount: 0,
        monthlyPayment: 0,
        totalInterest: 0,
        totalPayment: downPayment
      };
    }

    const monthlyRate = interestRate / 100 / 12;
    const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / (Math.pow(1 + monthlyRate, termMonths) - 1);
    const totalPayment = monthlyPayment * termMonths + downPayment;
    const totalInterest = totalPayment - principal;

    return {
      loanAmount,
      monthlyPayment: Math.round(monthlyPayment * 100) / 100,
      totalInterest: Math.round(totalInterest * 100) / 100,
      totalPayment: Math.round(totalPayment * 100) / 100
    };
  }
};