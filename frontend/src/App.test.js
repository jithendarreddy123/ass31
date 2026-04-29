import { render, screen } from '@testing-library/react';
import App from './App';
import axios from 'axios';

jest.mock('axios');

test('renders the MERN CRUD app title', async () => {
  axios.get.mockResolvedValue({ data: [] });

  render(<App />);

  expect(await screen.findByText(/MERN CRUD/i)).toBeInTheDocument();
});
