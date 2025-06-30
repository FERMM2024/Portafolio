import React from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

import errorOverlay from 'vscode-notebook-error-overlay';
import type { ActivationFunction } from 'vscode-notebook-renderer';
import { IssuesList } from './render';

// ----------------------------------------------------------------------------
// Este es el punto de entrada para el renderer del notebook.
// ----------------------------------------------------------------------------

export const activate: ActivationFunction = context => {
    return {
        renderOutputItem(outputItem, element) {
            let shadow = element.shadowRoot;
            if (!shadow) {
                shadow = element.attachShadow({ mode: 'open' });
                const rootDiv = document.createElement('div');
                rootDiv.id = 'root';
                shadow.append(rootDiv);
            }

            const rootDiv = shadow.querySelector<HTMLElement>('#root');
            if (!rootDiv) {
                throw new Error('Could not find root element');
            }

            errorOverlay.wrap(rootDiv, () => {
                rootDiv.innerHTML = '';
                const node = document.createElement('div');
                rootDiv.appendChild(node);

                const root = createRoot(node);
                root.render(
                    <IssuesList
                        info={{
                            container: node,
                            mime: outputItem.mime,
                            value: outputItem.json(),
                            context
                        }}
                    />
                );
            });
        },
        disposeOutputItem(_outputId) {
            // Aquí puedes limpiar recursos si es necesario.
        }
    };
};
