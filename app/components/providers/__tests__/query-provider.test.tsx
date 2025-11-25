import { render } from '@testing-library/react';
import { QueryProvider } from '../query-provider';
import { useQuery } from '@tanstack/react-query';
import '@testing-library/jest-dom';

function TestComponent() {
  const query = useQuery({
    queryKey: ['test'],
    queryFn: async () => 'success',
  });
  return <div>{query.data}</div>;
}

describe('QueryProvider', () => {
  it('renders children and provides QueryClient context', async () => {
    const { findByText } = render(
      <QueryProvider>
        <TestComponent />
      </QueryProvider>,
    );

    expect(await findByText('success')).toBeInTheDocument();
  });
});
