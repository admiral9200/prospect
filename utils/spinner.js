import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

export default function Spinner({message}) {
    const antIcon = <LoadingOutlined style={{ fontSize: 24, marginBottom: '20px', color: '#51A760' }} spin />
    
    return (
        <div className='flex flex-col justify-center items-center'>
            <Spin indicator={antIcon} />
            <p>{ message && message }</p>
      </div>
    );
}
