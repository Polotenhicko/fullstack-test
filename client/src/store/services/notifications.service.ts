class NotificationsService {
  public get maxId() {
    return this._maxId++;
  }

  private _maxId: number = 1;
}

const notificationService = new NotificationsService();

export default notificationService;
