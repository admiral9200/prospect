import { Handle } from "reactflow";

const CustomNodeComponent = ({ data }) => {
    return (
        <div className='customNodeClass flex items-center justify-center'>
            {data.label}
            <Handle
                type="source"
                position="bottom"
                style={{ background: '#555' }}
                onConnect={(params) => console.log('handle onConnect', params)}
            />
            <Handle
                type="target"
                position="top"
                style={{ background: '#555' }}
                onConnect={(params) => console.log('handle onConnect', params)}
            />
        </div>
    );
};

export default CustomNodeComponent;