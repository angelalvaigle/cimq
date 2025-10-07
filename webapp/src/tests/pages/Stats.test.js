// Stats.test.js
import { render, screen, waitFor } from '@testing-library/react';
import Stats from '../../pages/Stats';

jest.mock('react-router-dom', () => ({
  useLoaderData: jest.fn(),
}));

jest.mock('../../App', () => () => <div>Mock App</div>);

describe('Stats Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('it render the user stats', async () => {
    render(<Stats />);

    screen.debug();
    expect(screen.getByText(/total\s*games/i)).toBeInTheDocument();
    expect(screen.getByText(/playing\s*time/i)).toBeInTheDocument();
    expect(screen.getByText(/points/i)).toBeInTheDocument();
    expect(screen.getByText(/incorrect\s*answers/i)).toBeInTheDocument();
    expect(screen.getByText('correct answers')).toBeInTheDocument();
  });
});
