class NotificationsService {
  get maxId() {
    return this._maxId++;
  }

  _maxId = 1;
}

const notificationService = new NotificationsService();

export default notificationService;
