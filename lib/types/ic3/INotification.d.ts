import { NotificationLevel } from './NotificationLevel';
export interface INotification {
    id: string;
    message: string;
    level: NotificationLevel;
}
