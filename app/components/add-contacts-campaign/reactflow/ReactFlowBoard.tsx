import { useMemo, useState } from 'react';
import ReactFlow, {
    MiniMap,
    Controls,
    addEdge,
} from 'reactflow';
import 'reactflow/dist/style.css';

import FirstNode from './nodes/FirstNode';
import ConnectionNode from './nodes/ConnectionNode';
import CustomNodeComponent from './custom-node/CustomNodeComponent';
import SequenceBuildModal from './SequenceBuildModal';

interface ReactFlowProps {
    action: string,
    condition: string,
    setAction: any,
    setCondition: any,
    initialNodes: any,
    initialEdges: any
}

const nodeTypes = {
    customNodeType: CustomNodeComponent
}

const ReactFlowBoard = ({
    action,
    condition,
    setAction,
    setCondition,
    initialEdges,
    initialNodes
}: ReactFlowProps) => {
    // modal settings...
    const [open, setOpen] = useState<boolean>(false);



    const [nodes, setNodes] = useState<any>(initialNodes);
    const [edges, setEdges] = useState<any>(initialEdges);



    return (
        <div>
            {/* modal to choose an item... */}
            <SequenceBuildModal
                open={open}
                setOpen={setOpen}
                setAction={setAction}
                setCondition={setCondition}
            />


            {/* react flow board to display a diagram */}
            <ReactFlow
                id='flow-panel'
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                className='w-full min-h-[1050px] '
            >
                <Controls />
                <MiniMap />
            </ReactFlow>
        </div>
    )
}

export default ReactFlowBoard;