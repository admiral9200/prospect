import { notification } from 'antd';

export default function useNotification() {
  type NotificationType = 'success' | 'info' | 'warning' | 'error';
  let border:string

  const [api, notificationContext] = notification.useNotification();

  const openNotificationWithIcon = (type: NotificationType, message: string, description?: string) => {
    if (type === 'success')
      border = '#00AB55'

    if(type === 'error')
      border = 'red'
    
    if(type === 'info')
      border = 'blue'

    if(type === 'warning')
      border = '#E7B10A';


    api[type]({
      message,
      description,
      placement: 'top',
      style: {
        border: `1px solid ${border}`
      }
    });
  };

  return [notificationContext, openNotificationWithIcon]
}
