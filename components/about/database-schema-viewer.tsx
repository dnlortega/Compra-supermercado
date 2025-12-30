"use client";

import React, { useCallback } from 'react';
import {
    ReactFlow,
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    Connection,
    Edge,
    Node,
    Position,
    Handle,
} from 'reactflow'; // ReactFlow changed package name recently, but let's stick to 'reactflow' if installed or verify. 
// Wait, I installed 'reactflow' which is the older package, or '@xyflow/react'? 
// The user command was `npm install reactflow`. So I import from 'reactflow'.

import 'reactflow/dist/style.css';

// Custom Node Component for Tables
const TableNode = ({ data }: { data: { label: string; columns: string[] } }) => {
    return (
        <div className="bg-background border-2 border-primary rounded-lg shadow-xl min-w-[200px] overflow-hidden">
            <div className="bg-primary p-2">
                <h3 className="text-primary-foreground font-bold text-center text-xs uppercase tracking-wider">{data.label}</h3>
            </div>
            <div className="p-2 space-y-1 bg-card">
                {data.columns.map((col, i) => (
                    <div key={i} className="text-[10px] font-mono border-b border-muted last:border-0 py-1 flex justify-between">
                        <span>{col.split(':')[0]}</span>
                        <span className="text-muted-foreground">{col.split(':')[1]}</span>
                    </div>
                ))}
            </div>
            <Handle type="target" position={Position.Left} className="!bg-primary" />
            <Handle type="source" position={Position.Right} className="!bg-primary" />
        </div>
    );
};

const nodeTypes = {
    table: TableNode,
};

const INITIAL_NODES: Node[] = [
    {
        id: 'user',
        type: 'table',
        position: { x: 0, y: 0 },
        data: {
            label: 'User',
            columns: ['id: String', 'email: String', 'name: String', 'image: String']
        },
    },
    {
        id: 'shopping_list',
        type: 'table',
        position: { x: 300, y: -100 },
        data: {
            label: 'ShoppingList',
            columns: ['id: String', 'userId: FK', 'status: Enm', 'total: Float', 'date: Date']
        },
    },
    {
        id: 'shared_access',
        type: 'table',
        position: { x: 0, y: 250 },
        data: {
            label: 'SharedAccess',
            columns: ['id: String', 'sharedById: FK', 'sharedToId: FK']
        },
    },
    {
        id: 'shopping_list_item',
        type: 'table',
        position: { x: 600, y: -100 },
        data: {
            label: 'ShoppingListItem',
            columns: ['id: String', 'listId: FK', 'prodId: FK', 'qty: Float', 'price: Float']
        },
    },
    {
        id: 'catalog_product',
        type: 'table',
        position: { x: 600, y: 150 },
        data: {
            label: 'CatalogProduct',
            columns: ['id: String', 'name: String', 'catId: FK']
        },
    },
    {
        id: 'price_history',
        type: 'table',
        position: { x: 300, y: 200 },
        data: {
            label: 'PriceHistory',
            columns: ['id: String', 'prodId: FK', 'price: Float', 'date: Date']
        },
    }
];

const INITIAL_EDGES: Edge[] = [
    // User Relations
    { id: 'e-user-list', source: 'user', target: 'shopping_list', animated: true, style: { strokeWidth: 2 } },
    { id: 'e-user-share1', source: 'user', target: 'shared_access', animated: true },
    { id: 'e-user-share2', source: 'user', target: 'shared_access' },

    // List Relations
    { id: 'e-list-item', source: 'shopping_list', target: 'shopping_list_item', animated: true },

    // Item Relations
    // We connect CatalogProduct to Item, but visually it might be better right to left or whatever.
    // Let's assume Catalog -> Item
    { id: 'e-catalog-item', source: 'catalog_product', target: 'shopping_list_item', animated: true },

    // Price History
    { id: 'e-catalog-price', source: 'catalog_product', target: 'price_history', animated: true },
];

export default function DatabaseSchemaViewer() {
    const [nodes, setNodes, onNodesChange] = useNodesState(INITIAL_NODES);
    const [edges, setEdges, onEdgesChange] = useEdgesState(INITIAL_EDGES);

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge(params, eds)),
        [setEdges],
    );

    return (
        <div style={{ width: '100%', height: '500px' }} className="border rounded-2xl overflow-hidden shadow-inner bg-zinc-50 dark:bg-zinc-900/50">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                fitView
                className="bg-zinc-50 dark:bg-zinc-900"
                attributionPosition="bottom-right"
            >
                <Background color="#888" gap={16} size={1} />
                <Controls />
                <MiniMap style={{ background: 'var(--background)' }} nodeColor={'var(--primary)'} />
            </ReactFlow>
        </div>
    );
}
