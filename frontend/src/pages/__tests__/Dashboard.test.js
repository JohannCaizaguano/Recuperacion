import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Dashboard from '../Dashboard';
import { BrowserRouter } from 'react-router-dom';

// Mock the named exports from the api service
jest.mock('../../services/api', () => ({
    productsAPI: {
        getAll: jest.fn(),
    },
    transactionsAPI: {
        getAll: jest.fn(),
        getTotalTurnover: jest.fn(),
    },
    ordersAPI: {
        getAll: jest.fn(),
    },
}));

// Import the mocked objects to control them in tests
const { productsAPI, transactionsAPI, ordersAPI } = require('../../services/api');

describe('Dashboard Component Resilience', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Default error prevention if called unexpectedly
        console.error = jest.fn();
    });

    test('Req 3: Renderiza estado de carga inicialmente', () => {
        // Return pending promises to keep it in loading state
        productsAPI.getAll.mockReturnValue(new Promise(() => { }));
        transactionsAPI.getAll.mockReturnValue(new Promise(() => { }));
        transactionsAPI.getTotalTurnover.mockReturnValue(new Promise(() => { }));
        ordersAPI.getAll.mockReturnValue(new Promise(() => { }));

        render(
            <BrowserRouter>
                <Dashboard />
            </BrowserRouter>
        );

        expect(screen.getByText(/cargando/i)).toBeInTheDocument();
    });

    test('Req 3: Maneja respuestas vacias sin errores', async () => {
        // Return resolved empty data
        productsAPI.getAll.mockResolvedValue({ data: [] });
        // IMPORTANT: Check Dashboard.js logic for expected structure. 
        // It expects transactionsResult.value.data array
        transactionsAPI.getAll.mockResolvedValue({ data: [] });
        // It expects turnoverResult.value.data.totalTurnover
        transactionsAPI.getTotalTurnover.mockResolvedValue({ data: { totalTurnover: 0 } });
        ordersAPI.getAll.mockResolvedValue({ data: [] });

        render(
            <BrowserRouter>
                <Dashboard />
            </BrowserRouter>
        );

        // Wait for loading to disappear
        await waitFor(() => {
            expect(screen.queryByText(/cargando/i)).not.toBeInTheDocument();
        });

        // Check for dashboard content
        expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();

        // Check specific "0" values for empty data
        const zeroElements = screen.getAllByText('0');
        expect(zeroElements.length).toBeGreaterThan(0);

        // Check for "No recent transactions" text
        expect(screen.getByText(/No recent transactions/i)).toBeInTheDocument();
    });
});
