import React, { createContext, useContext } from 'react';

export type SDUIRenderingProps = {
    data: any;
    onAction?: (action: string, params?: any) => void;
};

// Break circular dependency by using a context for the renderer
export const RendererContext = createContext<React.FC<SDUIRenderingProps> | null>(null);

export type SDUIFormContextType = {
    values: Record<string, any>;
    onValueChange: (id: string, value: any) => void;
};

export const SDUIFormContext = createContext<SDUIFormContextType>({
    values: {},
    onValueChange: () => { },
});

export const useRenderer = () => {
    const renderer = useContext(RendererContext);
    if (!renderer) {
        // Fallback or early return if context is not provided
        return null;
    }
    return renderer;
};

export type SDUIRegistryMap = {
    [key: string]: React.FC<SDUIRenderingProps>;
};

const registry: SDUIRegistryMap = {};

export const registerComponent = (type: string, component: React.FC<SDUIRenderingProps>) => {
    registry[type] = component;
};

export const getComponent = (type: string): React.FC<SDUIRenderingProps> | undefined => {
    return registry[type];
};

export default registry;
