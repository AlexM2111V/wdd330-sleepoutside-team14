export default class Alert {
  constructor() {
    this.alerts = [];
  }

  //fetch alerts
  async loadAlerts() {
    try {
      const response = await fetch('/json/alerts.json');
      if (response.ok) {
        this.alerts = await response.json();
      }
    } catch (error) {
      console.error('No alerts file found or error loading alerts');
    }
  }

  //create alerts
  createAlertElements() {
    if (this.alerts.length === 0) return null;

    const alertSection = document.createElement('section');
    alertSection.className = 'alert-list';

    this.alerts.forEach(alert => {
      const alertElement = document.createElement('p');
      alertElement.textContent = alert.message;
      alertElement.style.backgroundColor = alert.background || '#f0f0f0';
      alertElement.style.color = alert.color || '#000';
      alertElement.style.padding = '10px';
      alertElement.style.margin = '5px 0';
      alertElement.style.borderRadius = '4px';
      
      alertSection.appendChild(alertElement);
    });

    return alertSection;
  }

  //display functions
  async displayAlerts(targetElement = 'main') {
    await this.loadAlerts();
    const alertSection = this.createAlertElements();
    
    if (alertSection) {
      const mainElement = document.querySelector(targetElement);
      if (mainElement) {
        mainElement.prepend(alertSection);
      }
    }
  }
}