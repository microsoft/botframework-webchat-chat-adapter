/*
 * Four levels on WebChat notifications; Items will be auto-ordered by severity
 * error > warn > info > success
 */

export enum NotificationLevel {
  Success = 'success', // green
  Info = 'info', // blue
  Warning = 'warn', // yellow
  Error = 'error' //red
}
