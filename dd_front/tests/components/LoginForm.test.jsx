import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

// Mock du composant LoginForm
const MockLoginForm = ({ onSubmit, onError }) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (!email || !password) {
        throw new Error('Email et mot de passe requis');
      }
      
      await onSubmit({ email, password });
    } catch (error) {
      onError?.(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} data-testid="login-form">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        data-testid="email-input"
        disabled={isLoading}
      />
      <input
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        data-testid="password-input"
        disabled={isLoading}
      />
      <button 
        type="submit" 
        disabled={isLoading}
        data-testid="submit-button"
      >
        {isLoading ? 'Connexion...' : 'Se connecter'}
      </button>
    </form>
  );
};

describe('LoginForm Component', () => {
  const mockOnSubmit = jest.fn();
  const mockOnError = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders login form elements', () => {
    render(<MockLoginForm onSubmit={mockOnSubmit} onError={mockOnError} />);
    
    expect(screen.getByTestId('email-input')).toBeInTheDocument();
    expect(screen.getByTestId('password-input')).toBeInTheDocument();
    expect(screen.getByTestId('submit-button')).toBeInTheDocument();
  });

  test('allows user to type in email field', async () => {
    const user = userEvent.setup();
    render(<MockLoginForm onSubmit={mockOnSubmit} onError={mockOnError} />);
    
    const emailInput = screen.getByTestId('email-input');
    await user.type(emailInput, 'test@example.com');
    
    expect(emailInput).toHaveValue('test@example.com');
  });

  test('allows user to type in password field', async () => {
    const user = userEvent.setup();
    render(<MockLoginForm onSubmit={mockOnSubmit} onError={mockOnError} />);
    
    const passwordInput = screen.getByTestId('password-input');
    await user.type(passwordInput, 'password123');
    
    expect(passwordInput).toHaveValue('password123');
  });

  test('calls onSubmit with correct data when form is submitted', async () => {
    const user = userEvent.setup();
    mockOnSubmit.mockResolvedValue();
    
    render(<MockLoginForm onSubmit={mockOnSubmit} onError={mockOnError} />);
    
    await user.type(screen.getByTestId('email-input'), 'test@example.com');
    await user.type(screen.getByTestId('password-input'), 'password123');
    await user.click(screen.getByTestId('submit-button'));
    
    expect(mockOnSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123'
    });
  });

  test('shows loading state during submission', async () => {
    const user = userEvent.setup();
    mockOnSubmit.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    
    render(<MockLoginForm onSubmit={mockOnSubmit} onError={mockOnError} />);
    
    await user.type(screen.getByTestId('email-input'), 'test@example.com');
    await user.type(screen.getByTestId('password-input'), 'password123');
    
    const submitButton = screen.getByTestId('submit-button');
    await user.click(submitButton);
    
    expect(submitButton).toHaveTextContent('Connexion...');
    expect(submitButton).toBeDisabled();
    
    await waitFor(() => {
      expect(submitButton).toHaveTextContent('Se connecter');
      expect(submitButton).not.toBeDisabled();
    });
  });

  test('calls onError when validation fails', async () => {
    const user = userEvent.setup();
    
    render(<MockLoginForm onSubmit={mockOnSubmit} onError={mockOnError} />);
    
    // Soumettre sans remplir les champs
    await user.click(screen.getByTestId('submit-button'));
    
    expect(mockOnError).toHaveBeenCalledWith('Email et mot de passe requis');
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  test('disables form fields during loading', async () => {
    const user = userEvent.setup();
    mockOnSubmit.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    
    render(<MockLoginForm onSubmit={mockOnSubmit} onError={mockOnError} />);
    
    await user.type(screen.getByTestId('email-input'), 'test@example.com');
    await user.type(screen.getByTestId('password-input'), 'password123');
    await user.click(screen.getByTestId('submit-button'));
    
    expect(screen.getByTestId('email-input')).toBeDisabled();
    expect(screen.getByTestId('password-input')).toBeDisabled();
    
    await waitFor(() => {
      expect(screen.getByTestId('email-input')).not.toBeDisabled();
      expect(screen.getByTestId('password-input')).not.toBeDisabled();
    });
  });
});