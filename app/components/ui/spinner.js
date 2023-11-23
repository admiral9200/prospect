import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

export default function Spinner({ message, size, color }) {
    const antIcon = <LoadingOutlined style={{ fontSize: size ?? 24, marginBottom: size ? null : '20px', color: color ?? '#9333ea' }} spin />

    return (
        <div className='flex flex-col justify-center items-center'>
            <Spin indicator={antIcon} />
            <p>{message ? message : null}</p>
        </div>
    );
}
